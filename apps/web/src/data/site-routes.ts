export const siteRoutes = {
  home: "/",
  projects: "/projects",
  notes: "/notes",
  experiments: "/experiments",
  about: "/about",
  fun: "/fun",
} as const;

export type SiteRoute = (typeof siteRoutes)[keyof typeof siteRoutes];

type NavigationItem = {
  href: SiteRoute | "/?lang=ru" | "/?lang=en";
  label: string;
};

export const primaryNavigation = [
  { href: siteRoutes.projects, label: "Projects" },
  { href: siteRoutes.notes, label: "Notes" },
  { href: siteRoutes.about, label: "About" },
  { href: "/?lang=ru", label: "RU" },
  { href: "/?lang=en", label: "EN" },
] as const satisfies readonly NavigationItem[];

export const footerNavigation = [
  { href: siteRoutes.projects, label: "Projects" },
  { href: siteRoutes.notes, label: "Notes" },
  { href: siteRoutes.about, label: "About" },
] as const satisfies readonly NavigationItem[];
