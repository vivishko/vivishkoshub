import Link, { type LinkProps } from "next/link";
import type { ComponentProps } from "react";
import type { Locale } from "@/lib/locales";

type LocalizedLinkProps = LinkProps & Omit<ComponentProps<typeof Link>, keyof LinkProps> & { locale?: Locale };

export default function LocalizedLink({ href, locale = "ru", ...props }: LocalizedLinkProps) {
  if (typeof href !== "string") return <Link href={href} {...props} />;
  const url = new URL(href, "https://vivishkoshub.local");
  url.searchParams.set("lang", locale);
  return <Link href={`${url.pathname}${url.search}${url.hash}`} {...props} />;
}
