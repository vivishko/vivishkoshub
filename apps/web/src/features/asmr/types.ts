export type TriggerPrimaryCategory =
  | "audio"
  | "visual"
  | "personal-attention"
  | "roleplay"
  | "imagined-touch"
  | "object-focused";

export type AsmrLocale = "ru" | "en";

export type YoutubeVideo = {
  id: string;
  title: string;
  channel: string;
  url: string;
};

export type Asmrtist = {
  id: string;
  name: string;
  url?: string;
};

export type Trigger = {
  id: string;
  slug: string;
  title: string;
  shortDescription: {
    ru: string;
    en: string;
  };
  description: {
    ru: string;
    en: string;
  };
  primaryCategory: TriggerPrimaryCategory;
  secondaryCategory: string;
  tags: string[];
  aliases: string[];
  asmrtists: string[];
  youtubeVideos: YoutubeVideo[];
  relatedTriggerIds: string[];
};

export type TriggerFilters = {
  query: string;
  categories: TriggerPrimaryCategory[];
  tags: string[];
  favoriteOnly: boolean;
};
