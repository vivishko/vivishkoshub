import Link from "next/link";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/fun", label: "Notes" },
  { href: "/#about", label: "About" },
  { href: "/?lang=ru", label: "RU" },
  { href: "/?lang=en", label: "EN" },
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="site-wordmark" href="/">
          VIVISHKOSHUB
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <details className="mobile-nav">
          <summary>МЕНЮ</summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            {navigation.map((item) => (
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
