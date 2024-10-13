import { hs } from "@/lib/utils"
import { MinimalList, ModernChecklist, GradientCardsList, RetroPixelList, ElegantNumberedList, NatureInspiredList } from "./list1"
import { UserData } from "@/Site"
import { ListContent } from "../../../../supabase/functions/createSite/types"

export default function ListHandler({userData, listContent, variant}: {userData: UserData, listContent: ListContent, variant: string}) {
    
    // Choose layout style
    const layoutStyles = ["text-left", "text-center", "text-right"]
    const layoutStyle = layoutStyles[hs(userData.twitter_username + "listlayout", layoutStyles.length)]

    // Choose background style
    // const bgStyles = [
    //     "bg-white",
    //     "bg-gray-50",
    //     "bg-opacity-5 backdrop-blur-sm",
    //     "bg-gradient-to-r from-gray-50 to-white"
    // ]
    // const bgStyle = bgStyles[hs(userData.twitter_username + "listbg", bgStyles.length)]

    // Choose border style
    // const borderStyles = [
    //     "border border-gray-200",
    //     "border-2 border-gray-300",
    //     `border-4 border-[${userData.primary_color}]`,
    //     "border-none"
    // ]
    // const borderStyle = borderStyles[hs(userData.twitter_username + "listborder", borderStyles.length)]

    const variantToComponentMap = {
        minimalist: [<MinimalList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        playful: [<ModernChecklist {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        bold: [<GradientCardsList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        retro: [<RetroPixelList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        nature: [<NatureInspiredList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <MinimalList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        futuristic: [<GradientCardsList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <ModernChecklist {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        elegant: [<ElegantNumberedList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <MinimalList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        industrial: [<GradientCardsList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <RetroPixelList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        bohemian: [<NatureInspiredList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <ModernChecklist {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        cyberpunk: [<GradientCardsList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <RetroPixelList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        vintage: [<RetroPixelList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        tropical: [<NatureInspiredList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <ModernChecklist {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        zen: [<MinimalList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        neon: [<GradientCardsList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <ModernChecklist {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
        rustic: [<RetroPixelList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />, <NatureInspiredList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />],
    };

    const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<MinimalList {...userData} layoutStyle={layoutStyle} items={listContent.items} title={listContent.title} />];
    const listChoice = hs(userData.twitter_username + "list", selectedComponents.length);

    return (
        <div className={`px-20 py-10`}>
            {selectedComponents[listChoice]}
        </div>
    )
}
