import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="logo" href="/">
          VivishkosHub
        </Link>
        <nav className="nav">
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Fun</Link>
        </nav>
      </div>
    </header>
  );
}
