// Base de la API PHP.
//   - En producción (sitio estático en Hostinger) usa "/api" — la carpeta api/
//     vive en la raíz del dominio junto al sitio.
//   - Para probar contra XAMPP durante `next dev`, definí en .env.local:
//       NEXT_PUBLIC_API_BASE=http://localhost/AWENTECH/institucionesconectadas/api
//     (¡acordate de quitarlo antes de hacer el build de producción!)
export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || '/api').replace(/\/$/, '');

export function apiUrl(path: string): string {
  return `${API_BASE}/${path.replace(/^\//, '')}`;
}
