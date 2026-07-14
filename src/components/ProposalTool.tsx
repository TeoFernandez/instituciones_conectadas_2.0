import Image from 'next/image';
import { ArrowUpRight, Instagram, FileText } from 'lucide-react';

// URL del Google Form al que redirige el botón de contacto.
const GOOGLE_FORM_URL = 'https://forms.gle/qj92cDGKua3oVA65A';

const contactInfo = [
  { Icon: Instagram, text: '@institucionesconectadas', sub: 'Seguinos', color: '#FF9F1C', href: 'https://instagram.com/institucionesconectadas' },
];

export function ProposalTool() {
  return (
    <section
      id="contacto"
      className="relative py-24 px-6 md:px-6 lg:px-4 overflow-hidden"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* Dot-grid fondo */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #001A33 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Columna izquierda: imagen ──────────────────────────────────── */}
        <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] rounded-[1.75rem] overflow-hidden">
          <Image
            src="/img/seccionContacto.jpeg"
            alt="Adultos y niños haciendo talleres en comunidad"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* ── Columna derecha: contacto ──────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          <span className="text-[11px] font-headline font-bold tracking-[0.28em] uppercase text-[#5273C2]">
            Contacto
          </span>
          <h2 className="font-headline font-extrabold text-[#001A33] leading-tight" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>
            ¿Querés sumarte a la <span style={{ color: '#5273C2' }}>Red?</span>
          </h2>
          <p className="text-[#475569] text-[15px] leading-relaxed max-w-md">
            Completá el formulario o seguinos en Instagram — nos encanta conocer nuevas instituciones que quieran sumarse.
          </p>

          {/* Formulario de contacto — CTA que redirige al Google Form */}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 p-4 rounded-2xl text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            style={{ backgroundColor: '#5273C2' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/20">
              <FileText size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight flex-1">
              <span className="text-[15px] font-headline font-extrabold">Completar formulario de contacto</span>
              <span className="text-[12px] text-white/85">Te lleva al Google Form</span>
            </div>
            <ArrowUpRight size={18} className="text-white/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </a>

          {/* Info de contacto */}
          <div className="grid grid-cols-1 gap-3">
            {contactInfo.map(({ Icon, text, sub, color, href }) => {
              const Wrapper = href ? 'a' : 'div';
              return (
                <Wrapper
                  key={text}
                  {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-[#001A33]/8 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                    <Icon size={15} style={{ color }} />
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-[12px] font-body font-semibold text-[#001A33] truncate">{text}</span>
                    <span className="text-[10px] text-[#94A3B8]">{sub}</span>
                  </div>
                </Wrapper>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
