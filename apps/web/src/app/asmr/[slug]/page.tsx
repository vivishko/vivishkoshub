import { permanentRedirect } from "next/navigation";
import { getAsmrLocale } from "@/features/asmr/data/i18n";

type Params = {
  slug: string;
};

type SearchParams = {
  lang?: string | string[];
};

export default async function LegacyAsmrTriggerPage({
  searchParams,
  params,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const locale = getAsmrLocale((await searchParams).lang);

  permanentRedirect(`/asmr/triggers/${slug}${locale === "en" ? "?lang=en" : ""}`);
}
