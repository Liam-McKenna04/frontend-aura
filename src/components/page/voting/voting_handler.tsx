import { useEffect, useState } from "react"
import { hs } from "@/lib/utils"
import { UserData } from "@/Site"
import { VotingContent } from "../../../../supabase/functions/createSite/types"
import VotingMinimalist from "./VotingMinimalist"
import VotingPlayful from "./VotingPlayful"
import VotingElegant from "./VotingElegant"
import VotingCyberpunk from "./VotingCyberpunk"
import debounce from "lodash/debounce"
interface VotingHandlerProps {
  userData: UserData
  votingContent: VotingContent
  variant: string
  component_id: number
}
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export default function VotingHandler({ userData, votingContent, variant, component_id }: VotingHandlerProps) {
  const [votes, setVotes] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVotes = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('id', component_id)
        .single();

      if (error) {
        console.error('Error fetching votes:', error);
      } else if (data && data.voting_array) {
        const votesArray = JSON.parse(data.voting_array);
        const updatedVotes: Record<string, number> = {};
        votingContent.options.forEach((category, index) => {
          updatedVotes[category] = votesArray[index] || 0;
        });
        setVotes(updatedVotes);
      } else {
        // If no data, initialize with zeros
        const initialVotes = Object.fromEntries(votingContent.options.map(category => [category, 0]));
        setVotes(initialVotes);
      }
      setIsLoading(false);
    };

    fetchVotes();
  }, [component_id, votingContent.options]);

  //add supabase updating when state changes with debouncing 
  useEffect(() => {
    const debouncedUpdate = debounce(async () => {
      // Convert votes object to array
      const votesArray = Object.values(votes)
      const {error} = await supabase.from('components').update({ voting_array: JSON.stringify(votesArray) }).eq('id', component_id)
      if (error) console.error('Error updating votes:', error)
    }, 500)
    debouncedUpdate()
  }, [votes])

  const variantToComponentMap = {
    minimalist: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    playful: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    elegant: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    cyberpunk: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    nature: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    futuristic: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    industrial: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    bohemian: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    vintage: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    tropical: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    zen: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    neon: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
    rustic: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />, <VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />],
  }

  const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} userData={userData} />]
  const votingChoice = hs(userData.twitter_username + "voting", selectedComponents.length)

  if (isLoading) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div className="px-20 py-10">
      {selectedComponents[votingChoice]}
    </div>
  )
}
