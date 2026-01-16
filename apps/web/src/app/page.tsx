import Link from "next/link";

export default function Home() {
  return (
    <div className="page home">
      <header className="site-header">
        <div className="logo">VivishkosHub</div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Fun</Link>
        </nav>
      </header>
      <main className="hero">
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
      </main>
    </div>
  );
}
