"use client";

import { cn } from "@/lib/utils";
import { XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, type FC } from "react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

interface ProjectGalleryProps {
  gallery: string[];
  projectTitle: string;
  className?: string;
}

export const ProjectGallery: FC<ProjectGalleryProps> = ({
  gallery,
  projectTitle,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Limit display to maximum 4 images
  const displayImages = gallery.slice(0, 4);
  const remainingCount = gallery.length - 4;

  return (
    <>
      <div
        className={cn("mt-8 grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      >
        {displayImages.map((image: string, index: number) => (
          <motion.div
            key={index}
            className="relative aspect-video rounded-card overflow-hidden border border-borderLight bg-canvas-white cursor-pointer shadow-outline-ring"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => openModal(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${projectTitle} screenshot ${index + 1}`}
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 bg-canvas-warm/0 hover:bg-canvas-warm/30 transition-colors duration-200" />

            {/* Show overlay on last image if there are more than 4 images */}
            {index === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-3xl font-medium">
                  +{remainingCount}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 w-full h-full max-w-6xl max-h-[90vh] mx-4 rounded-card border border-borderSubtle bg-canvas-white/95"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 p-2 rounded-pill bg-canvas-white text-text-primary border border-borderSubtle hover:bg-canvas-light transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>

              {/* Swiper Gallery */}
              <Swiper
                modules={[Navigation, Pagination, Zoom]}
                navigation
                pagination={{ clickable: true }}
                zoom={{ maxRatio: 3 }}
                initialSlide={selectedImageIndex}
                className="w-full h-full rounded-lg"
                spaceBetween={20}
                centeredSlides
              >
                {gallery.map((image: string, index: number) => (
                  <SwiperSlide
                    key={index}
                    className="flex items-center justify-center"
                  >
                    <div className="swiper-zoom-container w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${projectTitle} screenshot ${index + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
