import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export const metadata: Metadata = {
  title: "VivishkosHub",
  description: "A quiet launchpad for projects, prototypes, and bold experiments.",
};

export default function Home() {
  return (
    <PageLayout className="home">
      <main className="hero">
        <div className="container hero-inner">
          <h1>Space for bold ideas and vivid experiments.</h1>
          <p>
            A quiet launchpad for projects, prototypes, and the moments in between.
            Start here, then explore what is brewing on the projects page.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/projects">
              View projects
            </Link>
            <Link className="button secondary" href="#">
              Read the notes
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
