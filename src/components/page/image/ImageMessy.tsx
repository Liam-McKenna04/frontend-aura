import React, { useState } from "react";
import { UserData } from "@/Site";
import { ImageContent } from "../../../../supabase/functions/createSite/types";
import { hs } from "@/lib/utils"

interface ImageMessyProps extends UserData {
  borderStyle: string;
  hoverEffect: string;
  filterEffect: string;
  imageContent: ImageContent;
}

const NonEmptyImage: React.FC<{ src: string; className: string; alt?: string }> = ({ src, className, alt }) => {
  const [visible, setVisible] = useState(false);

  const handleLoad = () => setVisible(true);
  const handleError = () => setVisible(false);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      style={{ display: visible ? 'initial' : 'none' }}
    />
  );
};

export const ImageMessy: React.FC<ImageMessyProps> = ({
  borderStyle,
  hoverEffect,
  imageContent,
}) => {
  const images = imageContent.similarImages?.filter(Boolean) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="relative w-full h-[600px] md:h-[800px] lg:h-[1000px]">
        {/* Base Image - Slightly smaller */}
        {imageContent.baseImageUrl && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-48 h-48 md:w-20 md:h-20 lg:w-40 lg:h-40">
            <NonEmptyImage
              src={imageContent.baseImageUrl}
              alt={imageContent.description || "Base Image"}
              className={`w-full h-full object-cover rounded-full shadow-lg ${borderStyle} ${hoverEffect}`}
            />
          </div>
        )}

        {/* Other images in the collage */}
        {images.map((src, index) => {
          const angle = (index / images.length) * 2 * Math.PI;
          const radius = 200 + hs(index + ' radius', 100) * 1; // Reduced radius
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const size = 60 + hs(index + ' size', 100) * 2; // Smaller size range

          return (
            <div
              key={index}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:z-20 hover:scale-110 ${hoverEffect}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: index,
              }}
            >
              <NonEmptyImage
                src={src}
                alt={`Collage Image ${index + 1}`}
                className={`w-full h-full object-cover rounded-lg shadow-md ${borderStyle}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
