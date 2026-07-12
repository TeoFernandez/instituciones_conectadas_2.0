export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export type EventItem = {
  id: string;
  date: Date;
  title: string;
  programa: string;
  color: string;
  time: string;
  location: string;
  image?: string;
  formUrl?: string;
};

type StoredEvent = Omit<EventItem, 'date'> & { date: string };

const STORAGE_KEY = 'ic_events_v1';
export const EVENTS_UPDATED_EVENT = 'ic-events-updated';

// Eventos de ejemplo — se usan como base la primera vez que se abre el sitio
export const defaultEvents: EventItem[] = [
  {
    id: 'evt-seed-1',
    date: new Date(2026, 6, 11),
    title: 'Torneo de Iniciación Deportiva',
    programa: 'Pasitos',
    color: '#2EC4B6',
    time: '10:00 hs',
    location: 'Polideportivo Norte',
  },
  {
    id: 'evt-seed-2',
    date: new Date(2026, 6, 18),
    title: 'Jornada de Formación Dirigencial',
    programa: 'La Universidad en tu Club',
    color: '#5273C2',
    time: '18:00 hs',
    location: 'Sede Central',
  },
  {
    id: 'evt-seed-3',
    date: new Date(2026, 6, 25),
    title: 'Huerta Comunitaria',
    programa: 'Enraizando',
    color: '#22C55E',
    time: '9:30 hs',
    location: 'Plaza San Martín',
    image: '/img-instituciones/enraizando.png',
  },
  {
    id: 'evt-seed-4',
    date: new Date(2026, 7, 1),
    title: 'Jornada Recreativa',
    programa: 'Ruta de Sonrisas',
    color: '#F43F5E',
    time: '15:00 hs',
    location: 'Club Los Andes',
    image: '/img-instituciones/sonrisas1.png',
  },
  {
    id: 'evt-seed-5',
    date: new Date(2026, 7, 8),
    title: 'Inicio Clases de Apoyo · 2do cuatrimestre',
    programa: 'Hoja de Ruta',
    color: '#FF9F1C',
    time: '16:00 hs',
    location: 'Centro Comunitario',
  },
];

function serialize(events: EventItem[]): StoredEvent[] {
  return events.map((e) => ({
    ...e,
    date: `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}-${String(e.date.getDate()).padStart(2, '0')}`,
  }));
}

function deserialize(stored: StoredEvent[]): EventItem[] {
  return stored.map((e) => {
    const [y, m, d] = e.date.split('-').map(Number);
    return { ...e, date: new Date(y, m - 1, d) };
  });
}

export function loadEvents(): EventItem[] {
  if (typeof window === 'undefined') return defaultEvents;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEvents;
    const parsed: StoredEvent[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultEvents;
    return deserialize(parsed);
  } catch {
    return defaultEvents;
  }
}

export function saveEvents(events: EventItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(events)));
  window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
}

export function createEventId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function dateToInputValue(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function inputValueToDate(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Convierte un link de "Compartir" de Google Drive (que sirve una página HTML,
// no la imagen) al formato que se puede usar directo en un <img src>.
export function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || !trimmed.includes('drive.google.com')) return trimmed;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  const id = fileMatch?.[1] ?? idMatch?.[1];

  return id ? `https://drive.google.com/uc?export=view&id=${id}` : trimmed;
}
