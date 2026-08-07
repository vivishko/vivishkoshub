import Link from "next/link";
import { footerNavigation } from "@/data/site-routes";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="footer-title">© {year} VIVISHKOSHUB</span>
        <nav className="footer-links" aria-label="Footer navigation">
          {footerNavigation.map((item) => (
            <Link href={item.href} key={item.label}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
