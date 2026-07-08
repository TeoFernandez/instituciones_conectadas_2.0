'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, ArrowUpRight, FileText } from 'lucide-react';

const navItems = [
  { label: 'Inicio',                 href: '/' },
  { label: 'Quiénes Somos',         href: '#quienes-somos' },
  { label: 'Programas',             href: '#programas' },
  { label: 'Contacto',              href: '#contacto' },
  { label: 'Sumar una Institución', href: '#contacto' },
];

const socials = [
  { Icon: Instagram, href: 'https://instagram.com/institucionesconectadas', label: 'Instagram', color: '#F43F5E' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#232323' }}>

      {/* Top accent multicolor */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#5273C2] via-[#FF9F1C] via-[#F43F5E] via-[#22C55E] to-[#2EC4B6]" />

      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 pt-16 pb-8">

        {/* ── Cabecera del footer ────────────────────────────────────────── */}
        <div className="flex items-end mb-14 pb-10 border-b border-white/10">
          <div className="relative w-[220px] h-[62px]">
            <Image src="/img/logo.png" alt="Instituciones Conectadas" fill className="object-contain object-left" />
          </div>
        </div>

        {/* ── Grid de columnas ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-20 gap-y-14 mb-14 max-w-6xl mx-auto">

          {/* Nosotros */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-headline font-black tracking-[0.35em] uppercase text-white">Nosotros</span>
            </div>
            <p className="text-white/60 text-[13px] leading-[1.8]">
              Articulación institucional para el desarrollo comunitario y la contención de las infancias en barrios del AMBA.
            </p>
            <div className="flex gap-1.5 mt-1">
              {socials.map(({ Icon, href, label, color }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/70 transition-all duration-300 hover:scale-110 hover:border-transparent hover:shadow-sm"
                  style={{ transition: 'all 0.3s' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = color;
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                  }}
                >
                  <Icon size={13} />
                </Link>
              ))}
            </div>
          </div>

          {/* Menú */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-headline font-black tracking-[0.35em] uppercase text-white">Menú</span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {navItems.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-[13px] text-white/60 hover:text-white transition-colors duration-200 w-fit"
                  >
                    <span className="w-0 group-hover:w-3 h-px rounded-full bg-[#FF9F1C] transition-all duration-300 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-headline font-black tracking-[0.35em] uppercase text-white">Contacto</span>
            </div>
            <ul className="flex flex-col gap-3.5">
              {[
                { Icon: Instagram, text: '@institucionesconectadas', href: 'https://instagram.com/institucionesconectadas', multiline: false },
              ].map(({ Icon, text, multiline, href }, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(46,196,182,0.15)' }}>
                    <Icon size={12} style={{ color: '#2EC4B6' }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-white/60 leading-relaxed hover:text-white transition-colors duration-200"
                      style={{ whiteSpace: multiline ? 'pre-line' : 'normal' }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-[12px] text-white/60 leading-relaxed" style={{ whiteSpace: multiline ? 'pre-line' : 'normal' }}>
                      {text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-headline font-black tracking-[0.35em] uppercase text-white">Comunidad</span>
            </div>
            <p className="text-[13px] text-white/60 leading-[1.8]">
              ¿Querés sumarte a la red? Escribinos y empezamos a construir juntos.
            </p>

            {/* Botón formulario de contacto */}
            <Link
              href="#contacto"
              className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 hover:shadow-md transition-all duration-300 w-fit"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(82,115,194,0.18)' }}>
                <FileText size={15} style={{ color: '#5273C2' }} />
              </div>
              <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-[9px] font-headline font-bold tracking-[0.2em] uppercase text-white/50">
                  Escribinos
                </span>
                <span className="text-[13px] font-headline font-extrabold text-white">
                  Formulario de contacto
                </span>
              </div>
              <ArrowUpRight
                size={13}
                className="ml-1 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
              />
            </Link>
          </div>
        </div>

        {/* ── AwenTech ─────────────────────────────────────────────────── */}
        <div className="h-px bg-white/10 mb-5" />
        <div className="flex justify-center">
          <Link
            href="https://www.awentech.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 opacity-30 hover:opacity-60 transition-all duration-400"
          >
            <div className="relative w-5 h-5 shrink-0">
              <Image
                src="/img/LogoChicoAwenTech - Sin fondo.png"
                alt="Awen Tech"
                fill
                className="object-contain grayscale invert"
              />
            </div>
            <span className="text-[10px] font-headline font-bold tracking-[0.25em] uppercase text-white/50">
              Awen Tech
            </span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
