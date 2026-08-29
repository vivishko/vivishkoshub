import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import type { Locale } from "@/lib/locales";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  locale?: Locale;
};

export default function PageLayout({ children, className, locale }: PageLayoutProps) {
  return (
    <div className={`page${className ? ` ${className}` : ""}`}>
      <SiteHeader locale={locale} />
      {children}
      <SiteFooter />
    </div>
  );
}
