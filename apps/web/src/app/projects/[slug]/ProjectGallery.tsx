"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";

type GalleryImage = { src: string; alt: string };

export default function ProjectGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isOpen = activeIndex !== null;

  const activeImage = useMemo(() => {
    if (activeIndex === null) return null;
    return images[activeIndex];
  }, [activeIndex, images]);

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % images.length));
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === null ? images.length - 1 : (prev - 1 + images.length) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowRight") {
        goNext();
      }
      if (event.key === "ArrowLeft") {
        goPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, goNext, goPrev, isOpen]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    if (!start) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    touchStart.current = null;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  };

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
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            ×
          </button>
          <button
            type="button"
            className="lightbox-nav"
            onClick={goPrev}
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
            onClick={goNext}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}
