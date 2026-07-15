"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { weddingData } from "../data";
import { SectionHeading } from "./section-heading";

export default function Gallery() {
  const { gallery } = weddingData;
  const [active, setActive] = useState<number | null>(null);
  const activePhoto = active !== null ? gallery[active] : null;

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
            className={`group relative aspect-square overflow-hidden rounded-sm border border-[var(--wed-gold)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--wed-gold)] ${
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
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">
            {activePhoto?.alt ?? "Ảnh cưới"}
          </DialogTitle>
          {activePhoto ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-sm sm:aspect-[4/3]">
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={1200}
                height={1200}
                sizes="(max-width: 768px) 100vw, 800px"
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
