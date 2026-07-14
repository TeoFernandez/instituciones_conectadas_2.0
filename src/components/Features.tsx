'use client';

import React from 'react';
import Image from 'next/image';
import {
  GraduationCapIcon,
  BookOpenIcon,
  UsersThreeIcon,
  LeafIcon,
  SneakerIcon,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const features: {
  number: string;
  eje: string;
  objetivo: string;
  programa: string;
  actividades: string[];
  color: string;
  Icon: PhosphorIcon;
  logo?: string;
}[] = [
  {
    number: '01',
    eje: 'Desarrollo Institucional y Formación Dirigencial',
    objetivo: 'Fortalecer a las organizaciones y a sus dirigentes/as mediante capacitaciones, asesoramiento, articulaciones y acceso al conocimiento.',
    programa: 'La Universidad en tu Club',
    actividades: ['Administración', 'Comunicación', 'Capacitaciones Generales'],
    color: '#5273C2',
    Icon: GraduationCapIcon,
  },
  {
    number: '02',
    eje: 'Educación y Desarrollo Integral',
    objetivo: 'Acompañar las trayectorias educativas de niños y adolescentes.',
    programa: 'Hoja de Ruta',
    actividades: ['Clases de Apoyo'],
    color: '#FF9F1C',
    Icon: BookOpenIcon,
  },
  {
    number: '03',
    eje: 'Recreación, Cultura y Comunidad',
    objetivo: 'Experiencias recreativas que fortalezcan los vínculos comunitarios y promuevan la participación.',
    programa: 'Ruta de Sonrisas',
    actividades: ['Recreación'],
    color: '#F43F5E',
    Icon: UsersThreeIcon,
    logo: '/img/sonrisas1.png',
  },
  {
    number: '04',
    eje: 'Ambiente y Ciudadanía Sustentable',
    objetivo: 'Compromiso ambiental y cuidado del entorno desde una perspectiva comunitaria: buenas prácticas, alimentación y cuidado.',
    programa: 'Enraizando',
    actividades: ['Ambiente', 'Hábitos'],
    color: '#22C55E',
    Icon: LeafIcon,
    logo: '/img/enraizando.png',
  },
  {
    number: '05',
    eje: 'Deporte, Salud e Inclusión',
    objetivo: 'Acercar a niños y niñas al deporte como herramienta de inclusión.',
    programa: 'Mis Pasitos',
    actividades: ['Iniciación Deportiva'],
    color: '#2EC4B6',
    Icon: SneakerIcon,
  },
];

const arrowClass =
  'h-11 w-11 bg-white border border-[#001A33]/8 shadow-[0_8px_24px_rgba(0,26,51,0.18)] text-[#001A33] hover:bg-[#5273C2] hover:text-white hover:border-[#5273C2] transition-colors duration-300 disabled:opacity-0';

function EjesCarousel() {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-6">
      <Carousel opts={{ align: 'start', loop: false }} className="px-6 md:px-16">
        <CarouselContent className="-ml-6 py-6">
          {features.map((f) => (
            <CarouselItem key={f.number} className="pl-6 basis-auto w-[320px] sm:w-[360px]">
              <div
                className="group/card relative h-full rounded-[1.75rem] bg-white overflow-hidden flex flex-col will-change-transform hover:-translate-y-2 hover:scale-[1.045] hover:z-10"
                style={{
                  border: `1px solid ${f.color}22`,
                  boxShadow: '0 6px 16px -10px rgba(0,26,51,0.14)',
                  transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 14px 28px -12px rgba(0,26,51,0.22)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px -10px rgba(0,26,51,0.14)';
                }}
              >
                {/* Bloque de color suave: ícono + número + título */}
                <div
                  className="flex flex-col gap-3 justify-center p-6 min-h-[128px]"
                  style={{ background: `${f.color}14` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(0,0,0,0.18)]">
                      <f.Icon size={30} color={f.color} weight="duotone" />
                    </div>
                    <span
                      className="font-headline font-black tabular-nums text-[13px] tracking-[0.08em] shrink-0"
                      style={{ color: f.color }}
                    >
                      {f.number}
                    </span>
                  </div>
                  <h3
                    className="font-headline font-black text-[#001A33] leading-snug"
                    style={{ fontSize: '17px', letterSpacing: '0.03em' }}
                  >
                    {f.eje}
                  </h3>
                </div>

                {/* Bloque blanco: objetivo + programa + actividades, ícono de fondo */}
                <div className="relative flex-1 flex flex-col gap-4 p-6 overflow-hidden bg-white">
                  {/* Marca de agua */}
                  <f.Icon
                    aria-hidden="true"
                    className="absolute -right-4 -bottom-4 pointer-events-none select-none"
                    size={130}
                    color={f.color}
                    weight="duotone"
                    style={{ opacity: 0.12 }}
                  />

                  <div className="relative z-10 flex flex-col gap-4">
                    {/* Objetivo */}
                    <p className="text-[12px] text-[#64748B] leading-relaxed font-body">
                      {f.objetivo}
                    </p>

                    {/* Programa */}
                    <div>
                      <span className="block text-[9px] font-headline font-bold uppercase tracking-[0.18em] text-[#94A3B8] mb-1.5">
                        Programa
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-headline font-bold uppercase tracking-[0.04em] pl-1.5 pr-3 py-1.5 rounded-full bg-[#F1F5F9]"
                        style={{ color: f.logo ? '#001A33' : f.color }}
                      >
                        {f.logo && (
                          <span className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white">
                            <Image src={f.logo} alt="" fill className="object-cover" sizes="20px" />
                          </span>
                        )}
                        {f.programa}
                      </span>
                    </div>

                    {/* Actividades */}
                    <div className="pt-3 border-t" style={{ borderColor: `${f.color}1A` }}>
                      <span className="block text-[9px] font-headline font-bold uppercase tracking-[0.18em] text-[#94A3B8] mb-2">
                        Actividades
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {f.actividades.map((act) => (
                          <span
                            key={act}
                            className="text-[10px] font-body font-medium text-[#475569] bg-[#F1F5F9] px-2.5 py-1 rounded-md"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={`left-3 md:left-8 ${arrowClass}`} />
        <CarouselNext className={`right-3 md:right-8 ${arrowClass}`} />
      </Carousel>
    </div>
  );
}

export function Features() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '760px' }}>

      {/* ── Imagen de fondo ──────────────────────────────────────────────────── */}
      <Image
        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=100&w=2400&auto=format&fit=crop&crop=center"
        alt=""
        fill
        className="object-cover object-left"
        aria-hidden="true"
        priority
      />

      {/* ── Overlay derecho: hace legible el texto ────────────────────────────
           Transparente en la izquierda (imagen visible) → opaco en la derecha
      */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(248,250,252,0) 25%, rgba(248,250,252,0.82) 55%, rgba(248,250,252,0.97) 75%)',
        }}
      />

      {/* ── Overlay inferior: área del timeline ──────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '52%',
          background: 'linear-gradient(to top, rgba(248,250,252,0.97) 40%, rgba(248,250,252,0.80) 70%, transparent 100%)',
        }}
      />

      {/* ── Contenido ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-between py-20"
           style={{ minHeight: '760px' }}>

        {/* Cabecera — alineada a la derecha sobre la zona clara */}
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] font-headline font-bold uppercase tracking-[0.28em] text-[#5273C2]">
            Nuestros pilares
          </span>
          <h2
            className="font-headline font-extrabold text-[#001A33] leading-[0.9] tracking-tight mt-3 whitespace-nowrap"
            style={{ fontSize: 'clamp(28px, 4.6vw, 68px)' }}
          >
            Cinco ejes <span className="text-[#5273C2]">de acción</span>
          </h2>

          <div className="max-w-[420px]">
            <p className="text-[#475569] text-sm leading-relaxed mt-4 max-w-xs ml-auto">
              Los ejes temáticos que estructuran nuestros<br />
              programas y actividades en el territorio.
            </p>

            {/* Tira de íconos + label por eje */}
            <div className="hidden md:flex flex-wrap justify-end gap-x-5 gap-y-2 mt-6 pt-5 border-t border-[#001A33]/10">
              {features.map((f) => (
                <span key={f.number} className="flex items-center gap-1.5 text-[11px] font-headline font-bold text-[#001A33]/70">
                  <f.Icon size={13} color={f.color} weight="duotone" />
                  {f.programa}
                </span>
              ))}
            </div>
          </div>
        </div>

        <EjesCarousel />

      </div>
    </section>
  );
}
