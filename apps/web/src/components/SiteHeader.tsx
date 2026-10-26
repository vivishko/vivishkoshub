import LanguageSwitcher from "@/components/LanguageSwitcher";
import LocalizedLink from "@/components/LocalizedLink";
import { primaryNavigation } from "@/data/site-routes";
import type { Locale } from "@/lib/locales";

export default function SiteHeader({ locale = "ru" }: { locale?: Locale }) {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <LocalizedLink className="site-wordmark" href="/" locale={locale}>
          VIVISHKOSHUB
        </LocalizedLink>
        <nav className="site-nav" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <LocalizedLink key={item.label} href={item.href} locale={locale}>
              {item.label}
            </LocalizedLink>
          ))}
          <LanguageSwitcher locale={locale} />
        </nav>
        <details className="mobile-nav">
          <summary>МЕНЮ</summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            {primaryNavigation.map((item) => (
              <LocalizedLink key={item.label} href={item.href} locale={locale}>
                {item.label}
              </LocalizedLink>
            ))}
            <LanguageSwitcher locale={locale} />
          </nav>
        </details>
      </div>
    </header>
  );
}
