export type NoteSection = {
  heading: string;
  text: string;
};

export type NoteBody = {
  figure: string;
  sections: readonly NoteSection[];
  quote: string;
};

export type Note = {
  slug: string;
  publishedAt: string;
  displayDate: string;
  readingTime: string;
  title: string;
  description: string;
  tags: readonly string[];
  listingTags: readonly string[];
  body?: NoteBody;
};

export const notes = [
  {
    slug: "visual-discipline-in-a-personal-project",
    publishedAt: "2026-08-06",
    displayDate: "06.08.2026",
    readingTime: "6 мин",
    title: "Визуальная дисциплина в личном проекте",
    description: "Почему ограничение на количество приёмов обычно даёт более живой результат.",
    tags: ["Дизайн", "Процесс", "Системы"],
    listingTags: ["Дизайн", "Заметки"],
    body: {
      figure: "РИС. 01 — РИТМ, ПОВТОР И ОТСТУП",
      sections: [
        {
          heading: "Правила делают выбор быстрее",
          text: "Вместо того чтобы заново придумывать интерфейс на каждой странице, полезнее договориться о нескольких постоянных вещах: ширине текста, масштабе заголовков, линии и расстоянии между блоками.",
        },
        {
          heading: "Меньше приёмов — больше голоса",
          text: "Когда выразительный жест повторяется слишком часто, он превращается в шум. Одна система контраста, один способ выделения и последовательные подписи дают сайту характер без стилизации ради стилизации.",
        },
      ],
      quote: "Хорошая форма не объясняет себя — она помогает прочитать содержание.",
    },
  },
  {
    slug: "a-short-list-of-good-interfaces",
    publishedAt: "2026-07-28",
    displayDate: "28.07.2026",
    readingTime: "6 мин",
    title: "Короткий список хороших интерфейсов",
    description: "Собрала примеры, где редакционный ритм важнее декоративного жеста.",
    tags: ["Интерфейсы", "Текст", "Продукт"],
    listingTags: ["Дизайн", "Заметки"],
  },
  {
    slug: "leaving-room-for-unfinished-work",
    publishedAt: "2026-07-14",
    displayDate: "14.07.2026",
    readingTime: "9 мин",
    title: "Как оставлять место для незавершённости",
    description: "О черновиках, промежуточных состояниях и ценности открытой структуры.",
    tags: ["Проекты", "Исследования"],
    listingTags: ["Дизайн", "Заметки"],
  },
  {
    slug: "six-useful-links",
    publishedAt: "2026-06-30",
    displayDate: "30.06.2026",
    readingTime: "5 мин",
    title: "Шесть полезных ссылок",
    description: "Инструменты и материалы, к которым я возвращаюсь в работе.",
    tags: ["Ресурсы", "Ссылки", "Заметки"],
    listingTags: ["Ресурсы", "Ссылки"],
  },
] as const satisfies readonly Note[];

export type NoteSlug = (typeof notes)[number]["slug"];

export function isNoteSlug(slug: string): slug is NoteSlug {
  return notes.some((note) => note.slug === slug);
}

export function getNoteBySlug(slug: string): Note | undefined {
  return notes.find((note) => note.slug === slug);
}
