import Link from "next/link";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="footer-title">VivishkosHub {year}</span>
        <div className="footer-links">
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Fun</Link>
        </div>
      </div>
    </footer>
  );
}
