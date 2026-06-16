import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import PageLayout from "@/components/PageLayout";
import AsmrLanguageSwitcher from "@/features/asmr/components/AsmrLanguageSwitcher";
import RelatedTriggers from "@/features/asmr/components/RelatedTriggers";
import TriggerDetailFavorite from "@/features/asmr/components/TriggerDetailFavorite";
import TriggerTag from "@/features/asmr/components/TriggerTag";
import YoutubeEmbed from "@/features/asmr/components/YoutubeEmbed";
import { asmrtistByName } from "@/features/asmr/data/asmrtists";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import { asmrCopy, getAsmrLocale } from "@/features/asmr/data/i18n";
import { triggers } from "@/features/asmr/data/triggers";
import { getLocalizedTriggerSecondaryCategory } from "@/features/asmr/data/trigger-localization";
import { getTriggerBySlug } from "@/features/asmr/lib/get-triggers";

type Params = {
  slug: string;
};

type SearchParams = {
  lang?: string | string[];
};

export function generateStaticParams() {
  return triggers.map((trigger) => ({
    slug: trigger.slug,
  }));
}

export async function generateMetadata({
  searchParams,
  params,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = getAsmrLocale((await searchParams).lang);
  const trigger = getTriggerBySlug(slug);

  if (!trigger) {
    return {
      title: "ASMR trigger not found — VivishkosHub",
    };
  }

  return {
    title: `${trigger.title} — ASMR Trigger Catalog`,
    description: trigger.shortDescription[locale],
  };
}

export default async function AsmrTriggerPage({
  searchParams,
  params,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const locale = getAsmrLocale((await searchParams).lang);
  const copy = asmrCopy[locale];
  const catalogHref = locale === "en" ? "/asmr?lang=en" : "/asmr";
  const trigger = getTriggerBySlug(slug);

  if (!trigger) {
    return notFound();
  }

  const secondaryCategory = getLocalizedTriggerSecondaryCategory(trigger, locale);

  return (
    <PageLayout className="asmr-page">
      <main className="asmr-main">
        <div className="container asmr-detail-inner">
          <div className="asmr-detail-nav">
            <Link className="asmr-back-link" href={catalogHref}>
              {copy.backToCatalog}
            </Link>
            <Suspense fallback={null}>
              <AsmrLanguageSwitcher locale={locale} />
            </Suspense>
          </div>

          <article className="asmr-detail">
            <header className="asmr-detail-header">
              <div>
                <p className="asmr-kicker">
                  {triggerPrimaryCategories[trigger.primaryCategory][locale]} ·{" "}
                  {secondaryCategory}
                </p>
                <div className="asmr-detail-title-row">
                  <h1>{trigger.title}</h1>
                  <TriggerDetailFavorite
                    locale={locale}
                    triggerId={trigger.id}
                    triggerTitle={trigger.title}
                  />
                </div>
                <p>{trigger.shortDescription[locale]}</p>
              </div>
            </header>

            <section className="asmr-detail-section">
              <h2>{copy.description}</h2>
              <p>{trigger.description[locale]}</p>
            </section>

            {trigger.asmrtists.length ? (
              <section className="asmr-detail-section">
                <h2>{copy.asmrtists}</h2>
                <div className="asmr-tags">
                  {trigger.asmrtists.map((asmrtistName) => {
                    const asmrtist = asmrtistByName.get(asmrtistName);

                    if (asmrtist?.url) {
                      return (
                        <a
                          className="asmr-tag asmr-tag-asmrtist"
                          href={asmrtist.url}
                          key={asmrtistName}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {asmrtistName}
                        </a>
                      );
                    }

                    return <TriggerTag key={asmrtistName} tag={asmrtistName} variant="asmrtist" />;
                  })}
                </div>
              </section>
            ) : null}

            <section className="asmr-detail-section">
              <h2>{copy.tags}</h2>
              <div className="asmr-tags">
                {trigger.tags.map((tag) => (
                  <TriggerTag
                    href={`/asmr?tag=${encodeURIComponent(tag)}${locale === "en" ? "&lang=en" : ""}`}
                    key={tag}
                    tag={tag}
                    variant="tag"
                  />
                ))}
              </div>
            </section>

            <section className="asmr-detail-section">
              <h2>{copy.aliases}</h2>
              <div className="asmr-tags">
                {trigger.aliases.map((alias) => (
                  <TriggerTag key={alias} tag={alias} variant="alias" />
                ))}
              </div>
            </section>

            {trigger.youtubeVideos.length ? (
              <section className="asmr-detail-section">
                <h2>{copy.youtube}</h2>
                <div className="asmr-youtube-grid">
                  {trigger.youtubeVideos.slice(0, 3).map((video) => (
                    <YoutubeEmbed key={video.id} video={video} />
                  ))}
                </div>
              </section>
            ) : null}

            <RelatedTriggers
              currentTrigger={trigger}
              locale={locale}
              title={copy.relatedTriggers}
              triggers={triggers}
            />
          </article>
        </div>
      </main>
    </PageLayout>
  );
}
