
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { PlaceHolderImages } from '@/app/lib/placeholder-images';
import { cn } from '@/lib/utils';

export function VideoCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);
  const videos = [
    PlaceHolderImages.find(img => img.id === 'hero-video-1')!,
    PlaceHolderImages.find(img => img.id === 'hero-video-2')!,
    PlaceHolderImages.find(img => img.id === 'hero-video-3')!,
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full py-12 flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-6xl px-4 overflow-hidden h-[400px]">
        {videos.map((video, index) => {
          const isActive = index === activeIndex;
          const isPrev = index === (activeIndex === 0 ? videos.length - 1 : activeIndex - 1);
          const isNext = index === (activeIndex === videos.length - 1 ? 0 : activeIndex + 1);

          return (
            <div
              key={video.id}
              className={cn(
                'relative transition-all duration-700 ease-in-out rounded-2xl overflow-hidden shrink-0 shadow-2xl',
                isActive 
                  ? 'w-[320px] md:w-[420px] h-[340px] opacity-100 scale-110 z-20 border-2 border-primary' 
                  : 'w-[140px] md:w-[180px] h-[240px] opacity-40 scale-90 z-10 grayscale blur-[2px]',
                !isActive && !isPrev && !isNext && 'hidden'
              )}
            >
              <Image
                src={video.imageUrl}
                alt={video.description}
                fill
                className="object-cover"
                data-ai-hint={video.imageHint}
              />
              {isActive && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center text-background transform transition-transform group-hover:scale-110">
                    <Play className="fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft />
        </button>
        <div className="flex gap-2">
          {videos.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/30'
              )}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
