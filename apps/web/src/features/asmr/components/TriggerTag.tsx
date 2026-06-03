import Link from "next/link";

type TriggerTagProps = {
  tag: string;
  href?: string;
  variant?: "tag" | "alias" | "asmrtist";
};

export default function TriggerTag({ tag, href, variant = "tag" }: TriggerTagProps) {
  const className = `asmr-tag asmr-tag-${variant}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {tag}
      </Link>
    );
  }

  return <span className={className}>{tag}</span>;
}
