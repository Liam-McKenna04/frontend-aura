import { hs } from "@/lib/utils"
import { ImageSimple } from "./image1"
import { UserData } from "@/Site"
import { ImageContent } from "../../../../supabase/functions/createSite/types"
import { ImageCollage } from "./ImageCollage"
import { ImageMessy } from "./ImageMessy"
import { ImageCarousel } from "./ImageCarosel"
import { ImageHexGrid } from "./ImageHexGrid"
import { ImageMasonry } from "./ImageMasonry"

export default function ImageHandler({userData, imageContent, variant}: {userData: UserData, imageContent: ImageContent, variant: string}) {
    
    // Randomize border styles individually
    const borderWidths = ["border-none", "border", "border-2", "border-4"];
    const borderColors = ["border-black", "border-gray-400", `border-[${userData.primary_color}]`];
    const borderPaddings = ["", "p-1", "p-2"];

    const selectedBorderWidth = borderWidths[hs(userData.twitter_username + "imageborderwidth", borderWidths.length)];
    const selectedBorderColor = borderColors[hs(userData.twitter_username + "imagebordercolor", borderColors.length)];
    const selectedBorderPadding = borderPaddings[hs(userData.twitter_username + "imageborderpadding", borderPaddings.length)];

    // Combine the randomized styles
    const borderStyle = `${selectedBorderPadding} ${selectedBorderWidth} ${selectedBorderColor}`.trim();

    // Choose hover effect
    const hoverEffects = [
        "hover:scale-105 transition-transform duration-300",
        "hover:brightness-110 transition-all duration-300",
        "hover:rotate-3 transition-transform duration-300",
        "hover:shadow-lg transition-shadow duration-300"
    ]
    const hoverEffect = hoverEffects[hs(userData.twitter_username + "imagehover", hoverEffects.length)]

    // Choose filter effect (additional style)
    const filterEffects = [
        "filter-none",
        "filter grayscale",
        "filter sepia",
        "filter brightness-125"
    ]
    const filterEffect = filterEffects[hs(userData.twitter_username + "imagefilter", filterEffects.length)]

    const variantToComponentMap = {
        minimalist: [<ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        playful: [<ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageCarousel {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        bold: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageHexGrid {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        retro: [<ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        nature: [<ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        futuristic: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageHexGrid {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />,  <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        elegant: [<ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageCarousel {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />,  <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        industrial: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageHexGrid {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        bohemian: [<ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        cyberpunk: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageHexGrid {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        vintage: [ <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        tropical: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageCarousel {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        zen: [<ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        neon: [<ImageCollage {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageHexGrid {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
        rustic: [<ImageMessy {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />, <ImageMasonry {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />],
    };

    const selectedComponents = variantToComponentMap[variant as keyof typeof variantToComponentMap] || [<ImageSimple {...userData} imageContent={imageContent} borderStyle={borderStyle} hoverEffect={hoverEffect} filterEffect={filterEffect} />];
    const imageChoice = hs(userData.twitter_username + "image", selectedComponents.length);

    return (
        <div className="p-10 flex justify-center">
            {selectedComponents[imageChoice]}
        </div>
    )
}

