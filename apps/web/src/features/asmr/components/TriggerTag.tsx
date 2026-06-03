import Link from "next/link";

type TriggerTagProps = {
  tag: string;
  href?: string;
};

export default function TriggerTag({ tag, href }: TriggerTagProps) {
  if (href) {
    return (
      <Link className="asmr-tag" href={href}>
        {tag}
      </Link>
    );
  }

  return <span className="asmr-tag">{tag}</span>;
}
