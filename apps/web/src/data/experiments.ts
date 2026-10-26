export type Experiment = {
  slug: string;
  date: string;
  title: string;
  description: string;
  status: string;
};

export const experiments = [
  {
    slug: "portable-archive",
    date: "06.2026",
    title: "Портативный архив",
    description: "Проверяю, как личная библиотека может быть одновременно журналом и навигацией.",
    status: "В работе",
  },
  {
    slug: "unobtrusive-prompts",
    date: "05.2026",
    title: "Ненавязчивые подсказки",
    description: "Тест языка интерфейса, который не соревнуется с содержанием.",
    status: "В работе",
  },
  {
    slug: "heading-system",
    date: "03.2026",
    title: "Система заголовков",
    description: "Серия типографических этюдов для длинного чтения.",
    status: "В работе",
  },
  {
    slug: "work-connections-map",
    date: "02.2026",
    title: "Карта рабочих связей",
    description: "Черновик схемы, которая превращает заметки в связанные маршруты.",
    status: "В работе",
  },
] as const satisfies readonly Experiment[];

export type ExperimentSlug = (typeof experiments)[number]["slug"];

export function isExperimentSlug(slug: string): slug is ExperimentSlug {
  return experiments.some((experiment) => experiment.slug === slug);
}

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.slug === slug);
}

const englishExperiments: Record<string, Pick<Experiment, "title" | "description" | "status">> = {
  "portable-archive": { title: "Portable archive", description: "Exploring how a personal library can be both a journal and a navigation system.", status: "In progress" },
  "unobtrusive-prompts": { title: "Unobtrusive prompts", description: "A test of interface language that does not compete with content.", status: "In progress" },
  "heading-system": { title: "Heading system", description: "A series of typographic studies for long-form reading.", status: "In progress" },
  "work-connections-map": { title: "Map of working connections", description: "A draft map that turns notes into connected routes.", status: "In progress" },
};

export function getLocalizedExperiment(experiment: Experiment, locale: "ru" | "en"): Experiment {
  return locale === "en" ? { ...experiment, ...englishExperiments[experiment.slug] } : experiment;
}
