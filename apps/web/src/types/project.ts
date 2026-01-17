export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cover?: { src: string; alt: string };
  gallery?: { src: string; alt: string }[];
  links: {
    live?: string;
    repo?: string;
  };
  bodyMd?: string;
};
