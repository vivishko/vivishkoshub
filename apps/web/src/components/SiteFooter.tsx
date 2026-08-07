import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="footer-title">© {year} VIVISHKOSHUB</span>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Notes</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>
    </footer>
  );
}
