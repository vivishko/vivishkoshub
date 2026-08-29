export type Experience = {
  role: string;
  organization: string;
  period: string;
  location?: string;
  description: string;
  linkLabel: string;
};

export type SocialProfile = {
  platform: string;
  label: string;
  handle?: string;
};

export type Profile = {
  name: string;
  title: string;
  introduction: readonly string[];
  experience: readonly Experience[];
  profileLink: Omit<SocialProfile, "handle">;
  socials: readonly SocialProfile[];
};

export const profile: Profile = {
  name: "Вивишко Шуб",
  title: "Дизайн, исследования, независимые проекты.",
  introduction: [
    "Дизайнер и исследователь. До этого — продуктовые команды, редакционные форматы и независимые запуски.",
    "Пишу о визуальных системах, работе с контекстом и способах собирать сложное в ясный интерфейс.",
  ],
  experience: [
    {
      role: "Design Lead",
      organization: "Independent practice",
      period: "2024 — сейчас",
      location: "Москва, удалённо",
      description:
        "Веду визуальные системы и интерфейсные задачи для независимых продуктов: от исследования до запуска.",
      linkLabel: "Портфолио",
    },
    {
      role: "Product Designer",
      organization: "Digital product team",
      period: "2022 — 2024",
      location: "Москва",
      description:
        "Собирала пользовательские сценарии, дизайн‑систему и редакционный язык для сервиса с большой базой знаний.",
      linkLabel: "Кейс",
    },
    {
      role: "Researcher",
      organization: "Studio practice",
      period: "2021 — 2022",
      location: "Санкт‑Петербург",
      description:
        "Исследовала привычки, контекст использования и язык интерфейса; переводила наблюдения в продуктовые решения.",
      linkLabel: "Исследование",
    },
    {
      role: "Founder, editor",
      organization: "Personal publishing project",
      period: "2020 — 2021",
      location: "удалённо",
      description:
        "Запустила независимый издательский формат: сайт, структура материалов и регулярный цикл публикаций.",
      linkLabel: "Архив",
    },
    {
      role: "Visual designer",
      organization: "Communication projects",
      period: "2019 — 2020",
      location: "Москва",
      description:
        "Работала с айдентикой, цифровыми носителями и системами коммуникации для культурных и образовательных проектов.",
      linkLabel: "Выборка работ",
    },
    {
      role: "Designer",
      organization: "Freelance",
      period: "2017 — 2019",
      description:
        "Первые интерфейсы, веб‑проекты и визуальные исследования — основа нынешней практики.",
      linkLabel: "Все проекты",
    },
  ],
  profileLink: { platform: "LinkedIn", label: "Полный профиль на LinkedIn" },
  socials: [
    { platform: "Telegram", label: "TG", handle: "@VIVISHKOSHUB" },
    { platform: "Instagram", label: "IG" },
    { platform: "X", label: "X" },
    { platform: "GitHub", label: "GITHUB" },
    { platform: "LinkedIn", label: "in" },
  ],
};

const englishProfile: Profile = {
  ...profile,
  title: "Design, research, independent projects.",
  introduction: ["Designer and researcher. Previously: product teams, editorial formats, and independent launches.", "I write about visual systems, working with context, and ways of turning complexity into clear interfaces."],
  experience: [
    { role: "Design Lead", organization: "Independent practice", period: "2024 — present", location: "Moscow, remote", description: "Leading visual systems and interface work for independent products, from research to launch.", linkLabel: "Portfolio" },
    { role: "Product Designer", organization: "Digital product team", period: "2022 — 2024", location: "Moscow", description: "Built user journeys, a design system, and editorial language for a service with a large knowledge base.", linkLabel: "Case study" },
    { role: "Researcher", organization: "Studio practice", period: "2021 — 2022", location: "Saint Petersburg", description: "Researched habits, usage context, and interface language; translated observations into product decisions.", linkLabel: "Research" },
    { role: "Founder, editor", organization: "Personal publishing project", period: "2020 — 2021", location: "Remote", description: "Launched an independent publishing format: site, material structure, and a regular publication cycle.", linkLabel: "Archive" },
    { role: "Visual designer", organization: "Communication projects", period: "2019 — 2020", location: "Moscow", description: "Worked on identity, digital media, and communication systems for cultural and educational projects.", linkLabel: "Selected work" },
    { role: "Designer", organization: "Freelance", period: "2017 — 2019", description: "First interfaces, web projects, and visual studies — the foundation of the current practice.", linkLabel: "All projects" },
  ],
  profileLink: { platform: "LinkedIn", label: "Full LinkedIn profile" },
};

export function getLocalizedProfile(locale: "ru" | "en"): Profile {
  return locale === "en" ? englishProfile : profile;
}
