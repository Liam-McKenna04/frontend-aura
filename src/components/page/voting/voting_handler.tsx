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
  const [votes, setVotes] = useState<Record<string, number>>(() => 
    Object.fromEntries(votingContent.options.map(category => [category, 0]))
  )
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

  //fetch votes when component is mounted
  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .eq('id', component_id)
        .single();

      if (error) {
        console.error('Error fetching votes:', error);
      } else if (data && data.voting_array) {
        console.log('data', data);
        const votesArray = JSON.parse(data.voting_array);
        setVotes(prevVotes => {
          const updatedVotes = { ...prevVotes };
          votingContent.options.forEach((category, index) => {
            updatedVotes[category] = votesArray[index] || 0;
          });
          return updatedVotes;
        });
      }
    };

    fetchVotes();
  }, [component_id, votingContent.options]);

  

  const variantToComponentMap = {
    minimalist: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    playful: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    elegant: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    cyberpunk: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    nature: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    futuristic: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    industrial: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    bohemian: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    vintage: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    tropical: [<VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    zen: [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    neon: [<VotingCyberpunk categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingPlayful categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
    rustic: [<VotingElegant categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />, <VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />],
  }

  const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<VotingMinimalist categories={votingContent.options} votes={votes} setVotes={setVotes} question={votingContent.question} />]
  const votingChoice = hs(userData.twitter_username + "voting", selectedComponents.length)

  return (
    <div className="px-20 py-10">
      {selectedComponents[votingChoice]}
    </div>
  )
}

