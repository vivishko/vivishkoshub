import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <main className="projects">
        <div className="container projects-inner">
          <div className="empty-state">
            <h2>Page not found</h2>
            <p>This page does not exist. Try heading back to the project list.</p>
            <Link className="button primary" href="/projects">
              Back to projects
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
