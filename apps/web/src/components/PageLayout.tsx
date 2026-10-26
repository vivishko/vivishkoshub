import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

type PageLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={`page${className ? ` ${className}` : ""}`}>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
