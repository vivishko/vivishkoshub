"use client";

import type { MouseEvent } from "react";

export default function ProjectUsageLink() {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById("gallery");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.location.hash = "gallery";
    window.dispatchEvent(new Event("open-gallery"));
  };

  return (
    <a className="project-link" href="#gallery" onClick={handleClick}>
      Demo
    </a>
  );
}
