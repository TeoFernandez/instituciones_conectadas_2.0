import { Navigation } from '@/components/Navigation';
import { HeroMeshBackground } from '@/components/HeroMeshBackground';
import { ThreeMesh } from '@/components/ThreeMeshLazy';
import { QuienesSomos } from '@/components/QuienesSomos';
import { Features } from '@/components/Features';
import { EventsCalendar } from '@/components/EventsCalendar';
import { Impact } from '@/components/Impact';
import { Partners } from '@/components/Partners';
import { ProposalTool } from '@/components/ProposalTool';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Canvas fijo — compartido por todas las secciones transparentes */}
      <HeroMeshBackground />

      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden">

        <ThreeMesh />

        {/* Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-10">

            {/* Single phrase */}
            <h1
              className="hero-rise [animation-delay:300ms] font-headline font-extrabold text-[#001A33] leading-[0.88] tracking-tight break-words"
              style={{ fontSize: 'clamp(2rem, 9vw, 7.5rem)' }}
            >
              Conectamos<br />
              <span className="text-[#5273C2]">instituciones.</span><br />
              Transformamos<br />
              <span className="text-[#FF9F1C]">barrios.</span>
            </h1>

            {/* Divider dots */}
            <div className="hero-fade [animation-delay:600ms] flex items-center gap-3">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20 hero-line [animation-delay:650ms]" />
              <span className="w-2 h-2 rounded-full bg-[#5273C2]" />
              <span className="w-2 h-2 rounded-full bg-[#FF9F1C]" />
              <span className="w-2 h-2 rounded-full bg-[#2EC4B6]" />
              <span className="w-2 h-2 rounded-full bg-[#F43F5E]" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20 hero-line [animation-delay:650ms]" />
            </div>

            {/* Buttons */}
            <div className="hero-rise [animation-delay:700ms] flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contacto" className="px-9 py-4 bg-[#5273C2] text-white font-headline font-bold rounded-xl shadow-[0_8px_32px_rgba(82,115,194,0.28)] hover:bg-[#435E9F] hover:shadow-[0_12px_40px_rgba(82,115,194,0.38)] hover:scale-[1.03] transition-all duration-300 text-sm tracking-wide text-center">
                Sumá tu institución
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hero-fade [animation-delay:1100ms] flex flex-col items-center gap-2">
          <span className="text-[9px] font-headline font-bold uppercase tracking-[0.35em] text-[#001A33]/30">Scroll</span>
          <div className="scroll-bounce w-px h-10 bg-gradient-to-b from-[#5273C2]/50 to-transparent" />
        </div>

        {/* Línea separadora multicolor */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#5273C2] via-[#FF9F1C] via-[#F43F5E] via-[#22C55E] to-[#2EC4B6] z-10 pointer-events-none" />
      </section>

      <QuienesSomos />
      <Features />
      <Impact />
      <EventsCalendar />
      <Partners />
      <ProposalTool />
      <Footer />
      
      <Toaster />
    </main>
  );
}
