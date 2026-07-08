'use client';

import { useState } from 'react';
import {
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  MapPinIcon,
  CalendarBlankIcon,
} from '@phosphor-icons/react';
import { NetworkBackground } from '@/components/NetworkBackground';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

type EventItem = {
  date: Date;
  title: string;
  programa: string;
  color: string;
  time: string;
  location: string;
};

// Eventos de ejemplo — reemplazar por la agenda real de la red
const events: EventItem[] = [
  {
    date: new Date(2026, 6, 11),
    title: 'Torneo de Iniciación Deportiva',
    programa: 'Pasitos',
    color: '#2EC4B6',
    time: '10:00 hs',
    location: 'Polideportivo Norte',
  },
  {
    date: new Date(2026, 6, 18),
    title: 'Jornada de Formación Dirigencial',
    programa: 'La Universidad en tu Club',
    color: '#5273C2',
    time: '18:00 hs',
    location: 'Sede Central',
  },
  {
    date: new Date(2026, 6, 25),
    title: 'Huerta Comunitaria',
    programa: 'Enraizando',
    color: '#22C55E',
    time: '9:30 hs',
    location: 'Plaza San Martín',
  },
  {
    date: new Date(2026, 7, 1),
    title: 'Jornada Recreativa',
    programa: 'Ruta de Sonrisas',
    color: '#F43F5E',
    time: '15:00 hs',
    location: 'Club Los Andes',
  },
  {
    date: new Date(2026, 7, 8),
    title: 'Inicio Clases de Apoyo · 2do cuatrimestre',
    programa: 'Hoja de Ruta',
    color: '#FF9F1C',
    time: '16:00 hs',
    location: 'Centro Comunitario',
  },
];

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
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const cells = buildMonthGrid(year, month);

  const eventsInView = events.filter((e) => e.date.getFullYear() === year && e.date.getMonth() === month);
  const eventForDay = (day: number) => eventsInView.find((e) => e.date.getDate() === day);

  const changeMonth = (delta: number) => {
    setCursor(new Date(year, month + delta, 1));
  };

  const upcoming = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

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
                key={e.title}
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
