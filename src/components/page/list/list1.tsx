import React from 'react';
import { UserData } from "@/Site";
import { hs } from "@/lib/utils";
import { Check, ChevronRight, Star, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Leaf } from "lucide-react"


interface ListProps extends UserData {
  items: string[];
  layoutStyle: string;
  title: string; 
}

// Minimal List
function MinimalList({ layoutStyle, items, title, ...props }: ListProps) {
  return (
    <div className={`${layoutStyle} bg-gray-50 p-6 rounded-lg shadow-sm`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-3 text-gray-700">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


// Modern Checklist
function ModernChecklist({ layoutStyle, items, title, ...props }: ListProps) {
  const checkColors = [
    props.primary_color,
    props.secondary_color,
    "#10B981", // green-500
    "#3B82F6"  // blue-500
  ];
  const checkColor = checkColors[hs(props.twitter_username + "checkcolor", checkColors.length)];

  return (
    <div className={`${layoutStyle} bg-white p-6 rounded-xl shadow-md`}>
      <h3 className="text-2xl font-bold mb-6 border-b pb-2" style={{ color: checkColor }}>{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-4 transition-all hover:translate-x-1">
            <Check className="w-6 h-6 flex-shrink-0" style={{ color: checkColor }} />
            <span className="text-lg text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Gradient Cards List
function GradientCardsList({ layoutStyle, items, title, ...props }: ListProps) {
  const getGradientStyle = (index: number) => {
    const baseColor = index % 2 === 0 ? props.primary_color : props.secondary_color;
    const borderSide = ['left', 'right'][hs(props.twitter_username + 'border', 2)];
    const maxOpacity = 0.15 + hs(props.twitter_username + 'opacity', 16) / 100; // 0.15 to 0.30
    const midPoint = 30 + hs(props.twitter_username + 'midpoint', 41); // 30% to 70%
    const gradientType = hs(props.twitter_username + 'gradienttype', 2) === 0 ? 'border' : 'full';

    const gradientStyle = gradientType === 'border' 
      ? {
          [`border-${borderSide}`]: `4px solid ${baseColor}`,
          [`border-${borderSide}-width`]: '4px',
          background: `linear-gradient(135deg, 
            ${adjustColorOpacity(baseColor, maxOpacity)} 0%,
            ${adjustColorOpacity(baseColor, maxOpacity/2)} ${midPoint}%,
            ${adjustColorOpacity(baseColor, maxOpacity)} 100%)`,
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }
      : {
          background: `linear-gradient(135deg, 
            ${adjustColorOpacity(baseColor, maxOpacity)} 0%,
            ${adjustColorOpacity(baseColor, maxOpacity/2)} ${midPoint}%,
            ${adjustColorOpacity(baseColor, maxOpacity)} 100%)`,
          [`border-${borderSide}`]: `4px solid ${baseColor}`,
        };

    return gradientStyle;
  };

  const adjustColorOpacity = (color: string, opacity: number) => {
    const rgb = hexToRgb(color);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  return (
    <div className={`${layoutStyle} bg-gray-100 p-8 rounded-2xl shadow-lg`}>
      <h3 className="text-3xl font-bold mb-8 text-center" style={{ color: props.primary_color }}>{title}</h3>
      <ul className="space-y-6">
        {items.map((item, index) => (
          <li key={index} className="p-5 rounded-xl shadow-md text-gray-800 transition-all hover:scale-105" style={getGradientStyle(index)}>
            <span className="font-medium text-lg">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Retro Pixel List
function RetroPixelList({ layoutStyle, items, title, ...props }: ListProps) {
  return (
    <div className={`${layoutStyle} bg-yellow-100 p-6 rounded-lg border-4 border-black`}>
      <h3 className="font-press-start-2p text-xl mb-8 border-b-4 border-black pb-4 text-center">{title}</h3>
      <ul className="space-y-6 font-press-start-2p text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-4 border-4 border-black p-4 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <ChevronRight className="w-5 h-5 mt-1 flex-shrink-0" />
            <span className="leading-tight">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Elegant Numbered List
function ElegantNumberedList({ layoutStyle, items, title, ...props }: ListProps) {
  const accentColors = [
    `text-[${props.primary_color}]`,
    `text-[${props.secondary_color}]`,
    "text-indigo-600",
    "text-rose-600"
  ];
  const accentColor = accentColors[hs(props.twitter_username + "accentcolor", accentColors.length)];

  return (
    <div className={`${layoutStyle} bg-gray-50 p-8 rounded-xl shadow-md`}>
      <h3 className={`${accentColor} text-3xl font-serif font-bold mb-8 border-b pb-4 text-center`}>{title}</h3>
      <ol className="space-y-8">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-6">
            <span className={`${accentColor} font-serif text-4xl font-bold`}>{index + 1}</span>
            <span className="text-xl border-b border-gray-300 pb-3 flex-grow">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
// Nature-inspired List
function NatureInspiredList({ layoutStyle, items, title, ...props }: ListProps) {
  return (
    <div className={`${layoutStyle} w-full max-w-md mx-auto bg-gradient-to-b from-green-100 to-green-200 p-8 rounded-2xl shadow-xl`}>
      <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">{title}</h3>
      <div className="relative">
        <ScrollArea className="h-[350px] w-full pr-4">
          <ul className="space-y-6 relative">
            {items.map((item, index) => (
              <li key={index} className="flex items-center space-x-4 transition-all hover:translate-x-2">
                <div className="w-10 h-10 flex items-center justify-center bg-green-500 rounded-full shadow-md">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="flex-grow">
                  <div className="bg-white p-4 rounded-xl shadow-md">
                    <p className="text-green-800 text-lg">{item}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}

export { MinimalList, ModernChecklist, GradientCardsList, RetroPixelList, ElegantNumberedList, NatureInspiredList };
