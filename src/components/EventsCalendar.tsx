'use client';

import { useEffect, useState } from 'react';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarBlankIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { EVENTS_UPDATED_EVENT, MONTH_NAMES, defaultEvents, fetchEvents, type EventItem } from '@/lib/events-store';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // lunes = 0
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function EventsCalendar() {
  const [events, setEvents] = useState<EventItem[]>(defaultEvents);
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [slide, setSlide] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    const sync = () => {
      fetchEvents().then((list) => {
        if (active) setEvents(list);
      });
    };
    sync();
    window.addEventListener(EVENTS_UPDATED_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(EVENTS_UPDATED_EVENT, sync);
    };
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = buildMonthGrid(year, month);

  const eventsInView = events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month);
  const eventForDay = (day: number) => eventsInView.find((e) => e.date.getDate() === day);

  const changeMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const upcoming = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  const monthEvents = [...eventsInView].sort((a, b) => a.date.getTime() - b.date.getTime());
  const activeSlide = monthEvents.length === 0 ? 0 : Math.min(slide, monthEvents.length - 1);

  useEffect(() => {
    setSlide(0);
  }, [year, month]);

  const prevSlide = () => setSlide((s) => (s === 0 ? monthEvents.length - 1 : s - 1));
  const nextSlide = () => setSlide((s) => (s === monthEvents.length - 1 ? 0 : s + 1));

  return (
    <section
      id="programas"
      className="relative px-6 md:px-6 lg:px-4 pt-20 pb-24 overflow-hidden"
      style={{ backgroundColor: '#EDE9E0' }}
    >
      <NetworkBackground patternId="net-events" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Título */}
        <div className="text-center mb-14">
          <span className="text-[10px] font-headline font-bold uppercase tracking-[0.28em] text-[#5273C2]">
            Agenda
          </span>
          <h2
            className="font-headline font-extrabold text-[#001A33] leading-[0.95] tracking-tight mt-3"
            style={{ fontSize: 'clamp(34px, 4.5vw, 56px)' }}
          >
            Próximos <span className="text-[#5273C2]">eventos</span>
          </h2>
          <p className="text-[#475569] text-sm leading-relaxed mt-4 max-w-md mx-auto">
            Torneos, talleres y jornadas que ya tenemos planeadas en la red.
          </p>
        </div>

        {/* ── Carrusel de eventos del mes en vista ──────────────────────── */}
        {monthEvents.length === 0 ? (
          <div className="mb-10 rounded-[1.75rem] bg-white/60 border border-dashed border-[#001A33]/15 py-16 text-center text-sm text-[#64748B] font-body">
            No hay eventos cargados para {MONTH_NAMES[month]} {year}.
          </div>
        ) : (
        <div className="relative mb-10">
          <div className="relative h-[340px] md:h-[440px] rounded-[1.75rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,26,51,0.4)]">
            <div
              className="flex h-full transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {monthEvents.map((e) => {
                const showImage = e.image && !brokenImages.has(e.id);
                return (
                <div
                  key={e.id}
                  className="relative h-full w-full shrink-0"
                  style={!showImage ? { background: `linear-gradient(135deg, ${e.color}, ${e.color}CC)` } : undefined}
                >
                  {showImage && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={e.image}
                        alt={e.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setBrokenImages((prev) => new Set(prev).add(e.id))}
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(180deg, ${e.color}22 0%, rgba(0,26,51,0.8) 100%)` }}
                      />
                    </>
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-12">
                    <span
                      className="self-start text-[10px] font-headline font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm mb-4"
                      style={{ color: e.color }}
                    >
                      {e.programa}
                    </span>
                    <h4
                      className="font-headline font-extrabold text-white leading-[0.98] drop-shadow-sm mb-3 max-w-2xl"
                      style={{ fontSize: 'clamp(24px, 3.6vw, 44px)' }}
                    >
                      {e.title}
                    </h4>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-white/90 font-body text-[13px] md:text-sm">
                        <span className="flex items-center gap-1.5">
                          <CalendarBlankIcon size={16} weight="duotone" />
                          {e.date.getDate()} de {MONTH_NAMES[e.date.getMonth()]}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <ClockIcon size={16} weight="duotone" />
                          {e.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPinIcon size={16} weight="duotone" />
                          {e.location}
                        </span>
                      </div>

                      {e.formUrl && (
                        <a
                          href={e.formUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-1.5 text-[12px] font-headline font-bold uppercase tracking-[0.08em] px-4 py-2.5 rounded-full bg-white hover:bg-white/90 hover:scale-105 transition-all duration-200 shadow-lg"
                          style={{ color: e.color }}
                        >
                          Anotarme
                          <ArrowUpRightIcon size={14} weight="bold" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Flechas */}
            <button
              type="button"
              aria-label="Evento anterior"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#001A33] hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Evento siguiente"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#001A33] hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <CaretRightIcon size={16} weight="bold" />
            </button>
          </div>

          {/* Indicadores */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {monthEvents.map((e, i) => (
              <button
                key={e.id}
                type="button"
                aria-label={`Ir al evento ${e.title}`}
                onClick={() => setSlide(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === activeSlide ? '28px' : '7px',
                  background: i === activeSlide ? e.color : '#CBD5E1',
                }}
              />
            ))}
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
          {/* ── Calendario ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-[1.75rem] p-6 md:p-8 shadow-[0_10px_30px_-15px_rgba(0,26,51,0.25)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-extrabold text-[#001A33] text-lg capitalize">
                {MONTH_NAMES[month]} {year}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Mes anterior"
                  onClick={() => changeMonth(-1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#001A33] border border-[#001A33]/10 hover:bg-[#5273C2] hover:text-white hover:border-[#5273C2] transition-colors duration-200"
                >
                  <CaretLeftIcon size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  aria-label="Mes siguiente"
                  onClick={() => changeMonth(1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#001A33] border border-[#001A33]/10 hover:bg-[#5273C2] hover:text-white hover:border-[#5273C2] transition-colors duration-200"
                >
                  <CaretRightIcon size={14} weight="bold" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-headline font-bold uppercase tracking-[0.08em] text-[#94A3B8] py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, i) => {
                const event = day ? eventForDay(day) : undefined;
                const isToday = day !== null && sameDay(new Date(year, month, day), new Date(2026, 5, 30));
                return (
                  <div
                    key={i}
                    className="aspect-square flex items-center justify-center"
                  >
                    {day && (
                      <div
                        className="w-full h-full rounded-xl flex flex-col items-center justify-center gap-0.5 text-[13px] font-body transition-colors duration-200"
                        style={
                          event
                            ? { background: `${event.color}18`, color: event.color, fontWeight: 700 }
                            : isToday
                            ? { border: '1.5px solid #5273C2', color: '#001A33', fontWeight: 600 }
                            : { color: '#475569' }
                        }
                      >
                        {day}
                        {event && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: event.color }} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Lista de eventos ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            {upcoming.map((e) => (
              <div
                key={e.id}
                className="flex gap-4 items-center bg-white rounded-2xl p-4 shadow-[0_6px_16px_-10px_rgba(0,26,51,0.2)] border"
                style={{ borderColor: `${e.color}22` }}
              >
                {/* Fecha */}
                <div
                  className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center"
                  style={{ background: `${e.color}15` }}
                >
                  <span className="font-headline font-black text-[18px] leading-none" style={{ color: e.color }}>
                    {e.date.getDate()}
                  </span>
                  <span className="text-[9px] font-headline font-bold uppercase tracking-[0.08em]" style={{ color: e.color }}>
                    {MONTH_NAMES[e.date.getMonth()].slice(0, 3)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block text-[9px] font-headline font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full mb-1.5"
                    style={{ background: `${e.color}15`, color: e.color }}
                  >
                    {e.programa}
                  </span>
                  <h4 className="font-headline font-extrabold text-[#001A33] text-[15px] leading-snug truncate">
                    {e.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#64748B] font-body">
                    <span className="flex items-center gap-1">
                      <ClockIcon size={12} weight="duotone" />
                      {e.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon size={12} weight="duotone" />
                      {e.location}
                    </span>
                  </div>
                </div>

                {e.formUrl && (
                  <a
                    href={e.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Anotarme a ${e.title}`}
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200 hover:text-white"
                    style={{ borderColor: `${e.color}33`, color: e.color }}
                    onMouseEnter={(ev) => (ev.currentTarget.style.background = e.color)}
                    onMouseLeave={(ev) => (ev.currentTarget.style.background = 'transparent')}
                  >
                    <ArrowUpRightIcon size={14} weight="bold" />
                  </a>
                )}
              </div>
            ))}

            <div className="flex items-center gap-2 mt-2 px-1 text-[11px] text-[#94A3B8] font-body">
              <CalendarBlankIcon size={14} weight="duotone" />
              Agenda sujeta a cambios — seguí actualizada la red para nuevas fechas.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
