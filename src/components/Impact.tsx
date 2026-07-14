'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { NetworkBackground } from '@/components/NetworkBackground';

const stats = [
  { value: '113+', label: 'Instituciones afiliadas', color: '#5273C2' },
  { value: '22+',  label: 'Localidades del AMBA',    color: '#FF9F1C' },
  { value: '12K',  label: 'Población alcanzada',     color: '#2EC4B6' },
  { value: '150+', label: 'Jornadas realizadas',     color: '#F43F5E' },
];

const photos = [
  { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?q=95&w=1400&auto=format&fit=crop', alt: 'Chicos en clases de apoyo', label: 'Educación' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=95&w=1400&auto=format&fit=crop', alt: 'Aula con estudiantes', label: 'Educación' },
  { src: 'https://images.unsplash.com/photo-1777489689168-497290f235d5?q=95&w=1400&auto=format&fit=crop', alt: 'Niños jugando al fútbol en un parque', label: 'Deporte' },
  { src: 'https://images.unsplash.com/photo-1657664058691-2633847111c4?q=95&w=1400&auto=format&fit=crop', alt: 'Una adulta y una niña cuidando una huerta', label: 'Ambiente' },
  { src: 'https://images.unsplash.com/photo-1762017576498-38047a90b7e1?q=95&w=1400&auto=format&fit=crop', alt: 'Grupo de chicos sonriendo al aire libre', label: 'Recreación' },
  { src: 'https://images.unsplash.com/photo-1766932901295-d4185660341b?q=95&w=1400&auto=format&fit=crop', alt: 'Adultos y niños haciendo talleres en comunidad', label: 'Institucional' },
];

function PhotoShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(id);
  }, []);

  const select = (i: number) => setActive(i);

  return (
    <div className="flex flex-col gap-3">
      {/* Foto grande */}
      <div className="relative h-[300px] sm:h-[380px] md:h-[440px] rounded-[1.75rem] overflow-hidden">
        {photos.map((p, i) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            fill
            priority={i === 0}
            className="object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        ))}

        {/* Scrim inferior + label */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5273C2]" />
          <span className="text-[11px] font-headline font-bold uppercase tracking-[0.16em] text-white">
            {photos[active].label}
          </span>
        </div>
        <span className="absolute bottom-4 right-5 text-[11px] font-headline font-bold text-white/80 tabular-nums">
          0{active + 1} / 0{photos.length}
        </span>
      </div>

      {/* Filmstrip */}
      <div className="flex gap-2.5 overflow-x-auto py-1.5 px-0.5 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => select(i)}
            aria-label={`Ver foto: ${p.label}`}
            className="relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 [scroll-snap-align:start]"
            style={{
              borderColor: i === active ? '#5273C2' : 'transparent',
              opacity: i === active ? 1 : 0.55,
            }}
          >
            <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="100px" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function Impact() {
  return (
    <section className="relative py-24 px-6 md:px-6 lg:px-4 overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
      <NetworkBackground patternId="net-impact" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 items-center">

        {/* ── Columna izquierda: fotos ─────────────────────────────────────── */}
        <PhotoShowcase />

        {/* ── Columna derecha: texto + stats ──────────────────────────────── */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-px bg-[#5273C2]" />
            <span className="text-[11px] font-headline font-bold tracking-[0.28em] uppercase text-[#5273C2]">
              Nuestro impacto
            </span>
          </div>

          <p
            className="font-headline font-extrabold text-[#001A33] leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(28px,3.6vw,44px)' }}
          >
            No trabajamos solos.{' '}
            <span className="text-[#94A3B8]">Construimos red — y eso cambia lo que es posible.</span>
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#001A33]/10">
            {stats.map(({ value, label, color }) => (
              <div key={label} className="flex flex-col gap-1.5 pt-6">
                <span
                  className="font-headline font-extrabold leading-none tabular-nums"
                  style={{ color, fontSize: 'clamp(30px,3.6vw,44px)' }}
                >
                  {value}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-body uppercase tracking-[0.14em] leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
