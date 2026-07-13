import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Oculta el ícono flotante de Next.js (indicador de dev) en npm run dev.
  devIndicators: false,
  // Exportación estática: genera HTML/CSS/JS puro en la carpeta out/
  // para subir a un hosting compartido (Hostinger) junto a la carpeta api/ (PHP).
  output: 'export',
  // Genera cada ruta como carpeta/index.html (ej. /login/index.html),
  // lo que Apache sirve sin configuración extra.
  trailingSlash: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // La optimización de imágenes de Next requiere un servidor Node; en export estático se desactiva.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
