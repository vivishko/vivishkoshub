import Link from "next/link";
import { primaryNavigation } from "@/data/site-routes";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="site-wordmark" href="/">
          VIVISHKOSHUB
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
          <span className="site-language">RU / EN</span>
        </nav>
        <details className="mobile-nav">
          <summary>МЕНЮ</summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            {primaryNavigation.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
