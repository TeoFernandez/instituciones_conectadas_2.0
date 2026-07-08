'use client';

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2  u_res;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),              hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y
  );
}

#define SHARP 2.3
#define EPS   0.00025

vec3 mesh(vec2 uv, float t) {
  // Naranja — esquina inferior izquierda
  vec2 pOD = vec2(-0.10 + sin(t*0.30)*0.025, 1.10 + cos(t*0.25)*0.020);
  vec3 cOD = vec3(1.00, 0.45, 0.04);

  // Highlight crema dentro del orbe naranja
  vec2 pOH = vec2(0.22 + sin(t*0.35)*0.028, 0.52 + cos(t*0.30)*0.025);
  vec3 cOH = vec3(1.00, 0.94, 0.82);

  // Azul — lado derecho
  vec2 pBD = vec2(1.10 + sin(t*0.28)*0.025, 0.58 + cos(t*0.22)*0.035);
  vec3 cBD = vec3(0.12, 0.28, 0.90);

  // Highlight celeste dentro del orbe azul
  vec2 pBH = vec2(0.74 + sin(t*0.32)*0.025, 0.14 + cos(t*0.26)*0.025);
  vec3 cBH = vec3(0.68, 0.88, 1.00);

  // Blanco — centro (zona legible para el texto)
  vec2 pWH = vec2(0.44 + sin(t*0.18)*0.025, 0.44 + cos(t*0.20)*0.018);
  vec3 cWH = vec3(1.00, 1.00, 1.00);

  float wOD = 1.0 / pow(length(uv - pOD) + EPS, SHARP);
  float wOH = 1.0 / pow(length(uv - pOH) + EPS, SHARP);
  float wBD = 1.0 / pow(length(uv - pBD) + EPS, SHARP);
  float wBH = 1.0 / pow(length(uv - pBH) + EPS, SHARP);
  float wWH = 1.0 / pow(length(uv - pWH) + EPS, SHARP) * 1.8;

  float tw = wOD + wOH + wBD + wBH + wWH;
  return (cOD*wOD + cOH*wOH + cBD*wBD + cBH*wBH + cWH*wWH) / tw;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.y = 1.0 - uv.y;

  float t = u_time * 0.10;

  float n1 = noise(uv * 1.8 + t * 0.50);
  float n2 = noise(uv * 3.8 - t * 0.35 + vec2(3.7, 1.3));
  vec2 uvP = uv + (vec2(n1, n2) - 0.5) * 0.032;

  vec3 col = mesh(uvP, t);

  // Fade superior — protege visibilidad del nav
  float topFade = 1.0 - smoothstep(0.0, 0.22, uv.y);
  col = mix(col, vec3(0.97, 0.97, 0.98), topFade * 0.90);

  // Vignette sutil
  vec2 vc = uv * 2.0 - 1.0;
  col *= 1.0 - dot(vc, vc) * 0.07;

  // Grain
  col += (hash(uv + fract(t * 0.43)) - 0.5) * 0.018;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function mkShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader:', gl.getShaderInfoLog(s));
  return s;
}

function mkProgram(gl: WebGLRenderingContext): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER,   VERT));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.error('Program:', gl.getProgramInfoLog(p));
  return p;
}

export function HeroMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const prog = mkProgram(gl);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1, 1,
      -1, 1,  1,-1,  1, 1,
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');

    const resize = () => {
      // Tope de resolución: en pantallas retina/4K, el costo del shader
      // crece con el cuadrado del DPR — 1.5 ya se ve nítido y es mucho más liviano.
      const dpr  = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0  = performance.now();
    let   raf = 0;
    let   running = true;

    // El fondo solo se ve a través de la sección hero (las secciones
    // siguientes son opacas). Una vez scrolleado más allá, pausar el
    // render evita gastar GPU en algo que ya no es visible.
    const heroHeight = () => window.innerHeight * 1.15;
    const updateVisibility = () => {
      const shouldRun = document.visibilityState === 'visible' && window.scrollY < heroHeight();
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    const tick = () => {
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform2f(uRes,  canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', updateVisibility, { passive: true });
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', updateVisibility);
      document.removeEventListener('visibilitychange', updateVisibility);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
