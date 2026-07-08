'use client';

import React from 'react';
import Image from 'next/image';
import { NetworkBackground } from '@/components/NetworkBackground';

const instituciones = [
  { src: '/img-instituciones/losangelitos.png', alt: 'Los Angelitos' },
  { src: '/img-instituciones/enraizando.png',   alt: 'Enraizando'    },
  { src: '/img-instituciones/sonrisas1.png',    alt: 'Ruta de Sonrisas' },
];

// Repetir para llenar el scroll infinito
const allItems = [...instituciones, ...instituciones, ...instituciones, ...instituciones];

export function Partners() {
  return (
    <section
      id="areas"
      className="relative pt-20 pb-24 overflow-x-hidden"
      style={{ backgroundColor: '#EDE9E0' }}
    >
      <NetworkBackground patternId="net-bg" />


      {/* ── Título ───────────────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <div className="flex items-center gap-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#7A6650]/25 to-transparent" />
          <div className="flex flex-col items-center gap-3 shrink-0">
            <p
              className="font-headline font-extrabold uppercase tracking-[0.22em] text-[#7A6650]"
              style={{ fontSize: 'clamp(13px, 1.4vw, 16px)' }}
            >
              Instituciones que ya confían en nuestra red
            </p>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5273C2]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            </div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#7A6650]/25 to-transparent" />
        </div>
      </div>

      {/* ── Carrusel infinito ────────────────────────────────────────────────── */}
      <div className="relative z-20" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
        <div className="animate-infinite-scroll py-4">
          {allItems.map((item, idx) => (
            <div key={idx} className="mx-6 shrink-0">
              <Image
                src={item.src}
                alt={item.alt}
                width={120}
                height={78}
                priority={idx < 6}
                className="object-contain w-[85px] h-[55px] sm:w-[100px] sm:h-[65px] md:w-[120px] md:h-[78px] transition-transform duration-300 hover:scale-110 drop-shadow-sm"
                sizes="120px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
