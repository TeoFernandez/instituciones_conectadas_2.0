import { apiUrl } from '@/lib/api';
import { getToken } from '@/lib/auth-store';

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

// Forma en la que viaja un evento por la API (fecha como string 'YYYY-MM-DD').
type ApiEvent = Omit<EventItem, 'date'> & { date: string };

// Datos que se envían al crear/editar (sin la fecha convertida a Date).
export type EventInput = {
  title: string;
  programa: string;
  color: string;
  date: string; // 'YYYY-MM-DD'
  time: string;
  location: string;
  image?: string;
  formUrl?: string;
};

export const EVENTS_UPDATED_EVENT = 'ic-events-updated';

// Eventos de ejemplo — se muestran como respaldo si la API no responde,
// para que el sitio nunca se vea vacío.
export const defaultEvents: EventItem[] = [
  {
    id: 'evt-seed-1',
    date: new Date(2026, 6, 11),
    title: 'Torneo de Iniciación Deportiva',
    programa: 'Mis Pasitos',
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
    image: '/img/enraizando.png',
  },
  {
    id: 'evt-seed-4',
    date: new Date(2026, 7, 1),
    title: 'Jornada Recreativa',
    programa: 'Ruta de Sonrisas',
    color: '#F43F5E',
    time: '15:00 hs',
    location: 'Club Los Andes',
    image: '/img/sonrisas1.png',
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

function fromApi(e: ApiEvent): EventItem {
  const [y, m, d] = e.date.split('-').map(Number);
  return {
    id: e.id,
    date: new Date(y, m - 1, d),
    title: e.title,
    programa: e.programa,
    color: e.color,
    time: e.time,
    location: e.location,
    image: e.image ?? undefined,
    formUrl: e.formUrl ?? undefined,
  };
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Trae la lista de eventos desde la API. Si falla, devuelve los de ejemplo. */
export async function fetchEvents(): Promise<EventItem[]> {
  try {
    const res = await fetch(apiUrl('events.php'), { cache: 'no-store' });
    const data = await res.json();
    if (res.ok && data.ok && Array.isArray(data.events)) {
      return (data.events as ApiEvent[]).map(fromApi);
    }
    return defaultEvents;
  } catch {
    return defaultEvents;
  }
}

/** Avisa a la página pública que los eventos cambiaron (para refrescar en vivo). */
function notifyUpdated(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENTS_UPDATED_EVENT));
  }
}

/** Crea un evento nuevo (requiere sesión). */
export async function createEvent(input: EventInput): Promise<EventItem> {
  const res = await fetch(apiUrl('events.php'), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo crear el evento.');
  notifyUpdated();
  return fromApi(data.event as ApiEvent);
}

/** Actualiza un evento existente (requiere sesión). */
export async function updateEvent(id: string, input: EventInput): Promise<EventItem> {
  const res = await fetch(apiUrl('events.php'), {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ id, ...input }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo actualizar el evento.');
  notifyUpdated();
  return fromApi(data.event as ApiEvent);
}

/** Sube una imagen desde la computadora del usuario (requiere sesión). Devuelve la URL lista para usar. */
export async function uploadImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(apiUrl('upload.php'), {
    method: 'POST',
    // OJO: sin Content-Type manual — el navegador arma el boundary de multipart solo.
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo subir la imagen.');
  // La API devuelve una ruta relativa a la carpeta api/ (ej. "uploads/evt-x.jpg").
  return apiUrl(data.url as string);
}

/** Elimina un evento (requiere sesión). */
export async function deleteEvent(id: string): Promise<void> {
  const res = await fetch(apiUrl(`events.php?id=${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo eliminar el evento.');
  notifyUpdated();
}

// ── Helpers de fecha (sin cambios) ──────────────────────────────────────────

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
