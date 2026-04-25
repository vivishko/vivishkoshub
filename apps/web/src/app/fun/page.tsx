import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import PageLayout from "@/components/PageLayout";
import Tag from "@/components/Tag";
import { funItems } from "@/data/fun-items";

export const metadata: Metadata = {
  title: "Fun Lab — VivishkosHub",
  description: "Playful experiments, mini games, and quick visual sketches.",
};

export default function FunPage() {
  return (
    <PageLayout className="fun">
      <main className="fun-section">
        <div className="container fun-section-inner">
          <div className="fun-intro">
            <h1>Fun Lab</h1>
            <p>
              Mini games, playful visuals, and experimental sketches. These are quick explorations
              designed to surprise and delight.
            </p>
          </div>
          <div className="fun-grid">
            {funItems.map((item) => {
              const content = (
                <>
                  <div className="fun-card-top">
                    <span className="fun-chip">{item.type}</span>
                    <span className="fun-status">{item.status}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <div className="fun-tags">
                    {item.tags.length ? (
                      item.tags.map((tag) => <Tag className="fun-tag" key={tag} label={tag} />)
                    ) : (
                      <Tag className="fun-tag" label="No tags yet" />
                    )}
                  </div>
                </>
              );

              if (item.href) {
                return (
                  <Link
                    className="fun-card"
                    href={item.href}
                    key={item.title}
                    style={{ "--accent": item.accent } as CSSProperties}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <article
                  className="fun-card"
                  key={item.title}
                  style={{ "--accent": item.accent } as CSSProperties}
                >
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
