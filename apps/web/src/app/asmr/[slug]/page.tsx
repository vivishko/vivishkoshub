import { permanentRedirect } from "next/navigation";

type Params = {
  slug: string;
};

export default async function LegacyAsmrTriggerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  permanentRedirect(`/asmr/triggers/${slug}`);
}
