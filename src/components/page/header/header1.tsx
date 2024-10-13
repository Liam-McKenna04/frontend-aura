import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserData } from "@/Site";
import { hs } from "@/lib/utils";

interface HeaderProps extends UserData {
  layoutStyle: string;
}

function Header1({ layoutStyle, ...props }: HeaderProps) {
  const avatarSizes = ["w-10 h-10", "w-12 h-12", "w-14 h-14"];
  const avatarSize = avatarSizes[hs(props.twitter_username + "avatar", avatarSizes.length)];

  const fontSizes = ["text-xl", "text-2xl", "text-3xl"];
  const fontSize = fontSizes[hs(props.twitter_username + "font", fontSizes.length)];

  return (
    <header className={`flex flex-row items-center ${layoutStyle} space-x-4 p-6`}>
      <Avatar className={`${avatarSize} flex-shrink-0`}>
        <AvatarImage src={props.pfp_url} alt="Profile Picture" />
        <AvatarFallback>{props.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <a className={`${fontSize} font-semibold hover:underline`} href={`https://twitter.com/${props.twitter_username}`}>{props.name}</a>
    </header>
  );
}

function Header2({ layoutStyle, ...props }: HeaderProps) {
  const imageShapes = ["rounded-lg", "rounded-full", "rounded-md"];
  const imageShape = imageShapes[hs(props.twitter_username + "image", imageShapes.length)];

  return (
    <header className={`flex flex-row items-center ${layoutStyle} p-6`}>
      <div className={`flex items-center space-x-4 ${layoutStyle === 'justify-between' ? 'w-full' : ''}`}>
        <div className={`w-12 h-12 overflow-hidden ${imageShape}`}>
          <img src={props.pfp_url} alt="Profile Picture" className="w-full h-full object-cover" />
        </div>
        <a className="text-2xl font-bold hover:underline" href={`https://twitter.com/${props.twitter_username}`}>{props.name}</a>
      </div>
    </header>
  );
}

function Header3({ layoutStyle, ...props }: HeaderProps) {

  const buttonStyles = [
    "bg-transparent hover:bg-gray-50/10",
    `bg-[${props.primary_color}] hover:opacity-90`,
    "bg-gray-200 hover:bg-gray-300",
    `bg-[${props.secondary_color}] hover:opacity-90`
  ];
  const buttonStyle = buttonStyles[hs(props.twitter_username + "button", buttonStyles.length)];

  return (
    <header 
      className={`flex flex-row items-center ${layoutStyle} p-6`}
    >
      <div className={`flex items-center space-x-4 ${layoutStyle === 'justify-between' ? 'w-full' : ''}`}>
        <Avatar className="w-14 h-14 border-2 border-gray-200">
          <AvatarImage src={props.pfp_url} alt="Profile Picture" />
          <AvatarFallback>{props.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <a className="text-2xl font-extrabold hover:underline" href={`https://twitter.com/${props.twitter_username}`}>{props.name}</a>
          <p className="text-sm opacity-80">@{props.twitter_username}</p>
        </div>
      </div>
      {layoutStyle === 'justify-between' && (
        <button className={`px-4 py-2 ${buttonStyle} rounded-full font-semibold transition-colors`}>
          Follow
        </button>
      )}
    </header>
  );
}

function Header4({ layoutStyle, ...props }: HeaderProps) {
  const outlineColors = [
    props.primary_color,
    props.secondary_color,
    "#e5e7eb", // Equivalent to gray-200
    "white",
    "black"
  ];
  const outlineColor = outlineColors[hs(props.twitter_username + "outline", outlineColors.length)];

  return (
    <header className={`flex flex-row items-center ${layoutStyle} p-6`}>
      <div className={`flex items-center space-x-6 ${layoutStyle === 'justify-between' ? 'w-full' : ''}`}>
        <div className="w-24 h-24 overflow-hidden" style={{ border: `4px solid ${outlineColor}` }}>
          <img src={props.pfp_url} alt="Profile Picture" className="w-full h-full object-cover" />
        </div>
        <div>
          <a className="text-3xl font-bold hover:underline" href={`https://twitter.com/${props.twitter_username}`}>{props.name}</a>
          <p className="text-lg text-gray-600">@{props.twitter_username}</p>
        </div>
      </div>
      {layoutStyle === 'justify-between' && (
        <button className={`px-6 py-2 bg-[${props.primary_color}] text-white rounded-full font-semibold hover:opacity-90 transition-opacity`}>
          Follow
        </button>
      )}
    </header>
  );
}


export { Header1, Header2, Header3, Header4 };
