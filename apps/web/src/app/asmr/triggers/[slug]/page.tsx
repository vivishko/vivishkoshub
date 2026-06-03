import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import RelatedTriggers from "@/features/asmr/components/RelatedTriggers";
import TriggerDetailFavorite from "@/features/asmr/components/TriggerDetailFavorite";
import TriggerTag from "@/features/asmr/components/TriggerTag";
import YoutubeEmbed from "@/features/asmr/components/YoutubeEmbed";
import { asmrtistByName } from "@/features/asmr/data/asmrtists";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import { triggers } from "@/features/asmr/data/triggers";
import { getTriggerBySlug } from "@/features/asmr/lib/get-triggers";

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

  return (
    <PageLayout className="asmr-page">
      <main className="asmr-main">
        <div className="container asmr-detail-inner">
          <Link className="asmr-back-link" href="/asmr">
            ← Назад к каталогу
          </Link>

          <article className="asmr-detail">
            <header className="asmr-detail-header">
              <div>
                <p className="asmr-kicker">
                  {triggerPrimaryCategories[trigger.primaryCategory]} · {trigger.secondaryCategory}
                </p>
                <div className="asmr-detail-title-row">
                  <h1>{trigger.title}</h1>
                  <TriggerDetailFavorite triggerId={trigger.id} triggerTitle={trigger.title} />
                </div>
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
                  {trigger.asmrtists.map((asmrtistName) => {
                    const asmrtist = asmrtistByName.get(asmrtistName);

                    if (asmrtist?.url) {
                      return (
                        <a
                          className="asmr-tag"
                          href={asmrtist.url}
                          key={asmrtistName}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {asmrtistName}
                        </a>
                      );
                    }

                    return <TriggerTag key={asmrtistName} tag={asmrtistName} />;
                  })}
                </div>
              </section>
            ) : null}

            <section className="asmr-detail-section">
              <h2>Теги</h2>
              <div className="asmr-tags">
                {trigger.tags.map((tag) => (
                  <TriggerTag href={`/asmr?tag=${encodeURIComponent(tag)}`} key={tag} tag={tag} />
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
                <div className="asmr-youtube-grid">
                  {trigger.youtubeVideos.slice(0, 3).map((video) => (
                    <YoutubeEmbed key={video.id} video={video} />
                  ))}
                </div>
              </section>
            ) : null}

            <RelatedTriggers currentTrigger={trigger} triggers={triggers} />
          </article>
        </div>
      </main>
    </PageLayout>
  );
}
