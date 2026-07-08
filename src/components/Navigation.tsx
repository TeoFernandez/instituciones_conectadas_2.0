'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Quiénes Somos', href: '#quienes-somos' },
    { name: 'Programas', href: '#programas' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-3 pt-3 md:px-5 md:pt-5">
      <div
        className={cn(
          'max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-2xl',
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl border border-[#001A33]/8 px-4 py-2.5 md:px-6 shadow-[0_12px_32px_rgba(0,26,51,0.12)]'
            : 'bg-transparent px-4 py-2 md:px-6 border border-transparent'
        )}
      >
        <Link href="/" className="relative w-[180px] h-[48px] md:w-[200px] md:h-[54px] shrink-0">
          <Image src="/img/logo2.png" alt="Instituciones Conectadas" fill className="object-contain" priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-[12px] font-headline font-bold uppercase tracking-[0.14em] text-[#001A33]/70 hover:text-[#5273C2] transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#5273C2] group-hover:w-full transition-all duration-300 ease-out" />
            </Link>
          ))}
        </div>

        <a href="#contacto" className="hidden md:block px-5 py-2.5 text-[11px] font-headline font-bold uppercase tracking-[0.14em] text-white bg-[#001A33] rounded-full hover:bg-[#5273C2] transition-all duration-300">
          Sumá tu institución
        </a>

        <button
          className="md:hidden p-2 text-[#001A33] hover:text-[#5273C2] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden max-w-7xl mx-auto overflow-hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
        )}
      >
        <div className="bg-white/96 backdrop-blur-xl border border-[#001A33]/8 rounded-2xl px-6 py-6 flex flex-col gap-5 shadow-[0_12px_32px_rgba(0,26,51,0.12)]">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[#001A33] font-headline font-bold text-base hover:text-[#5273C2] transition-colors flex items-center gap-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="text-[10px] text-[#5273C2]/50 font-bold tracking-widest tabular-nums">0{i + 1}</span>
              {link.name}
            </Link>
          ))}
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 w-full py-3 rounded-full bg-[#001A33] text-white font-headline font-bold text-sm tracking-widest uppercase text-center"
          >
            Sumá tu institución
          </a>
        </div>
      </div>
    </nav>
  );
}
