"use client";

import dynamic from "next/dynamic";

const ArtemisScene = dynamic(() => import("@/features/artemis/components/Scene"), {
  ssr: false,
  loading: () => <div className="artemis-loading">Loading Artemis II visualization...</div>,
});

export default function ArtemisVisualizationClient() {
  return <ArtemisScene />;
}
