import { UserData } from "@/Site";
import { hs } from "@/lib/utils";

// Add this function at the top of the file
function getTextColor(backgroundColor: string): string {
  // Simple logic to determine if text should be black or white
  const rgb = parseInt(backgroundColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128 ? 'text-white' : 'text-black';
}

interface QuoteProps extends UserData {
  layoutStyle: string;
  quote: string;
}

// Minimalist Quote
function QuoteMinimalist({ layoutStyle, ...props }: QuoteProps) {
  const textColor = getTextColor(props.background_color);
  return (
    <div className={`${layoutStyle} font-sans ${textColor}`}>
      <p className="text-xl font-light leading-relaxed mb-4">{props.quote}</p>
      <footer className="text-sm font-medium">— {props.name}</footer>
    </div>
  );
}

// Elegant Script Quote
function QuoteElegantScript({ layoutStyle, ...props }: QuoteProps) {
  const scriptFonts = ["font-dancing-script", "font-pacifico", "font-great-vibes"];
  const scriptFont = scriptFonts[hs(props.twitter_username + "scriptfont", scriptFonts.length)];
  const textColor = getTextColor(props.background_color);

  return (
    <div className={`${layoutStyle} ${scriptFont} ${textColor}`}>
      <p className="text-2xl italic mb-4">{props.quote}</p>
      <footer className="text-lg text-right">— {props.name}</footer>
    </div>
  );
}

// Modern Drop Shadow Quote
function QuoteModernDropShadow({ layoutStyle, ...props }: QuoteProps) {
  const textColor = getTextColor(props.background_color);
  return (
    <div className={`${layoutStyle} ${textColor} p-6 rounded-lg`}>
      <p className="text-xl font-bold mb-4">{props.quote}</p>
      <footer className="text-sm font-light">— {props.name}</footer>
    </div>
  );
}

// Retro Typography Quote
function QuoteRetroTypography({ layoutStyle, ...props }: QuoteProps) {
  const retroFonts = ["font-press-start-2p", "font-vt323", "font-pixel"];
  const retroFont = retroFonts[hs(props.twitter_username + "retrofont", retroFonts.length)];
  const textColor = getTextColor(props.background_color);

  return (
    <div className={`${layoutStyle} ${retroFont} ${textColor} bg-yellow-200 border-4 border-black p-4 drop-shadow-lg shadow-lg`}>
      <p className="text-lg mb-4 leading-relaxed">{props.quote}</p>
      <footer className="text-sm text-right">— {props.name}</footer>
    </div>
  );
}

// Handwritten Note Quote
function QuoteHandwrittenNote({ layoutStyle, ...props }: QuoteProps) {
  const paperColors = ["bg-yellow-100", "bg-blue-100", "bg-pink-100"];
  const paperColor = paperColors[hs(props.twitter_username + "papercolor", paperColors.length)];
  
  // Generate a random rotation angle between -3 and 3 degrees
  const rotationAngle = hs(props.twitter_username + "rotation", 7) - 3;

  return (
    <div className={`${layoutStyle} ${paperColor} p-6 shadow-md`} style={{ transform: `rotate(${rotationAngle * 5}deg)` }}>
      <p className="font-indie-flower text-xl mb-4 leading-relaxed">{props.quote}</p>
      <footer className="font-indie-flower text-sm text-right">— {props.name}</footer>
    </div>
  );
}

export { QuoteMinimalist, QuoteElegantScript, QuoteModernDropShadow, QuoteRetroTypography, QuoteHandwrittenNote };
