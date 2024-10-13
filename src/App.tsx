import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { createClient } from "@supabase/supabase-js";
// Add this import
import { Loader2 } from "lucide-react"

// Updated Analysis type
type Analysis = {
  id: number;
  twitter_username: string;
  score: number;
  colors: string[];
  name: string;
  pfp_url: string;
  aura_description: string;
  primary_color: string;
  secondary_color: string;
}

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function App() {
  const [username, setUsername] = useState('')
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([])

  useEffect(() => {
    const getRecentSites = async () => {
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('id, twitter_username, score, colors, name, pfp_url, aura_description, primary_color, secondary_color')
          .order('created_at', { ascending: false })
          .limit(20)

        if (error) throw error;

        const parsedData: Analysis[] = data.map(site => ({
          ...site,
          colors: JSON.parse(site.colors),
        }));

        setRecentAnalyses(parsedData);
      } catch (error) {
        console.error('Error fetching recent sites:', error);
      }
    }

    getRecentSites();
  }, [])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [previewAnalysis, setPreviewAnalysis] = useState<Analysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    try {
      setIsLoading(true)
      // First, check if the user already exists in the database
      const { data: existingUser, error: fetchError } = await supabase
        .from('sites')
        .select('twitter_username')
        .eq('twitter_username', username.trim())
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        console.error('Error fetching existing user:', fetchError)
        throw fetchError
      }

      if (existingUser) {
        // User already exists, redirect to their site
        window.location.href = `/site/${existingUser.twitter_username}`
        return
      }

      // User doesn't exist, proceed with analysis
      const { data, error } = await supabase.functions.invoke('createSite', {
        body: { username: username.trim() }
      })

      if (error) {
        console.error('Function error:', error)
        throw error
      }

      if (typeof data === 'string') {
        // If data is a string, it might be HTML or an error message
        console.error('Unexpected response format:', data)
        throw new Error('Received unexpected response format from server')
      }

      if (!data || typeof data !== 'object') {
        console.error('Invalid data format:', data)
        throw new Error('Received invalid data format from server')
      }

      console.log('Function response:', data)

      const newAnalysis: Analysis = {
        id: Date.now(),
        twitter_username: `@${username}`,
        score: data.score || 0,
        colors: Array.isArray(data.colors) ? data.colors : [],
        name: data.name || username,
        pfp_url: data.pfp_url || '',
        aura_description: data.siteOutline?.aura || '',
        primary_color: data.primary_color || data.colors?.[0] || '',
        secondary_color: data.secondary_color || data.colors?.[1] || '',
      }

      setPreviewAnalysis(newAnalysis)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Error analyzing site:', error)
      
      // Show an error message to the user
      alert(`Error analyzing site: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmAnalysis = () => {
    if (previewAnalysis) {
      setRecentAnalyses([previewAnalysis, ...recentAnalyses.slice(0, 5)])
      setUsername('')
      setIsDialogOpen(false)
      // Navigate to the site
      window.location.href = `/site/${previewAnalysis.twitter_username.slice(1)}`
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center p-8">
      <header className="w-full max-w-2xl mb-8">
        <div className="flex items-center mb-2">
          <img src="https://pbs.twimg.com/profile_images/1737507883850375169/aBB2_0QX_400x400.jpg" alt="Profile" width={24} height={24} className="rounded-full mr-2" />
          <span>made by <a href="https://twitter.com/aert0_" className="underline">@aert0_</a></span>
        </div>
        <div>inspired by <a href="https://auralized.com" className="underline">auralized</a> and <a className='underline' href='https://x.com/rrawnyy'>@rrawnyy</a></div> 
      </header>

      <main className="w-full max-w-2xl">
        <div className="border-2 border-black rounded-3xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-4 text-center">MAKE A CHAOTIC SITE BASED ON YOUR AURA</h1>
          <div className="flex">
            <Input
              type="text"
              placeholder="Twitter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Sites</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {recentAnalyses.map((analysis) => (
              <CarouselItem key={analysis.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="border-2 border-black rounded-2xl p-4">
                  <div className="flex items-center mb-2">
                    <img src={analysis.pfp_url || "/placeholder.svg"} alt="Profile" width={32} height={32} className="rounded-full mr-2" />
                    <a className="font-bold underline" href={`https://x.com/${analysis.twitter_username}`}>@{analysis.twitter_username}</a>
                  </div>
                  <div className="mb-2">{analysis.score} / 10</div>
                  <div className="flex h-4 mb-2">
                    {analysis.colors.map((color, i) => (
                      <div key={i} style={{backgroundColor: color}} className="flex-grow"></div>
                    ))}
                  </div>
                  <p className="text-sm my-2">{analysis.aura_description}</p>
                  <a href={`/site/${analysis.twitter_username}`}>
                    <Button className="text-sm hover:underline">
                      View Site
                    </Button>
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Here is a preview of your site</DialogTitle>
            <DialogDescription>Sitemaker 3000 thinks you are wonderful, but we'll see what the site looks like</DialogDescription>
          </DialogHeader>
          {previewAnalysis && (
            <div className="border-2 border-black rounded-2xl p-4">
              <div className="flex items-center mb-4">
                <div>
                  <div className="font-bold text-lg">{previewAnalysis.name}</div>
                  <a className="text-gray-600 underline" href={`https://x.com/${previewAnalysis.twitter_username}`}>{previewAnalysis.twitter_username}</a>
                </div>
              </div>
              <div className="mb-4">YOUR AURA RATING: <span className='font-bold'>{previewAnalysis.score} / 10</span></div>
              <div className='mt-4 text-lg'>Sitemaker's impression of you: </div>
              <p className="text-md mb-4 pl-5 italic border-b-2 border-black">{previewAnalysis.aura_description}</p>

              <div className="flex h-4 my-4">
                {previewAnalysis.colors.map((color, i) => (
                  <div key={i} style={{backgroundColor: color}} className="flex-grow"></div>
                ))}
              </div>
              
              <Button onClick={handleConfirmAnalysis} className="w-full" variant={'default'}>Go to Site</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
