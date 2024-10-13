export type ComponentVariant = "minimalist" | "playful" | "bold" | "retro" | "nature";

export type ListContent = {
  items: string[];
  title: string;
};

export type VotingContent = {
  question: string;
  options: string[];
};

export type HeroContent = {
  headline: string;
  subheadline: string;
};

export type QuoteContent = {
  text: string;
  author: string;
};

export type ImageContent = {
  description: string;
  similarImages?: string[];
  baseImageUrl?: string;
};

export type ComponentContent = ListContent | VotingContent | HeroContent | QuoteContent | ImageContent;

export type SiteComponent = {
  type: "hero" | "image" | "list" | "quote" | "voting";
  content: ComponentContent;
  variant: string;
};

export type SiteOutline = {
  selected_components: SiteComponent[];
  aura: string;
  global_variant: string;
};
