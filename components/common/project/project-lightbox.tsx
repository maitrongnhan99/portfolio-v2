"use client";

import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, type FC } from "react";
import { A11y, Keyboard, Navigation, Pagination, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { GalleryImage } from "@/lib/data-service-types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

interface ProjectLightboxProps {
  gallery: GalleryImage[];
  projectTitle: string;
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

export const ProjectLightbox: FC<ProjectLightboxProps> = ({
  gallery,
  projectTitle,
  isOpen,
  initialIndex,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

          <motion.div
            className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] mx-4 rounded-card border border-borderSubtle bg-canvas-white/95 overflow-hidden"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close lightbox"
              className="absolute top-4 right-4 z-20 p-2 rounded-pill bg-canvas-white text-text-primary border border-borderSubtle hover:bg-canvas-light transition-colors shadow-outline-ring"
            >
              <XIcon className="h-5 w-5" />
            </button>

            <Swiper
              modules={[Navigation, Pagination, Zoom, Keyboard, A11y]}
              navigation
              pagination={{ clickable: true }}
              zoom={{ maxRatio: 3 }}
              keyboard={{ enabled: true }}
              initialSlide={initialIndex}
              className="w-full h-full"
              spaceBetween={20}
              centeredSlides
              aria-label={`${projectTitle} fullscreen gallery`}
            >
              {gallery.map((img, i) => (
                <SwiperSlide key={i} className="flex items-center justify-center">
                  <div className="swiper-zoom-container flex items-center justify-center w-full h-full">
                    <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                      <Image
                        src={img.src || "/placeholder.svg"}
                        alt={
                          img.alt ??
                          img.caption ??
                          `${projectTitle} screenshot ${i + 1}`
                        }
                        fill
                        sizes="(max-width:1024px) 100vw, 1024px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-10 inset-x-0 text-center pointer-events-none">
                      <span className="inline-block bg-black/50 text-white text-sm px-4 py-1.5 rounded-pill">
                        {img.caption}
                      </span>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
