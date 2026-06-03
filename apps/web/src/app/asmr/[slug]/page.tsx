import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import { triggers } from "@/features/asmr/data/triggers";
import { getTriggerById, getTriggerBySlug } from "@/features/asmr/lib/get-triggers";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return triggers.map((trigger) => ({
    slug: trigger.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trigger = getTriggerBySlug(slug);

  if (!trigger) {
    return {
      title: "ASMR trigger not found — VivishkosHub",
    };
  }

  return {
    title: `${trigger.title} — ASMR Trigger Catalog`,
    description: trigger.shortDescription.ru,
  };
}

export default async function AsmrTriggerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const trigger = getTriggerBySlug(slug);

  if (!trigger) {
    return notFound();
  }

  const relatedTriggers = trigger.relatedTriggerIds
    .map((triggerId) => getTriggerById(triggerId))
    .filter((relatedTrigger) => relatedTrigger !== undefined);

  return (
    <PageLayout className="asmr-page">
      <main className="asmr-main">
        <div className="container asmr-detail-inner">
          <Link className="asmr-back-link" href="/asmr">
            Назад в каталог
          </Link>

          <article className="asmr-detail">
            <header className="asmr-detail-header">
              <div>
                <p className="asmr-kicker">
                  {triggerPrimaryCategories[trigger.primaryCategory]} · {trigger.secondaryCategory}
                </p>
                <h1>{trigger.title}</h1>
                <p>{trigger.shortDescription.ru}</p>
              </div>
            </header>

            <section className="asmr-detail-section">
              <h2>Описание</h2>
              <p>{trigger.description.ru}</p>
            </section>

            {trigger.asmrtists.length ? (
              <section className="asmr-detail-section">
                <h2>ASMRtists</h2>
                <div className="asmr-tags">
                  {trigger.asmrtists.map((asmrtist) => (
                    <span className="asmr-tag" key={asmrtist}>
                      {asmrtist}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="asmr-detail-section">
              <h2>Теги</h2>
              <div className="asmr-tags">
                {trigger.tags.map((tag) => (
                  <span className="asmr-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="asmr-detail-section">
              <h2>Алиасы</h2>
              <div className="asmr-tags">
                {trigger.aliases.map((alias) => (
                  <span className="asmr-tag" key={alias}>
                    {alias}
                  </span>
                ))}
              </div>
            </section>

            {trigger.youtubeVideos.length ? (
              <section className="asmr-detail-section">
                <h2>YouTube</h2>
                <div className="asmr-video-list">
                  {trigger.youtubeVideos.map((video) => (
                    <a
                      className="asmr-video-link"
                      href={video.url}
                      key={video.id}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{video.title}</span>
                      <span>{video.channel}</span>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            {relatedTriggers.length ? (
              <section className="asmr-detail-section">
                <h2>Похожие триггеры</h2>
                <div className="asmr-related-grid">
                  {relatedTriggers.map((relatedTrigger) => (
                    <Link
                      className="asmr-related-card"
                      href={`/asmr/${relatedTrigger.slug}`}
                      key={relatedTrigger.id}
                    >
                      <span>{relatedTrigger.title}</span>
                      <small>{relatedTrigger.shortDescription.ru}</small>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>
        </div>
      </main>
    </PageLayout>
  );
}
