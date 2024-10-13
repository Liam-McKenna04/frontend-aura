import React, { useState } from "react";
import { UserData } from "@/Site";
import { ImageContent } from "../../../../supabase/functions/createSite/types";

interface ImageCollageProps extends UserData {
  borderStyle: string;
  hoverEffect: string;
  filterEffect: string;
  imageContent: ImageContent;
}

const NonEmptyImage: React.FC<{ src: string; className: string }> = ({ src, className }) => {
  const [visible, setVisible] = useState(false);

  const handleLoad = () => setVisible(true);
  const handleError = () => setVisible(false);

  return (
    <img
      src={src}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      style={{ display: visible ? 'initial' : 'none' }}
    />
  );
};

export const ImageCollage: React.FC<ImageCollageProps> = ({
  borderStyle,
  hoverEffect,
  imageContent,
}) => {
  const images = imageContent.similarImages?.filter(Boolean) || [];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-1 md:grid-cols-6 lg:grid-cols-8">
        {/* Base Image - Larger and more prominent */}
        {imageContent.baseImageUrl && (
          <div className="col-span-2 row-span-2">
            <NonEmptyImage
              src={imageContent.baseImageUrl}
              className={`rounded-lg object-cover w-full h-full ${borderStyle} ${hoverEffect}`}
            />
          </div>
        )}

        {/* Other images in the collage */}
        {images.map((src, index) => (
          src && (
            <div
              key={index}
              className={`${
                index % 5 === 0 ? 'col-span-2 row-span-2' : 
                index % 3 === 0 ? 'col-span-2' : 
                'col-span-1'
              }`}
            >
              <NonEmptyImage
                src={src}
                className={`rounded-lg object-cover w-full h-full ${borderStyle} ${hoverEffect}`}
              />
            </div>
          )
        ))}
      </div>
    </div>
  );
};
