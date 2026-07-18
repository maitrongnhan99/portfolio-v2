"use client";

import Image from "next/image";
import { useState, type FC } from "react";
import {
  A11y,
  FreeMode,
  Keyboard,
  Navigation,
  Pagination,
  Thumbs,
} from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container } from "@/components/ui/container";
import type { GalleryImage } from "@/lib/data-service-types";
import { ProjectLightbox } from "./project-lightbox";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface ProjectShowcaseGalleryProps {
  gallery: GalleryImage[];
  projectTitle: string;
  className?: string;
}

export const ProjectShowcaseGallery: FC<ProjectShowcaseGalleryProps> = ({
  gallery,
  projectTitle,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-canvas-white">
      <Container>
        <h2 className="text-2xl font-light text-text-primary mb-6">
          Project Screenshots
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Thumbs, A11y, Keyboard]}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          navigation
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          spaceBetween={0}
          centeredSlides
          className="w-full rounded-featured overflow-hidden border border-borderLight shadow-card cursor-zoom-in"
          style={{ aspectRatio: "16/9" }}
          onSlideChange={(s) => setLightboxIndex(s.activeIndex)}
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`${projectTitle} screenshots`}
        >
          {gallery.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full">
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={
                    img.alt ??
                    img.caption ??
                    `${projectTitle} screenshot ${i + 1}`
                  }
                  fill
                  sizes="(max-width:768px) 100vw, 90vw"
                  className="object-contain bg-canvas-light"
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 py-5 pointer-events-none">
                    <p className="text-white text-sm">{img.caption}</p>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-3">
          <Swiper
            modules={[Thumbs, FreeMode]}
            onSwiper={setThumbsSwiper}
            slidesPerView={"auto"}
            freeMode
            watchSlidesProgress
            spaceBetween={10}
            className="thumbs-swiper"
          >
            {gallery.map((img, i) => (
              <SwiperSlide key={i} style={{ width: "120px", height: "75px" }}>
                <div className="relative w-full h-full rounded-comfortable overflow-hidden border border-borderSubtle opacity-60 [.swiper-slide-thumb-active_&]:opacity-100 [.swiper-slide-thumb-active_&]:border-text-muted cursor-pointer transition-opacity">
                  <Image
                    src={img.src || "/placeholder.svg"}
                    alt={img.alt ?? `thumb ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <ProjectLightbox
          gallery={gallery}
          projectTitle={projectTitle}
          isOpen={isLightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      </Container>
    </section>
  );
};
