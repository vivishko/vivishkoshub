import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { getLocalizedProfile } from "@/data/profile";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Обо мне — VivishkosHub",
  description: "Дизайн, исследования и независимые проекты Вивишко Шуб.",
};

export default async function AboutPage({ searchParams }: { searchParams: Promise<LocaleSearchParams> }) {
  const locale = getLocale(await searchParams);
  const profile = getLocalizedProfile(locale);
  const copy = locale === "en" ? { title: "About", experience: "Experience", footer: "RU    EN    BLOG    ARTICLES    ABOUT    ARCHIVE    PRIVACY", social: "Social profiles" } : { title: "Обо мне", experience: "Опыт", footer: "RU    EN    БЛОГ    СТАТЬИ    ОБО МНЕ    АРХИВ    PRIVACY", social: "Социальные профили" };
  return (
    <PageLayout className="about-page" locale={locale}>
      <main className="about-main">
        <div className="container about-container">
          <header className="about-intro">
            <h1>{copy.title}</h1>
            <p className="about-subtitle">{profile.title}</p>
            <div className="about-intro-box">
              {profile.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </header>

          <section className="about-experience" aria-labelledby="experience-title">
            <h2 id="experience-title">{copy.experience}</h2>
            <div className="about-experience-list">
              {profile.experience.map((item) => (
                <article className="about-experience-entry" key={`${item.role}-${item.period}`}>
                  <h3>{item.role}</h3>
                  <p className="about-organization">{item.organization}</p>
                  <p className="about-period">
                    {item.period}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="about-description">{item.description}</p>
                  <span className="about-entry-link">{item.linkLabel} <span aria-hidden="true">↗</span></span>
                </article>
              ))}
            </div>
          </section>

          <div className="about-profile-cta" aria-label={profile.profileLink.label}>
            <span>{profile.profileLink.label}</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </main>

      <footer className="about-profile-footer">
        <p className="about-profile-footer-nav">{copy.footer}</p>
        <p className="about-profile-socials" aria-label={copy.social}>
          {profile.socials.map((social) => (
            <span key={social.platform}>{social.label}</span>
          ))}
        </p>
        <p className="about-profile-copyright">© 2026 VIVISHKOSHUB</p>
      </footer>
    </PageLayout>
  );
}
