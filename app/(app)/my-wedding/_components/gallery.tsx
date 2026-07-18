"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";

export default function Gallery() {
  const { gallery } = weddingData;
  const [active, setActive] = useState<number | null>(null);
  const activePhoto = active !== null ? gallery[active] : null;

  const showPrev = () =>
    setActive((index) =>
      index === null ? index : (index + gallery.length - 1) % gallery.length,
    );
  const showNext = () =>
    setActive((index) =>
      index === null ? index : (index + 1) % gallery.length,
    );

  const handleLightboxKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") showPrev();
    if (event.key === "ArrowRight") showNext();
  };

  const lightboxControlClassName =
    "absolute z-10 flex items-center justify-center rounded-full bg-black/50 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <section
      aria-label="Album ảnh cưới"
      className="flex flex-col items-center gap-10 py-16 sm:py-20"
    >
      <SectionHeading>ALBUM ẢNH CƯỚI</SectionHeading>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-6">
        {gallery.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(index)}
            className={`group relative aspect-square overflow-hidden rounded-2xl border border-[var(--wed-gold)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wed-gold)] ${
              photo.wide ? "md:col-span-2" : ""
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={600}
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="max-w-3xl border-none bg-transparent p-0 shadow-none [&>button]:hidden"
          onKeyDown={handleLightboxKeyDown}
        >
          <DialogTitle className="sr-only">
            {activePhoto?.alt ?? "Ảnh cưới"}
          </DialogTitle>
          {activePhoto ? (
            <div className="relative mx-auto w-fit max-w-[calc(100%-6.5rem)] sm:max-w-[calc(100%-8rem)]">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  width={1200}
                  height={1200}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="h-auto max-h-[80vh] w-auto max-w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Đóng ảnh"
                className={`${lightboxControlClassName} -right-3 -top-3`}
              >
                <XIcon className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={showPrev}
                aria-label="Ảnh trước"
                className={`${lightboxControlClassName} -left-12 top-1/2 -translate-y-1/2 sm:-left-16`}
              >
                <CaretLeftIcon className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Ảnh tiếp theo"
                className={`${lightboxControlClassName} -right-12 top-1/2 -translate-y-1/2 sm:-right-16`}
              >
                <CaretRightIcon className="h-6 w-6" />
              </button>

              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 font-[Inter] text-xs text-white backdrop-blur-sm">
                {(active ?? 0) + 1} / {gallery.length}
              </span>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
