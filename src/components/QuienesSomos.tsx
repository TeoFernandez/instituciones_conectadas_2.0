import React from 'react';
import Image from 'next/image';
import { Building2, MapPin, Users } from 'lucide-react';

const stats = [
  { value: '40+', label: 'Instituciones aliadas', color: '#5273C2', Icon: Building2 },
  { value: '5',   label: 'Barrios del AMBA',      color: '#FF9F1C', Icon: MapPin    },
  { value: '2K+', label: 'Chicos alcanzados',     color: '#2EC4B6', Icon: Users     },
];

export function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      className="relative py-28 px-6 md:px-6 lg:px-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F8FBFF 0%, #FFFFFF 45%, #F0FDFB 100%)' }}
    >
      {/* Dot-grid fondo */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #001A33 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />


      {/* Arco decorativo fondo derecha */}
      <div
        className="absolute -right-32 -top-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(82,115,194,0.07) 0%, rgba(82,115,194,0.03) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute -right-16 bottom-0 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(46,196,182,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 items-center relative z-10">

        {/* ── Columna izquierda ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          <p
            className="font-headline font-extrabold text-[#001A33] tracking-tight leading-[0.92] whitespace-nowrap"
            style={{ fontSize: 'clamp(44px,6vw,76px)' }}
          >
            Quiénes{' '}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '2px #5273C2' }}
            >
              somos
            </span>
          </p>

          {/* Foto de comunidad */}
          <div className="relative w-full h-[220px] sm:h-[260px] rounded-[1.5rem] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=95&w=1600&auto=format&fit=crop"
              alt="Manos de un grupo de personas unidas, símbolo de comunidad"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 border-t border-[#001A33]/8 pt-6">
            {stats.map(({ value, label, color, Icon }) => (
              <div
                key={label}
                className="group flex flex-col gap-3 p-4 rounded-2xl border border-transparent hover:border-current/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ background: `${color}0D` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}20` }}
                >
                  <Icon size={16} style={{ color }} strokeWidth={2} />
                </div>
                <span
                  className="font-headline font-extrabold leading-none tabular-nums"
                  style={{ color, fontSize: 'clamp(26px,3.5vw,42px)' }}
                >
                  {value}
                </span>
                <span className="text-[11px] text-[#94A3B8] font-body uppercase tracking-[0.14em] leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Chips de color */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5273C2]" />
            <span className="w-3 h-3 rounded-full bg-[#FF9F1C]" />
            <span className="w-3 h-3 rounded-full bg-[#2EC4B6]" />
            <span className="w-3 h-3 rounded-full bg-[#F43F5E]" />
          </div>
        </div>

        {/* ── Columna derecha ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 pt-2 md:pt-0">

          {/* ── Bloque editorial vintage ─────────────────────────────── */}
          <div className="flex flex-col gap-5">
            <p className="text-[#334155] text-[17px] leading-[2.05] font-body">
              Instituciones Conectadas nace de la convicción de que{' '}
              <span className="font-headline font-extrabold text-[#001A33] tracking-wide uppercase text-[14px] sm:whitespace-nowrap">
                ninguna organización transforma una comunidad en soledad
              </span>. Somos una red que promueve el encuentro, la cooperación y
              el fortalecimiento de las instituciones que construyen
              diariamente el tejido social de nuestros barrios.
            </p>
            <p className="text-[#334155] text-[17px] leading-[2.05] font-body">
              Creemos en el valor de generar espacios compartidos donde
              clubes, entidades religiosas, organizaciones sociales, centros
              comunitarios y vecinos puedan encontrarse, reconocerse y
              construir{' '}
              <span className="font-headline font-extrabold relative inline sm:whitespace-nowrap" style={{ color: '#5273C2' }}>
                proyectos con impacto colectivo
              </span>. A través de actividades, jornadas y propuestas
              integradoras, buscamos tender puentes que multipliquen
              oportunidades y fortalezcan los lazos comunitarios.
            </p>
            <p className="text-[#334155] text-[17px] leading-[2.05] font-body">
              Al mismo tiempo, entendemos que el desarrollo de las
              instituciones requiere dirigentes preparados, comprometidos y
              con vocación de servicio. Por eso impulsamos instancias de
              formación, intercambio y crecimiento, convencidos de que el
              liderazgo se construye desde el aprendizaje permanente y el
              trabajo colaborativo.
            </p>
            <p
              className="font-headline font-extrabold leading-snug"
              style={{ color: '#5273C2', fontSize: 'clamp(17px,1.6vw,20px)' }}
            >
              Conectar personas, fortalecer instituciones y construir
              comunidad, es la esencia que nos inspira cada día.
            </p>
          </div>
        </div>
      </div>

      {/* Divisor inferior multicolor */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5273C2] via-[#FF9F1C] via-[#F43F5E] via-[#22C55E] to-[#2EC4B6] pointer-events-none" />
    </section>
  );
}
