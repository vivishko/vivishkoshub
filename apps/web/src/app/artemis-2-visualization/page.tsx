import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import ArtemisVisualizationClient from "./ArtemisVisualizationClient";

export const metadata: Metadata = {
  title: "Artemis II Visualization — VivishkosHub",
  description: "Interactive 3D mission trajectory viewer powered by JPL Horizons data.",
};

export default function ArtemisVisualizationPage() {
  return (
    <PageLayout className="artemis-page">
      <main className="artemis-main">
        <ArtemisVisualizationClient />
      </main>
    </PageLayout>
  );
}
