import React from "react";
import { UserData } from "@/Site";
import { ImageContent } from "../../../../supabase/functions/createSite/types";

interface ImageProps extends UserData {
  borderStyle: string;
  hoverEffect: string;
  filterEffect: string;
  imageContent: ImageContent;
}

export const ImageSimple: React.FC<ImageProps> = ({
  borderStyle,
  hoverEffect,
  imageContent,
}) => {
  const additionalImages = imageContent.similarImages?.filter(Boolean).slice(0, 2) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-2">
        {/* Base Image - Larger and more prominent */}
        <div className="col-span-2">
          <img
            src={imageContent.baseImageUrl}
            alt={imageContent.description || "Main image"}
            className={`rounded-lg object-cover w-full h-64 ${borderStyle} ${hoverEffect}`}
          />
        </div>

        {/* Two additional images */}
        {additionalImages.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Additional image ${index + 1}`}
              className={`rounded-lg object-cover w-full h-40 ${borderStyle} ${hoverEffect}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ... Other image components (ImageBordered, ImageRounded, ImageHover, ImageOverlay) can be added here
