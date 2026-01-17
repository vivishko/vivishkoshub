import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="logo" href="/">
        VivishkosHub
      </Link>
      <nav className="nav">
        <Link href="/projects">Projects</Link>
        <Link href="/fun">Fun</Link>
      </nav>
    </header>
  );
}
