import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js';
import Header from './components/page/header/header_handler';
import { Proportions } from 'lucide-react';
import Quote from './components/page/quote/quote_handler';
import Hero from './components/page/hero/hero_handler';
import List from './components/page/list/list_handler';
import ImageHandler from './components/page/image/image_handler';
import { hs } from './lib/utils';
import type {HeroContent, ImageContent, ListContent, QuoteContent, SiteComponent as OriginalSiteComponent, VotingContent} from '../supabase/functions/createSite/types'
import { Moodboard } from './components/page/moodboard/moodboard';
import { Button } from './components/ui/button';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import VotingHandler from './components/page/voting/voting_handler';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
type SiteComponent = (OriginalSiteComponent | { type: "moodboard", content: {} }) & { variant: string, id: number };

export interface UserData {
  id: number;
  twitter_username: string;
  score: number;
  colors: string[];
  banner_url: string;
  name: string;
  pfp_url: string;
  twitter_bio: string;
  aura_description: string;
  twitter_id_str: string;
  background_color: string;
  banner_colors: string[];
  pfp_colors: string[];
  primary_color: string;
  secondary_color: string;
}



export default function Site() {
    const user = useLocation().pathname.split('/')[2];
    const [userData, setUserData] = useState<UserData | null>(null);
    const [siteOutline, setSiteOutline] = useState<SiteComponent[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const { data, error } = await supabase
                    .from('sites')
                    .select('*')
                    .eq('twitter_username', user)
                    .single();

                if (error) throw error;

                const parsedData: UserData = {
                    ...data,
                    colors: JSON.parse(data.colors),
                    banner_colors: JSON.parse(data.banner_colors),
                    pfp_colors: JSON.parse(data.pfp_colors),
                };

                setUserData(parsedData);

                const { data: componentData, error: componentErr } = await supabase
                    .from('components')
                    .select('*')
                    .eq('site_id', parsedData.id)
                if (componentErr) throw componentErr;
                if (componentData) {
                    const mappedComponents: SiteComponent[] = componentData.map(component => ({
                        type: component.component_name as "hero" | "image" | "list" | "quote" | "voting" | "moodboard",
                        content: JSON.parse(component.component_options),
                        variant: component.variant,
                        id: component.id
                    }));
                    setSiteOutline(mappedComponents);
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [user]);

    if (loading) return <span>Loading...</span>;
    if (error || !userData) return <div className='flex items-center justify-center text-3xl text-red-800 font-bold'>Error: User not found</div>;

    const organizedComponentsObj = organizeComponents(siteOutline || [], userData.twitter_username);

    return (
        <HelmetProvider>
            <div className='min-h-screen min-w-screen relative ' style={{background: userData.background_color}}>
                <Helmet>
                    <link rel="shortcut icon" href={userData.pfp_url} />
                    <meta name="description" content={userData.twitter_bio} />
                    <title>{userData.name}'s Aura Site</title>
                </Helmet>
                <Button 
                    onClick={() => shareToTwitter(userData.twitter_username)}
                    className="fixed top-4 right-4 z-50 font-bold "
                >
                    Share
                </Button>
                <Header {...userData} />
                {organizedComponentsObj.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex flex-row items-center justify-center">
                        {row.map((component, colIndex) => (
                            <div key={`${rowIndex}-${colIndex}`} className={`w-full ${row.length > 1 ? `md:w-1/${row.length}` : ''}`}>
                                {renderComponent(component, userData)}
                            </div>
                        ))}
                    </div>
                ))}
                {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
                {/* <pre>{JSON.stringify(siteOutline, null, 2)}</pre> */}
            </div>
        </HelmetProvider>
    );
}

function renderComponent(component: SiteComponent, userData: UserData) {
    switch (component.type) {
        case 'hero': return <Hero userData={userData} heroContent={component.content as HeroContent} variant={component.variant} />
        case 'quote': return <Quote userData={userData} quoteContent={component.content as QuoteContent} variant={component.variant} />
        case 'list': return <List userData={userData} listContent={component.content as ListContent} variant={component.variant} />
        case 'image': return <ImageHandler userData={userData} imageContent={component.content as ImageContent} variant={component.variant} />
        case 'moodboard': return <Moodboard colors={userData.colors} variant={component.variant} />
        case 'voting': return <VotingHandler component_id={component.id} userData={userData} votingContent={component.content as VotingContent} variant={component.variant} />  
        default: return null;
    }
}

function organizeComponents(components: SiteComponent[], username: string): SiteComponent[][] {
  // Deterministic shuffle using hs function
  const shuffledComponents = [...components].sort((a, b) => {
    return hs(username + a.type, 1000) - hs(username + b.type, 1000);
  });

  // Separate image components from non-image components
  const imageComponents = shuffledComponents.filter(c => c.type === 'image');
  const nonImageComponents = shuffledComponents.filter(c => c.type !== 'image');
  
  const reorderedComponents = [...nonImageComponents];

  // 90% chance to include the banner image
  if (imageComponents.length > 0 && hs(username + 'banner', 100) / 100 < 0.4) {
    reorderedComponents.push(imageComponents[0]);
  }
    // 30% chance to include the pfp image if banner is included
    if (imageComponents.length > 1 && hs(username + 'pfp', 100) / 100 < .99) {
      reorderedComponents.push(imageComponents[1]);
    }
  

  // Add Moodboard with different likelihoods based on variant
  const moodboardLikelihood = {
    minimalist: 0.2,
    playful: 0.6,
    bold: 0.4,
    retro: 0.5,
    nature: 0.3,
    futuristic: 0.7,
    elegant: 0.3,
    industrial: 0.4,
    bohemian: 0.5,
    cyberpunk: 0.8,
    vintage: 0.4,
    tropical: 0.5,
    zen: 0.3,
    neon: 0.7,
    rustic: 0.3,
  };

  // Add this type definition at the top of your file
  type MoodboardVariant = 'minimalist' | 'playful' | 'bold' | 'retro' | 'nature' | 'futuristic' | 'elegant' | 'industrial' | 'bohemian' | 'cyberpunk' | 'vintage' | 'tropical' | 'zen' | 'neon' | 'rustic';

  const variant = components[0]?.variant as MoodboardVariant || 'minimalist';
  if (hs(username + 'moodboard', 100) / 100 < moodboardLikelihood[variant]) {
    reorderedComponents.push({ type: 'moodboard', content: {}, variant, id: hs(username + 'moodboard_id', 1000000) });
  }

  const rows: SiteComponent[][] = [];
  let currentRow: SiteComponent[] = [];
  let lastType: string | null = null;

  reorderedComponents.forEach((component, index) => {
    if (component.type === 'hero' || component.type === 'quote' || component.type === 'list') {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
      lastType = component.type;
    } else if (component.type === 'image') {
      if (currentRow.length === 2 || (lastType === 'image' && currentRow.length === 1)) {
        rows.push(currentRow);
        currentRow = [];
      }
      lastType = 'image';
    } else {
      lastType = null;
    }

    currentRow.push(component);

    // Ensure each row has at most 2 columns
    if (currentRow.length === 2) {
      rows.push(currentRow);
      currentRow = [];
      lastType = null;
    }
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

function shareToTwitter(username: string) {
    const texts = [
        `my aura made a site, its insane https://yourwebsite.com/${username}`,
        `My digital aura has been transformed into a monstrosity. Take a look! https://yourwebsite.com/${username}`,
        `this is the worst website ever seen https://yourwebsite.com/${username}`,
        `an AI did WHAT with my aura (not clickbait) . https://yourwebsite.com/${username}`
    ];
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(randomText)}`;
    window.open(url, '_blank');
}
