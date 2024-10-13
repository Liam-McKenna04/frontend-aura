import { hs } from "@/lib/utils"
import { Header1, Header2, Header3, Header4 } from "./header1"
import { UserData } from "@/Site"
import React from "react"

export default function Header(props: UserData) {

    
    // Choose background style
    const bgStyles = [
        "bg-opacity-20 backdrop-blur-lg",
    ]
    const bgChoice = hs(props.twitter_username + "bg", bgStyles.length )
    const bgStyle = bgStyles[bgChoice]

    // Choose border style
    const borderStyles = [
        "border-b border-gray-200",
        "border-b-2 border-gray-300",
        `border-b-4 border-[${props.primary_color}]`,
        "border-none",
        "border-b-2 border-black",


    ]
    const borderChoice = hs(props.twitter_username + "border", borderStyles.length)
    const borderStyle = borderStyles[borderChoice]

    // Choose layout style
    const layoutStyles = ["justify-start", "justify-center", "justify-between"]
    const layoutChoice = hs(props.twitter_username + "layout", layoutStyles.length)
    const layoutStyle = layoutStyles[layoutChoice]
    const subcomponents = [
        <Header1 {...props} layoutStyle={layoutStyle} />,
        <Header2 {...props} layoutStyle={layoutStyle} />,
        <Header3 {...props} layoutStyle={layoutStyle} />,
        <Header4 {...props} layoutStyle={layoutStyle} />
    ]
    const headerChoice = hs(props.twitter_username, subcomponents.length)

    return (
        <div className={`${bgStyle} ${borderStyle}`}>
            {React.cloneElement(subcomponents[headerChoice], { layoutStyle })}
        </div>
    )
}
