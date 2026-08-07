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
  href: SiteRoute;
  label: string;
};

export const primaryNavigation = [
  { href: siteRoutes.projects, label: "ПРОЕКТЫ" },
  { href: siteRoutes.notes, label: "ЗАМЕТКИ" },
  { href: siteRoutes.about, label: "ОБО МНЕ" },
] as const satisfies readonly NavigationItem[];
