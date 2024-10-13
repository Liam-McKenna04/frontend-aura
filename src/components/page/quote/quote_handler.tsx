import { hs } from "@/lib/utils"
import { QuoteMinimalist, QuoteElegantScript, QuoteModernDropShadow, QuoteRetroTypography, QuoteHandwrittenNote } from "./quote1"
import { UserData } from "@/Site"
import React from "react"
import { QuoteContent } from "../../../../supabase/functions/createSite/types"

export default function Quote({userData, quoteContent, variant}: {userData: UserData, quoteContent: QuoteContent, variant: string}) {
    const quote = quoteContent.text

    // Choose border style
    const borderStyles = [
        "border border-gray-200",
        "border-2 border-gray-300",
        `border-l-4 border-[${userData.primary_color}]`,
        "border-none"
    ]
    const borderStyle = borderStyles[hs(userData.twitter_username + "quoteborder", borderStyles.length)]

    // Choose layout style
    const layoutStyles = ["text-left", "text-center", "text-right"]
    const layoutStyle = layoutStyles[hs(userData.twitter_username + "quotelayout", layoutStyles.length)]

    const variantToComponentMap = {
        minimalist: [<QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />],
        playful: [<QuoteHandwrittenNote {...userData} layoutStyle={layoutStyle} quote={quote} />],
        bold: [<QuoteModernDropShadow {...userData} layoutStyle={layoutStyle} quote={quote} />],
        retro: [<QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />],
        nature: [<QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteHandwrittenNote {...userData} layoutStyle={layoutStyle} quote={quote} />],
        futuristic: [<QuoteModernDropShadow {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />],
        elegant: [<QuoteElegantScript {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />],
        industrial: [<QuoteModernDropShadow {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />],
        bohemian: [<QuoteHandwrittenNote {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />],
        cyberpunk: [<QuoteModernDropShadow {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />],
        vintage: [<QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />],
        tropical: [<QuoteHandwrittenNote {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteElegantScript {...userData} layoutStyle={layoutStyle} quote={quote} />],
        zen: [<QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />],
        neon: [<QuoteModernDropShadow {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteHandwrittenNote {...userData} layoutStyle={layoutStyle} quote={quote} />],
        rustic: [<QuoteRetroTypography {...userData} layoutStyle={layoutStyle} quote={quote} />, <QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />],
    };

    const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<QuoteMinimalist {...userData} layoutStyle={layoutStyle} quote={quote} />];
    const quoteChoice = hs(userData.twitter_username + "quote", selectedComponents.length);

    return (
        <div className="px-20 py-10">
            {selectedComponents[quoteChoice]}
        </div>
    )
}
