'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarBlankIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { EVENTS_UPDATED_EVENT, MONTH_NAMES, fetchEvents, type EventItem } from '@/lib/events-store';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const WEEKDAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Cuántos de los próximos eventos entran en el banner.
const BANNER_LIMIT = 6;

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function inMonth(date: Date, year: number, month: number) {
  return date.getFullYear() === year && date.getMonth() === month;
}

/** "Hoy", "Mañana" o "En N días" si el evento cae esta semana; si falta más, null. */
function relativeLabel(date: Date, today: Date): string | null {
  const diff = Math.round((startOfDay(date).getTime() - today.getTime()) / DAY_MS);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff > 1 && diff < 7) return `En ${diff} días`;
  return null;
}

/** Ej.: "Sábado 15 de noviembre". */
function longDate(d: Date) {
  return `${WEEKDAY_NAMES[d.getDay()]} ${d.getDate()} de ${MONTH_NAMES[d.getMonth()].toLowerCase()}`;
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
  // Ambos arrancan en null: el sitio se exporta como HTML estático, así que la
  // fecha de hoy se toma recién en el navegador (si no, quedaría congelada en
  // la fecha del build). Mientras tanto se muestra un esqueleto de carga.
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(startOfDay(new Date()));
  }, []);

  useEffect(() => {
    let active = true;
    const sync = () => {
      fetchEvents().then((list) => {
        if (active) setEvents([...list].sort((a, b) => a.date.getTime() - b.date.getTime()));
      });
    };
    sync();
    window.addEventListener(EVENTS_UPDATED_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(EVENTS_UPDATED_EVENT, sync);
    };
  }, []);

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

        {events && today ? (
          <>
            <EventsBanner
              events={events.filter((e) => e.date.getTime() >= today.getTime()).slice(0, BANNER_LIMIT)}
              today={today}
            />
            <MonthAgenda events={events} today={today} />
          </>
        ) : (
          <AgendaSkeleton />
        )}
      </div>
    </section>
  );
}

/** Banner con los próximos eventos (de hoy en adelante), sin importar el mes que muestre el calendario. */
function EventsBanner({ events, today }: { events: EventItem[]; today: Date }) {
  const [slide, setSlide] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  if (events.length === 0) {
    return (
      <div className="mb-10 rounded-[1.75rem] bg-white/60 border border-dashed border-[#001A33]/15 px-6 py-14 text-center">
        <span className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center bg-[#5273C2]/10 text-[#5273C2]">
          <CalendarBlankIcon size={22} weight="duotone" />
        </span>
        <p className="font-headline font-extrabold text-[#001A33] text-lg">Estamos preparando nuevas fechas</p>
        <p className="text-sm text-[#64748B] font-body mt-1.5 max-w-sm mx-auto">
          Muy pronto vas a encontrar acá los próximos torneos, talleres y jornadas de la red.
        </p>
      </div>
    );
  }

  const count = events.length;
  const active = Math.min(slide, count - 1);
  const goTo = (i: number) => setSlide((i + count) % count);

  return (
    <div className="relative mb-10">
      <div className="relative h-[340px] md:h-[440px] rounded-[1.75rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,26,51,0.4)]">
        <div
          className="flex h-full transition-transform duration-600 ease-in-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {events.map((e) => {
            const showImage = e.image && !brokenImages.has(e.id);
            const soon = relativeLabel(e.date, today);
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
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className="text-[10px] font-headline font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm"
                      style={{ color: e.color }}
                    >
                      {e.programa}
                    </span>
                    {soon && (
                      <span className="flex items-center gap-1.5 text-[10px] font-headline font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[#001A33]">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                        {soon}
                      </span>
                    )}
                  </div>
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
                        {longDate(e.date)}
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

        {count > 1 && (
          <>
            {/* Flechas — arriba en mobile (el texto vive abajo de la tarjeta), centradas en desktop */}
            <button
              type="button"
              aria-label="Evento anterior"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 top-3 md:left-4 md:top-1/2 md:-translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#001A33] hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
            <button
              type="button"
              aria-label="Evento siguiente"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 top-3 md:right-4 md:top-1/2 md:-translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#001A33] hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <CaretRightIcon size={16} weight="bold" />
            </button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {events.map((e, i) => (
            <button
              key={e.id}
              type="button"
              aria-label={`Ir al evento ${e.title}`}
              onClick={() => setSlide(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === active ? '28px' : '7px',
                background: i === active ? e.color : '#CBD5E1',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Calendario mensual (arranca en el mes actual) + lista con los eventos de ese mes. */
function MonthAgenda({ events, today }: { events: EventItem[]; today: Date }) {
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = MONTH_NAMES[month].toLowerCase();
  const cells = buildMonthGrid(year, month);
  const isCurrentMonth = inMonth(today, year, month);

  const monthEvents = events.filter((e) => inMonth(e.date, year, month));
  const eventsOnDay = (day: number) => monthEvents.filter((e) => e.date.getDate() === day);

  // Primer evento después del mes en vista: si el mes está vacío, ofrecemos saltar ahí.
  const nextMonthStart = new Date(year, month + 1, 1).getTime();
  const nextEvent = events.find((e) => e.date.getTime() >= nextMonthStart);

  const goToMonthOf = (d: Date) => setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
  const changeMonth = (delta: number) => setCursor(new Date(year, month + delta, 1));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
      {/* ── Calendario ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-[1.75rem] p-6 md:p-8 shadow-[0_10px_30px_-15px_rgba(0,26,51,0.25)]">
        {/* En mobile va más compacto para que el título no salte a dos renglones al aparecer "Hoy" */}
        <div className="flex items-center justify-between gap-1.5 mb-6">
          <h3 className="font-headline font-extrabold text-[#001A33] text-base sm:text-lg capitalize">
            {MONTH_NAMES[month]} {year}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isCurrentMonth && (
              <button
                type="button"
                aria-label="Volver al mes actual"
                onClick={() => goToMonthOf(today)}
                className="h-8 px-2 sm:px-3 rounded-full text-[10px] sm:text-[11px] font-headline font-bold uppercase tracking-[0.08em] text-[#5273C2] border border-[#5273C2]/30 hover:bg-[#5273C2] hover:text-white hover:border-[#5273C2] transition-colors duration-200"
              >
                Hoy
              </button>
            )}
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
            if (day === null) return <div key={i} className="aspect-square" />;

            const date = new Date(year, month, day);
            const dayEvents = eventsOnDay(day);
            const main = dayEvents[0];
            const isToday = sameDay(date, today);
            const isPast = date.getTime() < today.getTime();

            const style: CSSProperties = main
              ? { background: `${main.color}18`, color: main.color, fontWeight: 700 }
              : isToday
              ? { color: '#001A33', fontWeight: 600 }
              : { color: isPast ? '#94A3B8' : '#475569' };
            if (isToday) style.boxShadow = 'inset 0 0 0 1.5px #5273C2';

            return (
              <div key={i} className="aspect-square flex items-center justify-center">
                <div
                  className={`w-full h-full rounded-xl flex flex-col items-center justify-center gap-0.5 text-[13px] font-body transition-colors duration-200 ${
                    main && isPast ? 'opacity-45' : ''
                  }`}
                  style={style}
                  title={dayEvents.length > 0 ? dayEvents.map((e) => e.title).join(' · ') : undefined}
                >
                  {day}
                  {dayEvents.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ background: e.color }} />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Eventos del mes en vista ───────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-[#5273C2]">
            Eventos de {monthName}
          </span>
          {monthEvents.length > 0 && (
            <span className="text-[11px] text-[#94A3B8] font-body">
              {monthEvents.length} {monthEvents.length === 1 ? 'evento' : 'eventos'}
            </span>
          )}
        </div>

        {monthEvents.length === 0 ? (
          <div className="rounded-2xl bg-white/60 border border-dashed border-[#001A33]/15 px-6 py-10 text-center">
            <p className="text-sm text-[#64748B] font-body">No hay eventos cargados para {monthName}.</p>
            {nextEvent && (
              <button
                type="button"
                onClick={() => goToMonthOf(nextEvent.date)}
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-headline font-bold uppercase tracking-[0.08em] text-[#5273C2] hover:text-[#435E9F] transition-colors duration-200"
              >
                Ver {MONTH_NAMES[nextEvent.date.getMonth()].toLowerCase()}
                {nextEvent.date.getFullYear() !== year && ` ${nextEvent.date.getFullYear()}`}
                <CaretRightIcon size={12} weight="bold" />
              </button>
            )}
          </div>
        ) : (
          monthEvents.map((e) => <EventRow key={e.id} event={e} today={today} />)
        )}

        <div className="flex items-center gap-2 mt-2 px-1 text-[11px] text-[#94A3B8] font-body">
          <CalendarBlankIcon size={14} weight="duotone" />
          Agenda sujeta a cambios — seguí actualizada la red para nuevas fechas.
        </div>
      </div>
    </div>
  );
}

function EventRow({ event: e, today }: { event: EventItem; today: Date }) {
  const isPast = e.date.getTime() < today.getTime();
  const isToday = sameDay(e.date, today);

  return (
    <div
      className={`flex gap-4 items-center bg-white rounded-2xl p-4 shadow-[0_6px_16px_-10px_rgba(0,26,51,0.2)] border ${
        isPast ? 'opacity-60' : ''
      }`}
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
        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
          <span
            className="inline-block text-[9px] font-headline font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
            style={{ background: `${e.color}15`, color: e.color }}
          >
            {e.programa}
          </span>
          {isToday && (
            <span className="text-[9px] font-headline font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-[#001A33] text-white">
              Hoy
            </span>
          )}
          {isPast && (
            <span className="text-[9px] font-headline font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">
              Finalizado
            </span>
          )}
        </div>
        <h4 className="font-headline font-extrabold text-[#001A33] text-[15px] leading-snug truncate">{e.title}</h4>
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

      {/* Ya no tiene sentido anotarse a un evento que pasó */}
      {e.formUrl && !isPast && (
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
  );
}

/** Lugar reservado mientras se calcula la fecha y llegan los eventos de la API. */
function AgendaSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="mb-10 h-[340px] md:h-[440px] rounded-[1.75rem] bg-white/50" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
        <div className="aspect-square rounded-[1.75rem] bg-white/70" />
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[88px] rounded-2xl bg-white/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
