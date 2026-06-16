import Link from "next/link";
import type { AsmrLocale, Trigger } from "@/features/asmr/types";

type RelatedTriggersProps = {
  currentTrigger: Trigger;
  locale: AsmrLocale;
  triggers: Trigger[];
  title: string;
};

function getRelatedTriggers(currentTrigger: Trigger, triggers: Trigger[]) {
  const relatedById = currentTrigger.relatedTriggerIds
    .map((triggerId) => triggers.find((trigger) => trigger.id === triggerId))
    .filter((trigger) => trigger !== undefined);

  const relatedIdSet = new Set(relatedById.map((trigger) => trigger.id));
  const fallbackTriggers = triggers
    .filter((trigger) => trigger.id !== currentTrigger.id && !relatedIdSet.has(trigger.id))
    .map((trigger) => ({
      trigger,
      matchingTagCount: trigger.tags.filter((tag) => currentTrigger.tags.includes(tag)).length,
    }))
    .filter((match) => match.matchingTagCount > 0)
    .sort((firstMatch, secondMatch) => secondMatch.matchingTagCount - firstMatch.matchingTagCount)
    .map((match) => match.trigger);

  return [...relatedById, ...fallbackTriggers].slice(0, 6);
}

export default function RelatedTriggers({
  currentTrigger,
  locale,
  triggers,
  title,
}: RelatedTriggersProps) {
  const relatedTriggers = getRelatedTriggers(currentTrigger, triggers);

  if (!relatedTriggers.length) {
    return null;
  }

  return (
    <section className="asmr-detail-section">
      <h2>{title}</h2>
      <div className="asmr-related-grid">
        {relatedTriggers.map((relatedTrigger) => (
          <Link
            className="asmr-related-card"
            href={`/asmr/triggers/${relatedTrigger.slug}${locale === "en" ? "?lang=en" : ""}`}
            key={relatedTrigger.id}
          >
            <span>{relatedTrigger.title}</span>
            <small>{relatedTrigger.shortDescription[locale]}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
