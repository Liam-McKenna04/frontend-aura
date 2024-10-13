import { UserData } from "@/Site";
import { hs } from "@/lib/utils";
import { useState } from "react";
import confetti from 'canvas-confetti';

interface HeroProps extends UserData {
  layoutStyle: string;
}

// Minimalist Hero
function HeroMinimalist({ layoutStyle, ...props }: HeroProps) {
  const buttonStyles = ["bg-gray-200 hover:bg-gray-300", "border border-gray-400 hover:border-gray-600", "underline hover:no-underline"];
  const buttonStyle = buttonStyles[hs(props.twitter_username + "minimalistBtn", buttonStyles.length)];

  const handleClick = () => {
    window.open('https://x.com/' + props.twitter_username, '_blank');
  };

  return (
    <div className={`${layoutStyle} font-sans`}>
      <h1 className="text-4xl font-light mb-2">Hello, I'm {props.name}</h1>
      <p className="text-xl text-gray-600 mb-4">{props.twitter_bio}</p>
      <button 
        className={`px-4 py-2 rounded ${buttonStyle} transition duration-300`}
        onClick={handleClick}
      >
        Learn More
      </button>
    </div>
  );
}

// Playful Hero
function HeroPlayful({ layoutStyle, ...props }: HeroProps) {
  const emojis = ["👋", "🎉", "✨", "🚀", "💡"];
  const emoji = emojis[hs(props.twitter_username + "emoji", emojis.length)];
  const [isWiggling, setIsWiggling] = useState(false);

  const handleMouseEnter = () => setIsWiggling(true);
  const handleMouseLeave = () => setIsWiggling(false);
  const handleAnimationEnd = () => setIsWiggling(false);

  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className={`${layoutStyle} font-comic-sans`}>
      <h1 className="text-4xl font-bold mb-2">Hey there! {emoji} I'm {props.name}</h1>
      <p className="text-xl mb-4" style={{ color: props.primary_color }}>{props.twitter_bio}</p>
      <button
        className={`px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold transition duration-300 ${isWiggling ? 'animate-wiggle' : ''}`}
        style={{backgroundColor: props.secondary_color}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onAnimationEnd={handleAnimationEnd}
        onClick={handleClick}
      >
        {`Let's g${'o'.repeat(2 + hs(props.twitter_username + "gooo", 5))}!`}
      </button>
    </div>
  );
}

// Bold Hero
function HeroBold({ layoutStyle, ...props }: HeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandStyles = ["scale-110", "tracking-wider", "font-black"];
  const expandStyle = expandStyles[hs(props.twitter_username + "boldExpand", expandStyles.length)];

  const handleClick = () => {
    alert(`Welcome to ${props.name}'s world of boldness!`);
  };

  return (
    <div className={`${layoutStyle} font-sans`}>
      <h1 className="text-5xl font-extrabold mb-2 uppercase">I'm {props.name}</h1>
      <p className="text-2xl font-semibold text-gray-800 mb-4">{props.twitter_bio}</p>
      <button
        className={`px-6 py-3 bg-black text-white font-bold uppercase tracking-wide transition-all duration-300 ${isExpanded ? expandStyle : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={handleClick}
      >
        Explore
      </button>
    </div>
  );
}

// Gradient Hero
function HeroGradient({ layoutStyle, ...props }: HeroProps) {
  const gradients = [
    `linear-gradient(to right, ${props.primary_color}, ${props.secondary_color})`,
    `linear-gradient(to right, ${props.secondary_color}, ${props.primary_color})`,
    `linear-gradient(to right, ${props.primary_color}, ${props.secondary_color}, ${props.primary_color})`
  ];
  const gradient = gradients[hs(props.twitter_username + "herogradient", gradients.length)];
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    document.body.style.background = gradient;
    setTimeout(() => {
      document.body.style.background = '';
    }, 1000);
  };

  return (
    <div className={`${layoutStyle} font-sans`}>
      <h1 className="text-5xl font-bold mb-2" style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent'
      }}>
        Hello! I'm {props.name}
      </h1>
      <p className="text-xl text-gray-700 mb-4">{props.twitter_bio}</p>
      <button
        className="px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 relative overflow-hidden"
        style={{ background: isHovered ? props.secondary_color : props.primary_color }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <a className="relative z-10" href={`https://x.com/${props.twitter_username}`}>Discover More</a>
        <div
          className="absolute inset-0 transform scale-x-0 origin-left transition-transform duration-300"
          style={{ background: gradient, transform: isHovered ? 'scaleX(1)' : 'scaleX(0)' }}
        ></div>
      </button>
    </div>
  );
}

// Retro Hero
function HeroRetro({ layoutStyle, ...props }: HeroProps) {
  const retroFonts = ["font-press-start-2p", "font-vt323", "font-pixel"];
  const retroFont = retroFonts[hs(props.twitter_username + "retrofont", retroFonts.length)];

  const [message, setMessage] = useState('');

  const handleClick = () => {
    const messages = [
      'LOADING...',
      'ACCESS GRANTED',
      'SYSTEM ONLINE',
      'WELCOME USER'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setMessage(messages[index]);
      index++;
      if (index >= messages.length) {
        clearInterval(interval);
        setTimeout(() => setMessage(''), 2)
      }
    }, 500);
  };

  return (
    <div className={`${layoutStyle} ${retroFont} bg-black text-green-400 p-4`}>
      <h1 className="text-3xl mb-2">GREETINGS, I'M {props.name.toUpperCase()}</h1>
      <p className="text-lg">{props.twitter_bio.toUpperCase()}</p>
      <button 
        className={`px-4 py-2 rounded ${retroFont} transition duration-300`}
        onClick={handleClick}
      >
        {message || 'Click me!'}
      </button>
    </div>
  );
}

export { HeroMinimalist, HeroPlayful, HeroBold, HeroGradient, HeroRetro };
