import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "Sandbox — VivishkosHub",
  description: "A private collection of interactive experiments.",
};

export default function FunPage() {
  return (
    <PageLayout>
      <main className="projects sandbox-page">
        <div className="container projects-inner">
          <header className="projects-intro">
            <h1>Sandbox</h1>
            <p>Private experiments, visual studies, and works in progress.</p>
            <p className="projects-filter" aria-label="Sandbox status">
              <span>Private</span>
              <span aria-hidden="true">·</span>
              <span>Interactive</span>
              <span aria-hidden="true">·</span>
              <span>In progress</span>
            </p>
          </header>

          <div className="project-grid">
            <Link className="project-card" href="/artemis-2-visualization">
              <div className="project-preview project-preview-2" aria-hidden="true">
                <span className="project-preview-panel" />
                <span className="project-preview-bar" />
              </div>
              <div className="project-card-copy">
                <span className="project-number">01</span>
                <h2 className="project-title">Artemis II Visualization</h2>
                <p className="project-summary">
                  An interactive mission-trajectory viewer built from JPL Horizons state vectors.
                </p>
              </div>
              <p className="project-tags">THREE.JS · SPACE · SIMULATION</p>
              <span className="project-card-link">Open visualization →</span>
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
