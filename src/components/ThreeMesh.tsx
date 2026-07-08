'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Estado global (bypasea z-index del DOM) ───────────────────────────────────
const _mouse    = new THREE.Vector2(0, 0);
let   _hovering = 0;

// ── Colores palette (optimizados para fondo claro) ───────────────────────────
const FRONT_COLOR = new THREE.Color(0x3e5692); // celeste oscuro — cara al frente
const BACK_COLOR  = new THREE.Color(0x7dd3fc); // celeste claro — cara trasera

// ── Shaders geodésicos: depth-based (frente=oscuro/grande, atrás=claro/chico) ─
const NODE_VERT = /* glsl */`
  varying float vF;
  void main() {
    vec3 wNorm = normalize(mat3(modelMatrix) * normalize(position));
    vec3 wPos  = (modelMatrix * vec4(position, 1.0)).xyz;
    vF = clamp(dot(wNorm, normalize(cameraPosition - wPos)), 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (1.0 + vF * 3.5) * (14.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;
const NODE_FRAG = /* glsl */`
  uniform vec3 front;
  uniform vec3 back;
  varying float vF;
  void main() {
    if (length(gl_PointCoord - 0.5) > 0.5) discard;
    gl_FragColor = vec4(mix(back, front, vF), sin(vF * 3.14159) * 0.92);
  }
`;

const LINE_VERT = /* glsl */`
  varying float vF;
  void main() {
    vec3 wNorm = normalize(mat3(modelMatrix) * normalize(position));
    vec3 wPos  = (modelMatrix * vec4(position, 1.0)).xyz;
    vF = clamp(dot(wNorm, normalize(cameraPosition - wPos)), 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const LINE_FRAG = /* glsl */`
  uniform vec3 front;
  uniform vec3 back;
  varying float vF;
  void main() {
    gl_FragColor = vec4(mix(back, front, vF), sin(vF * 3.14159) * 0.78);
  }
`;

// ── Shaders imagen circular ───────────────────────────────────────────────────
const IMG_VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const IMG_FRAG = /* glsl */`
  uniform sampler2D map;
  uniform float opacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5);
    if (d > 0.5) discard;
    if (d > 0.455) { gl_FragColor = vec4(1.0,1.0,1.0,opacity); return; }
    vec4 t = texture2D(map, vUv);
    gl_FragColor = vec4(t.rgb, t.a * opacity);
  }
`;

const SHELL_R = 5.2;

// ── EventTracker: mouse NDC desde window (ignora z-index del DOM) ─────────────
function EventTracker() {
  const { gl } = useThree();
  useEffect(() => {
    const cv = gl.domElement;
    const fn = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect();
      _mouse.x =  ((e.clientX - r.left) / r.width)  * 2 - 1;
      _mouse.y = -((e.clientY - r.top)  / r.height) * 2 + 1;
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [gl]);
  return null;
}

// ── Nodo con imagen hover ─────────────────────────────────────────────────────
const HIT_RADIUS = 0.6; // radio de hover en unidades de mundo

function ImageNode({ pos, texture }: { pos: THREE.Vector3; texture: THREE.Texture }) {
  const gRef  = useRef<THREE.Group>(null!);
  const igRef = useRef<THREE.Group>(null!);
  const bgRef = useRef<THREE.MeshBasicMaterial>(null!);
  const imRef = useRef<THREE.ShaderMaterial>(null!);
  const wasH  = useRef(false);
  const anim  = useRef(0);
  const wp    = useMemo(() => new THREE.Vector3(), []);
  const ndc   = useMemo(() => new THREE.Vector3(), []);
  const uni   = useMemo(() => ({ map: { value: texture }, opacity: { value: 0 } }), [texture]);

  useFrame(({ camera, size }) => {
    if (!gRef.current) return;
    gRef.current.getWorldPosition(wp);
    gRef.current.lookAt(camera.position);

    // Hover por proyección a pantalla: comparar distancia mouse↔nodo en px
    // es mucho más barato que raycasting y no necesita mallas de colisión.
    ndc.copy(wp).project(camera);
    const dx = (ndc.x - _mouse.x) * size.width  * 0.5;
    const dy = (ndc.y - _mouse.y) * size.height * 0.5;
    const dist  = camera.position.distanceTo(wp);
    const fov   = (camera as THREE.PerspectiveCamera).fov;
    const pxR   = (HIT_RADIUS / (dist * Math.tan(THREE.MathUtils.degToRad(fov) * 0.5))) * size.height * 0.5;
    const hit   = ndc.z < 1 && dx * dx + dy * dy < pxR * pxR;

    if (hit && !wasH.current) { _hovering++; document.body.style.cursor = 'pointer'; }
    if (!hit && wasH.current) { _hovering = Math.max(0, _hovering - 1); if (!_hovering) document.body.style.cursor = 'auto'; }
    wasH.current = hit;

    anim.current = THREE.MathUtils.lerp(anim.current, hit ? 1 : 0, 0.1);
    const s = anim.current;
    if (igRef.current) igRef.current.scale.setScalar(s);
    if (bgRef.current) bgRef.current.opacity = s * 0.93;
    if (imRef.current) imRef.current.uniforms.opacity.value = s;
  });

  return (
    <group ref={gRef} position={[pos.x, pos.y, pos.z]}>
      {/* Punto indicador */}
      <mesh>
        <circleGeometry args={[0.12, 16]} />
        <meshBasicMaterial color={0x5273C2} transparent opacity={0.9} depthWrite={false} />
      </mesh>
      {/* Imagen con grow en hover */}
      <group ref={igRef}>
        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[0.62, 48]} />
          <meshBasicMaterial ref={bgRef} color="white" transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh>
          <planeGeometry args={[1.18, 1.18]} />
          <shaderMaterial ref={imRef} uniforms={uni} vertexShader={IMG_VERT} fragmentShader={IMG_FRAG} transparent depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

// ── Carga texturas + nodos imagen ─────────────────────────────────────────────
const IMAGE_PATHS = [
  '/img-nodos/ig1.png',
  '/img-nodos/ig2.png',
  '/img-nodos/ig3.png',
  '/img-nodos/ig4.png',
];

// ── Geometría geodésica compartida ────────────────────────────────────────────
// Nodos, aristas y posiciones de los nodos imagen salen del mismo icosaedro,
// computado una sola vez y en forma diferida (no bloquea la carga del módulo).
const NODE_COUNT = 12;
type GeoData = { nodePos: Float32Array; linePos: Float32Array; imgPos: THREE.Vector3[] };
let _geoCache: GeoData | null = null;

function getGeoData(): GeoData {
  if (_geoCache) return _geoCache;

  const geo     = new THREE.IcosahedronGeometry(SHELL_R, 3);
  const posAttr = geo.attributes.position;

  const vKey = (i: number) => {
    const x = posAttr.getX(i), y = posAttr.getY(i), z = posAttr.getZ(i);
    return `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
  };

  // Vértices únicos por posición
  const seen = new Map<string, THREE.Vector3>();
  for (let i = 0; i < posAttr.count; i++) {
    const k = vKey(i);
    if (!seen.has(k)) seen.set(k, new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
  }
  const verts   = [...seen.values()];
  const nodePos = new Float32Array(verts.flatMap(v => [v.x, v.y, v.z]));

  // Construir lista de índices de triángulos (indexed o non-indexed)
  const triIdx: number[] = geo.index
    ? [...geo.index.array]
    : Array.from({ length: posAttr.count }, (_, i) => i);

  // Aristas únicas por clave de posición (evita duplicados en geometría non-indexed)
  const edgeSet = new Set<string>();
  const linePts: number[] = [];
  for (let i = 0; i < triIdx.length; i += 3) {
    const a = triIdx[i], b = triIdx[i+1], c = triIdx[i+2];
    for (const [x, y] of [[a,b],[b,c],[a,c]] as [number,number][]) {
      const ka = vKey(x), kb = vKey(y);
      const k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      if (!edgeSet.has(k)) {
        edgeSet.add(k);
        linePts.push(
          posAttr.getX(x), posAttr.getY(x), posAttr.getZ(x),
          posAttr.getX(y), posAttr.getY(y), posAttr.getZ(y),
        );
      }
    }
  }
  geo.dispose();

  // Nodos imagen sobre vértices reales de la red, distribuidos uniformemente
  const step   = Math.floor(verts.length / NODE_COUNT);
  const imgPos = Array.from({ length: NODE_COUNT }, (_, i) => verts[i * step]);

  _geoCache = { nodePos, linePos: new Float32Array(linePts), imgPos };
  return _geoCache;
}

function ShellImageNodes() {
  const [textures, setTextures] = useState<THREE.Texture[]>([]);
  const { imgPos } = getGeoData();
  // Asignación aleatoria estable de imagen por nodo
  const imgIdx = useMemo(() => imgPos.map(() => Math.floor(Math.random() * IMAGE_PATHS.length)), [imgPos]);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    let alive = true;
    Promise.all(IMAGE_PATHS.map(
      url => new Promise<THREE.Texture>((res, rej) => loader.load(url, res, undefined, rej))
    )).then(txs => { if (alive) setTextures(txs); });
    return () => { alive = false; };
  }, []);
  if (textures.length < IMAGE_PATHS.length) return null;
  return (
    <>
      {imgPos.map((pos, i) => (
        <ImageNode key={i} pos={pos} texture={textures[imgIdx[i]]} />
      ))}
    </>
  );
}

// ── Esfera geodésica (icosfera tipo imagen de referencia) ─────────────────────
function GeodesicSphere() {
  const pRef = useRef<THREE.Points>(null!);
  const lRef = useRef<THREE.LineSegments>(null!);

  const { nodePos, linePos } = useMemo(getGeoData, []);

  const nodeUni = useMemo(() => ({ front: { value: FRONT_COLOR }, back: { value: BACK_COLOR } }), []);
  const lineUni = useMemo(() => ({ front: { value: FRONT_COLOR }, back: { value: BACK_COLOR } }), []);

  useFrame(({ clock }) => {
    const p = 1 + Math.sin(clock.elapsedTime * 0.8) * 0.007;
    if (pRef.current) pRef.current.scale.setScalar(p);
    if (lRef.current) lRef.current.scale.setScalar(p);
  });

  return (
    <>
      <points ref={pRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
        </bufferGeometry>
        <shaderMaterial uniforms={nodeUni} vertexShader={NODE_VERT} fragmentShader={NODE_FRAG} transparent depthWrite={false} />
      </points>

      <lineSegments ref={lRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <shaderMaterial uniforms={lineUni} vertexShader={LINE_VERT} fragmentShader={LINE_FRAG} transparent depthWrite={false} />
      </lineSegments>

      <ShellImageNodes />
    </>
  );
}

// ── Escena ────────────────────────────────────────────────────────────────────
const DIAGONAL_AXIS = new THREE.Vector3(0.4, 1, 0.25).normalize();

function Scene() {
  const geoRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (geoRef.current) geoRef.current.rotateOnWorldAxis(DIAGONAL_AXIS, 0.05 * delta);
  });

  return <group ref={geoRef}><GeodesicSphere /></group>;
}

// ── Export ────────────────────────────────────────────────────────────────────
export function ThreeMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Solo renderiza mientras la sección hero está en pantalla — al scrollear
  // más abajo, frenar el loop de render evita gastar GPU en algo invisible.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        style={{ background: 'transparent' }}
      >
        <EventTracker />
        <Scene />
      </Canvas>
    </div>
  );
}
