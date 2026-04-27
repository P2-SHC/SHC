/**
 * WeatherBackground.jsx
 * Drop into: src/components/WeatherBackground.jsx
 *
 * Usage:
 *   import WeatherBackground from './WeatherBackground';
 *   <WeatherBackground weatherCode={weatherData.weather[0].icon} />
 *
 * weatherCode: OWM icon string e.g. "01d", "02n", "09d", "10d", "11d", "13d", "50d"
 * The component strips the trailing d/n and routes to the correct scene.
 *
 * Recommended placement:
 *   position: relative on parent, then WeatherBackground fills it via position:absolute inset:0
 *   Content goes above with position:relative z-index:1
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/* ─── Helpers ─────────────────────────────────────────────── */

function useCanvas(draw, deps = []) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let animId;
    const loop = () => { draw(ctx, canvas.width, canvas.height); animId = requestAnimationFrame(loop); };
    animId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return canvasRef;
}

function useMouse() {
  const [pos, setPos] = useState({ x: 0.72, y: 0.18 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return pos;
}

function makeClouds(count, dark = false) {
  return Array.from({ length: count }, (_, i) => ({
    x: `${(i / count) * 110 - 10}%`,
    y: `${5 + Math.random() * 40}%`,
    w: 180 + Math.random() * 200,
    h: 80 + Math.random() * 60,
    color: dark
      ? `rgba(${160 + Math.floor(Math.random() * 30)},${160 + Math.floor(Math.random() * 30)},${160 + Math.floor(Math.random() * 30)},0.9)`
      : `rgba(255,255,255,${0.82 + Math.random() * 0.15})`,
    opacity: 0.75 + Math.random() * 0.25,
    speed: -(0.04 + Math.random() * 0.12) * (i % 2 === 0 ? 1 : 0.6),
    blur: 2 + Math.random() * 3,
    z: i % 3,
  }));
}

/* ─── Sub-components ──────────────────────────────────────── */

const BASE = {
  position: 'absolute', inset: 0, overflow: 'hidden',
  width: '100%', height: '100%',
};

/* Cloud shape (CSS, no SVG) */
function CloudLayer({ clouds, scrollY = 0 }) {
  return (
    <>
      {clouds.map((c, i) => (
        <div key={i} style={{
          position: 'absolute', left: c.x, top: c.y,
          transform: `translateX(${scrollY * c.speed}px)`,
          opacity: c.opacity, zIndex: c.z,
        }}>
          <div style={{
            position: 'relative', width: c.w, height: c.h * 0.45,
            background: c.color, borderRadius: c.h,
            filter: `blur(${c.blur}px)`,
          }}>
            <div style={{ position: 'absolute', width: c.w * 0.55, height: c.w * 0.55, borderRadius: '50%', background: c.color, top: `-${c.w * 0.25}px`, left: `${c.w * 0.15}px` }} />
            <div style={{ position: 'absolute', width: c.w * 0.4, height: c.w * 0.4, borderRadius: '50%', background: c.color, top: `-${c.w * 0.18}px`, left: `${c.w * 0.45}px` }} />
          </div>
        </div>
      ))}
    </>
  );
}

/* Rain canvas — shared by LightRain and HeavyRain */
function RainCanvas({ dropCount, speedMult, opacityMult, layerCount = 1, angleOffset = -0.22 }) {
  const dropsRef = useRef([]);

  const init = useCallback((w, h) => {
    dropsRef.current = Array.from({ length: dropCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: 14 + Math.random() * 24,
      speed: (6 + Math.random() * 8) * speedMult,
      opacity: (0.15 + Math.random() * 0.5) * opacityMult,
      layer: Math.floor(Math.random() * layerCount),
    }));
  }, [dropCount, speedMult, opacityMult, layerCount]);

  const canvasRef = useCanvas((ctx, w, h) => {
    if (dropsRef.current.length === 0) init(w, h);
    ctx.clearRect(0, 0, w, h);
    dropsRef.current.forEach(d => {
      const lm = layerCount > 1 ? (d.layer === 0 ? 0.6 : 1.2) : 1;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(174,214,241,${d.opacity})`;
      ctx.lineWidth = d.layer === 0 ? 1 : 1.5;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + angleOffset * d.len * lm, d.y + d.len * lm);
      ctx.stroke();
      d.y += d.speed * lm;
      d.x += angleOffset * d.speed * lm;
      if (d.y > h + d.len) { d.y = -d.len; d.x = Math.random() * w; }
    });
  }, [dropCount, speedMult, opacityMult, layerCount]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />;
}

/* ─── Weather scenes ──────────────────────────────────────── */

function ClearSky() {
  const mouse = useMouse();
  const SUN_X = 72, SUN_Y = 16;
  const dx = mouse.x * 100 - SUN_X;
  const dy = mouse.y * 100 - SUN_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const flareOpacity = Math.max(0, 1 - dist / 60) * 0.85;

  const rays = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    len: 80 + (i % 3) * 40,
    width: i % 2 === 0 ? 2 : 1,
  })), []);

  return (
    <div style={{ ...BASE, background: 'linear-gradient(175deg, #1565c0 0%, #1e88e5 18%, #42a5f5 40%, #90caf9 65%, #fce5b0 85%, #f9c06c 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255,255,200,0.12) 0%, transparent 70%)' }} />
      <svg style={{ position: 'absolute', left: `${SUN_X}%`, top: `${SUN_Y}%`, transform: 'translate(-50%,-50%)', overflow: 'visible', width: 1, height: 1, pointerEvents: 'none' }}>
        {rays.map((r, i) => {
          const rad = (r.angle * Math.PI) / 180;
          return <line key={i} x1={0} y1={0} x2={Math.cos(rad) * (r.len + 20)} y2={Math.sin(rad) * (r.len + 20)} stroke={`rgba(255,220,80,${0.25 - i * 0.01})`} strokeWidth={r.width} strokeLinecap="round" />;
        })}
      </svg>
      <div style={{
        position: 'absolute', left: `${SUN_X}%`, top: `${SUN_Y}%`,
        width: 110, height: 110, borderRadius: '50%',
        background: 'radial-gradient(circle, #fffde7 25%, #ffe57f 60%, #ffb300 100%)',
        transform: 'translate(-50%,-50%)',
        boxShadow: '0 0 60px 30px rgba(255,210,60,0.45), 0 0 120px 60px rgba(255,165,0,0.2)',
      }} />
      {[0.3, 0.5, 0.72, 1.1].map((t, i) => {
        const sizes = [14, 22, 10, 18];
        return (
          <div key={i} style={{
            position: 'absolute', left: `${SUN_X + dx * t}%`, top: `${SUN_Y + dy * t}%`,
            width: sizes[i], height: sizes[i] * (i % 2 === 0 ? 1 : 0.4), borderRadius: '50%',
            background: `rgba(255,240,180,${flareOpacity * (0.9 - i * 0.15)})`,
            transform: 'translate(-50%,-50%)', pointerEvents: 'none',
            transition: 'left 0.04s, top 0.04s',
          }} />
        );
      })}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, rgba(249,192,108,0.35) 0%, transparent 100%)' }} />
    </div>
  );
}

function CloudySky({ code }) {
  const [scrollY, setScrollY] = useState(0);
  const numMap = { '02': 3, '03': 7, '04': 13 };
  const count = numMap[code] || 3;
  const clouds = useMemo(() => makeClouds(count, code === '04'), [code]);
  const skies = {
    '02': 'linear-gradient(180deg, #3d85c4 0%, #64a9d8 40%, #9ecce8 70%, #d4ecf7 100%)',
    '03': 'linear-gradient(180deg, #4a7da0 0%, #6f9db8 40%, #a0c4d8 70%, #cfe0ec 100%)',
    '04': 'linear-gradient(180deg, #6a7a88 0%, #8fa0ae 40%, #b4c5cf 70%, #d5e0e8 100%)',
  };
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div style={{ ...BASE, background: skies[code] || skies['02'] }}>
      <CloudLayer clouds={clouds} scrollY={scrollY} />
    </div>
  );
}

function LightRain() {
  const clouds = useMemo(() => makeClouds(5, true), []);
  return (
    <div style={{ ...BASE, background: 'linear-gradient(180deg, #6a7e8e 0%, #8fa3b0 40%, #b8ccd6 70%, #d5e3eb 100%)' }}>
      <CloudLayer clouds={clouds} scrollY={0} />
      <RainCanvas dropCount={100} speedMult={0.7} opacityMult={0.65} layerCount={1} angleOffset={-0.18} />
    </div>
  );
}

function HeavyRain() {
  const clouds = useMemo(() => makeClouds(10, true), []);
  return (
    <div style={{ ...BASE, background: 'linear-gradient(180deg, #2e3d4a 0%, #405060 40%, #5a7080 70%, #7a9098 100%)' }}>
      <CloudLayer clouds={clouds} scrollY={0} />
      <RainCanvas dropCount={320} speedMult={1.4} opacityMult={0.9} layerCount={2} angleOffset={-0.28} />
    </div>
  );
}

function Thunderstorm() {
  const [flash, setFlash] = useState(false);
  const [flashBright, setFlashBright] = useState(false);
  const clouds = useMemo(() => makeClouds(14, true).map(c => ({ ...c, color: 'rgba(40,45,50,0.92)' })), []);

  useEffect(() => {
    let t;
    const schedule = () => {
      t = setTimeout(() => {
        setFlash(true);
        setTimeout(() => setFlashBright(true), 40);
        setTimeout(() => setFlashBright(false), 90);
        setTimeout(() => setFlash(true), 130);
        setTimeout(() => setFlash(false), 200);
        schedule();
      }, 1200 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ ...BASE, background: 'linear-gradient(180deg, #0a0c12 0%, #141824 40%, #1e2535 70%, #2a3040 100%)' }}>
      <CloudLayer clouds={clouds} scrollY={0} />
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }} viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,200 L0,120 Q200,60 360,100 Q500,130 600,80 Q720,30 900,90 Q1080,140 1200,70 Q1320,20 1440,80 L1440,200 Z" fill="rgba(5,7,12,0.95)" />
      </svg>
      <RainCanvas dropCount={280} speedMult={1.6} opacityMult={0.7} layerCount={2} angleOffset={-0.32} />
      {flash && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50, background: flashBright ? 'rgba(220,230,255,0.55)' : 'rgba(180,200,255,0.18)', transition: 'background 0.04s' }} />
      )}
      {flash && (
        <svg style={{ position: 'absolute', left: '42%', top: '5%', width: 60, height: 200, opacity: flashBright ? 1 : 0.5, filter: 'drop-shadow(0 0 12px rgba(200,220,255,0.9))' }} viewBox="0 0 60 200">
          <polyline points="38,0 18,90 36,90 12,200" fill="none" stroke="rgba(220,235,255,0.95)" strokeWidth="3" strokeLinejoin="round" />
          <polyline points="38,0 18,90 36,90 12,200" fill="none" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* 레이어별 독립 캔버스 — CSS blur를 캔버스 요소에 한 번만 적용 */
function SnowLayer({ count, scale, opacity, cssBlur }) {
  const flakesRef = useRef([]);

  const canvasRef = useCanvas((ctx, w, h) => {
    if (flakesRef.current.length === 0) {
      flakesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (1.5 + Math.random() * 5) * scale,
        speed: (0.6 + Math.random() * 1.4) * scale,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.003 + Math.random() * 0.008,
        opacity: (0.4 + Math.random() * 0.6) * opacity,
      }));
    }
    ctx.clearRect(0, 0, w, h);
    // ctx.filter 없이 모든 눈송이를 한 번에 렌더링
    flakesRef.current.forEach(f => {
      f.drift += f.driftSpeed;
      f.x += Math.sin(f.drift) * 0.5;
      f.y += f.speed;
      if (f.y > h + f.r) { f.y = -f.r; f.x = Math.random() * w; }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      ctx.fill();
    });
  }, [count, scale, opacity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        // blur를 캔버스 요소 자체에 CSS로 적용 → GPU 가속, 레이어당 1회
        filter: cssBlur,
        willChange: 'transform',
      }}
    />
  );
}

function Snow() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(180deg, #8fa8c0 0%, #b0c8d8 35%, #cddee8 65%, #e5eff5 100%)' }}>
      <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }} viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0,180 L0,140 Q300,80 500,120 Q700,155 900,100 Q1100,50 1200,110 Q1320,145 1440,100 L1440,180 Z" fill="rgba(220,232,240,0.7)" />
        <path d="M0,180 L0,160 Q200,130 400,150 Q600,168 800,140 Q1000,115 1200,145 Q1340,162 1440,140 L1440,180 Z" fill="rgba(240,248,252,0.9)" />
      </svg>
      {/* 원거리 레이어 — 작고 흐리게 */}
      <SnowLayer count={40} scale={0.5} opacity={0.6} cssBlur="blur(3px)" />
      {/* 중거리 레이어 — 중간 크기 */}
      <SnowLayer count={60} scale={1.0} opacity={0.8} cssBlur="blur(1.5px)" />
      {/* 근거리 레이어 — 크고 선명하게 */}
      <SnowLayer count={60} scale={1.5} opacity={1.0} cssBlur="none" />
    </div>
  );
}

function Fog() {
  return (
    <div style={{ ...BASE, background: 'linear-gradient(180deg, #7a7a7e 0%, #9a9a9e 25%, #b8b8bc 55%, #d4d4d8 80%, #e8e8ec 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(220,220,225,0.5) 0%, rgba(200,200,206,0.7) 40%, rgba(215,215,220,0.6) 70%, rgba(230,230,235,0.5) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 60% at 50% 40%, rgba(225,225,230,0.55) 0%, transparent 70%)' }} />
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────── */

/**
 * @param {string|number} weatherCode - OWM icon code e.g. "01d", "02n", or bare "01","10"
 */
export default function WeatherBackground({ weatherCode }) {
  // Normalise: strip trailing 'd'/'n', pad to 2 digits
  const code = String(weatherCode).replace(/[dn]$/i, '').padStart(2, '0');

  const scene = (() => {
    if (code === '01') return <ClearSky />;
    if (code === '02' || code === '03' || code === '04') return <CloudySky code={code} />;
    if (code === '09') return <LightRain />;
    if (code === '10') return <HeavyRain />;
    if (code === '11') return <Thunderstorm />;
    if (code === '13') return <Snow />;
    if (code === '50') return <Fog />;
    return <div style={{ ...BASE, background: '#87c3e8' }} />;
  })();

  return (
    // position: fixed — 스크롤해도 브라우저가 GPU 레이어로 고정 처리, 리페인트 없음
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {scene}
    </div>
  );
}
