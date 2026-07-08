'use client';

import dynamic from 'next/dynamic';

// Carga diferida del canvas 3D: saca three.js y react-three-fiber del bundle
// inicial de la página. El texto del hero pinta de inmediato y la animación
// aparece apenas termina de bajar su chunk.
export const ThreeMesh = dynamic(
  () => import('./ThreeMesh').then(m => m.ThreeMesh),
  { ssr: false }
);
