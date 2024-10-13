import { hs } from "@/lib/utils"
import { HeroMinimalist, HeroPlayful, HeroBold, HeroGradient, HeroRetro } from "./hero1"
import { UserData } from "@/Site"
// import React from "react"
import { HeroContent } from "../../../../supabase/functions/createSite/types"

export default function Hero({userData, variant}: {userData: UserData, heroContent: HeroContent, variant: string}) {
    
    // Choose background style
    // const bgStyles = [
    //     "bg-white",
    //     "bg-gray-100",
    //     "bg-opacity-10 backdrop-blur-sm",
    //     "bg-gradient-to-r from-gray-50 to-white"
    // ]
    // const bgStyle = bgStyles[hs(userData.twitter_username + "herobg", bgStyles.length)]

    // // Choose border style
    // const borderStyles = [
    //     "border-b border-gray-200",
    //     "border-b-2 border-gray-300",
    //     `border-b-4 border-[${userData.primary_color}]`,
    //     "border-none"
    // ]
    // const borderStyle = borderStyles[hs(userData.twitter_username + "heroborder", borderStyles.length)]

    // Choose layout style
    const layoutStyles = ["text-left", "text-center", "text-right"]
    const layoutStyle = layoutStyles[hs(userData.twitter_username + "herolayout", layoutStyles.length)]

    const variantToComponentMap = {
        minimalist: [<HeroMinimalist {...userData} layoutStyle={layoutStyle} />],
        playful: [<HeroPlayful {...userData} layoutStyle={layoutStyle} />],
        bold: [<HeroBold {...userData} layoutStyle={layoutStyle} />],
        retro: [<HeroRetro {...userData} layoutStyle={layoutStyle} />],
        nature: [<HeroMinimalist {...userData} layoutStyle={layoutStyle} />, <HeroPlayful {...userData} layoutStyle={layoutStyle} />],
        futuristic: [<HeroGradient {...userData} layoutStyle={layoutStyle} />, <HeroBold {...userData} layoutStyle={layoutStyle} />],
        elegant: [<HeroMinimalist {...userData} layoutStyle={layoutStyle} />, <HeroGradient {...userData} layoutStyle={layoutStyle} />],
        industrial: [<HeroBold {...userData} layoutStyle={layoutStyle} />, <HeroRetro {...userData} layoutStyle={layoutStyle} />],
        bohemian: [<HeroPlayful {...userData} layoutStyle={layoutStyle} />, <HeroRetro {...userData} layoutStyle={layoutStyle} />],
        cyberpunk: [<HeroGradient {...userData} layoutStyle={layoutStyle} />, <HeroBold {...userData} layoutStyle={layoutStyle} />],
        vintage: [<HeroRetro {...userData} layoutStyle={layoutStyle} />],
        tropical: [<HeroPlayful {...userData} layoutStyle={layoutStyle} />, <HeroGradient {...userData} layoutStyle={layoutStyle} />],
        zen: [<HeroMinimalist {...userData} layoutStyle={layoutStyle} />],
        neon: [<HeroGradient {...userData} layoutStyle={layoutStyle} />, <HeroPlayful {...userData} layoutStyle={layoutStyle} />],
        rustic: [<HeroRetro {...userData} layoutStyle={layoutStyle} />, <HeroMinimalist {...userData} layoutStyle={layoutStyle} />],
    };

    const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<HeroMinimalist {...userData} layoutStyle={layoutStyle} />];
    const heroChoice = hs(userData.twitter_username + "hero", selectedComponents.length);

    return (
        <div className="px-20 py-10"> 
            {selectedComponents[heroChoice]}
        </div>
    )
}
