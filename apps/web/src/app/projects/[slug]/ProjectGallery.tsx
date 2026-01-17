"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type GalleryImage = { src: string; alt: string };

export default function ProjectGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const activeImage = useMemo(() => {
    if (activeIndex === null) return null;
    return images[activeIndex];
  }, [activeIndex, images]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) =>
          prev === null ? 0 : (prev + 1) % images.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) =>
          prev === null ? images.length - 1 : (prev - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [images.length, isOpen]);

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#gallery" && images.length) {
        setActiveIndex(0);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    window.addEventListener("open-gallery", openFromHash);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      window.removeEventListener("open-gallery", openFromHash);
    };
  }, [images.length]);

  return (
    <section className="project-gallery" id="gallery">
      <h2>Gallery</h2>
      <div className="project-gallery-grid">
        {images.map((image, index) => (
          <button
            className="project-gallery-item"
            type="button"
            key={image.src}
            onClick={() => setActiveIndex(index)}
          >
            <Image src={image.src} alt={image.alt} width={480} height={360} />
          </button>
        ))}
      </div>

      {isOpen && activeImage ? (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close gallery"
          >
            ×
          </button>
          <button
            type="button"
            className="lightbox-nav"
            onClick={() =>
              setActiveIndex(
                activeIndex === null
                  ? 0
                  : (activeIndex - 1 + images.length) % images.length,
              )
            }
            aria-label="Previous image"
          >
            ←
          </button>
          <div className="lightbox-media">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              width={960}
              height={720}
            />
          </div>
          <button
            type="button"
            className="lightbox-nav"
            onClick={() =>
              setActiveIndex(
                activeIndex === null ? 0 : (activeIndex + 1) % images.length,
              )
            }
            aria-label="Next image"
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
