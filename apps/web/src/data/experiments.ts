export type Experiment = {
  slug: string;
  date: string;
  title: string;
  description: string;
  status: "В работе";
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
