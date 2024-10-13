// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import "jsr:@std/dotenv/load";

import { corsHeaders } from '../_shared/cors.ts'
import { supabaseClient } from '../_shared/supabaseClient.ts'

import { createDescriptors } from './descriptorsCreation.ts'
import { siteOutlinePrompt } from './prompts.ts'
import { SiteOutline, ImageContent } from './types.ts'
console.log("Hello from Functions!")
// @ts-ignore
const socialDataApiKey = Deno.env.get("SOCIALDATA_API_KEY")
// @ts-ignore
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")

async function insertSiteComponents(siteId, components, globalVariant) {
  const formattedComponents = components.map(component => ({
    site_id: siteId,
    component_name: component.type,
    component_options: JSON.stringify(component.content),
    voting_array: component.content.options 
      ? JSON.stringify(new Array(component.content.options.length).fill(0))
      : null,
    variant: globalVariant 
  }));

  const { error } = await supabaseClient
    .from('components')
    .insert(formattedComponents);

  if (error) {
    console.error("Error inserting components:", error);
  } else {
    console.log("Components inserted successfully!");
  }
}


// @ts-ignore
Deno.serve(async (req) => {

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    
    const { username } = await req.json()
    
    if (!username) {
      throw new Error('Username is required')
    }

    const socialDataResponse = await fetch(`https://api.socialdata.tools/twitter/user/${username}`, {
      headers: { 
        'Authorization': `Bearer ${socialDataApiKey}`,
        'Accept': 'application/json'
      }
    });
    
    if (!socialDataResponse.ok) {
      console.error(`Error fetching user data: ${socialDataResponse.status}`);
      throw new Error('Failed to fetch user data');
    }
    const userData = await socialDataResponse.json();
   
    // Fetch user's tweets
    const tweetsResponse = await fetch(`https://api.socialdata.tools/twitter/user/${userData.id_str}/tweets`, {
      headers: { 
        'Authorization': `Bearer ${socialDataApiKey}`,
        'Accept': 'application/json'
      }
    });

    if (!tweetsResponse.ok) {
      console.error(`Error fetching tweets: ${tweetsResponse.status}`);
      throw new Error('Failed to fetch user tweets');
    }
    const tweetsData = await tweetsResponse.json();
    const tweetTexts = tweetsData.tweets.map((tweet: any) => tweet.full_text).join('\n');

    const descriptors = await createDescriptors(userData);

    const prompt = `
    You are an expert at making unique websites for users given their vibe, 
    consider the vibe of the user given by the colors provided : ${JSON.stringify(descriptors.colors)}.
    Here are some recent tweets from the user to help you understand their vibe to transfer to the site:\n\n${tweetTexts} || 
    Be creative when generating text, and choose components that best represent the user's vibe.
`
    console.log('descriptors: ', descriptors)
    // Site creation with OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        ...siteOutlinePrompt,
        messages: [
          ...siteOutlinePrompt.messages,
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      const errorBody = await openaiResponse.text();
      throw new Error(`OpenAI API error: ${openaiResponse.status}, ${errorBody}`);
    }

    const openaiData = await openaiResponse.json();
    const siteOutline = JSON.parse(openaiData.choices[0].message.content) as SiteOutline;

    console.log('siteOutline: ', siteOutline)

    // Process profile picture and banner
    const pfpDescription = await getImageDescription(userData.profile_image_url_https);
    const pfpSimilarImages = await searchSimilarImages(pfpDescription, descriptors.closestNamedColor);

    const bannerDescription = await getImageDescription(userData.profile_banner_url);
    const bannerSimilarImages = await searchSimilarImages(bannerDescription, descriptors.closestNamedColor);

    // Add similar images to siteOutline
    siteOutline.selected_components.push({
      type: 'image',
      content: { description: pfpDescription, similarImages: pfpSimilarImages, baseImageUrl: userData.profile_image_url_https },
      variant: 'minimalist'
    });
    siteOutline.selected_components.push({
      type: 'image',
      content: { description: bannerDescription, similarImages: bannerSimilarImages, baseImageUrl: userData.profile_banner_url },
      variant: 'minimalist'
    });

    const data = {
      message: `Site created for ${username}`,
      ...descriptors,
      siteOutline
    }

      const { data: dataSiteUpload, error: errorSiteUpload } = await supabaseClient
        .from('sites')
        .insert({
          twitter_username: username,
          score: descriptors.score,
          colors: JSON.stringify(descriptors.colors),
          twitter_bio: userData.description,
          pfp_url: userData.profile_image_url_https,
          name: userData.name,
          banner_url: userData.profile_banner_url,
          aura_description: '',
          twitter_id_str: userData.id_str,
          primary_color: descriptors.primaryColor,
          secondary_color: descriptors.secondaryColor,
          background_color: descriptors.backgroundColor,
          pfp_colors: descriptors.profileColors,
          banner_colors: descriptors.bannerColors
        });

      if (errorSiteUpload) {
        console.error('Error uploading site data:', errorSiteUpload);
        throw new Error('Failed to upload site data');
      }

      if (dataSiteUpload && dataSiteUpload.length > 0) {
        await insertSiteComponents(dataSiteUpload[0].id, siteOutline.selected_components, siteOutline.global_variant);
      } else {
        throw new Error('No site data returned after insert');
      }
  
    
    console.log(data)
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function getImageDescription(imageUrl: string) {
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Describe this image in a short, concise phrase (5-7 words max) that captures its main elements and vibe, as well as the characters present if there are any. Make it suitable for a Google image search query. The vibe is the important part.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 50
    })
  });

  if (!openaiResponse.ok) {
    const errorBody = await openaiResponse.text();
    throw new Error(`OpenAI API error: ${openaiResponse.status}, ${errorBody}`);
  }

  const openaiData = await openaiResponse.json();
  let content = openaiData.choices[0].message.content;
  
  // Remove enclosing quotes if present
  content = content.replace(/^["'](.*)["']$/, '$1');
  
  return content;
}

async function searchSimilarImages(description: string, color: string) {
  // @ts-ignore
  const apiKey = Deno.env.get('GOOGLE_API_KEY')
  const cx = 'e7e641ef5167547e4';
  const query = encodeURIComponent(`${description}, aesthetic, vibe, ${color}`); // try other things like color
  console.log('query: ', query)
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&searchType=image&q=${query}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Custom Search API error: ${response.status}`);
  }
  const data = await response.json();
  console.log('data: ', data)
  
  // Extract and return only the image URLs
  return data.items ? data.items.map(item => item.link) : [];
}
