"use client";

import { useState, useEffect, useRef } from "react";

// ─── Keyframes ─────────────────────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes spinCW  { to { transform: rotate(360deg);  } }
  @keyframes spinCCW { to { transform: rotate(-360deg); } }

  @keyframes iccShimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes loaderReveal {
    from { opacity: 0; transform: scale(0.84); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes expandCircle {
    0%   { transform: translate(-50%, -50%) scale(0);   opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(160); opacity: 1; }
  }
  @keyframes floatDot {
    0%   { opacity: 0; transform: translateY(0)      translateX(0);                  }
    15%  { opacity: 0.35;                                                            }
    85%  { opacity: 0.35;                                                            }
    100% { opacity: 0; transform: translateY(-110px) translateX(var(--drift, 16px)); }
  }
  @keyframes dotWave {
    0%, 60%, 100% { transform: scale(0.55); opacity: 0.3;  }
    30%           { transform: scale(1.4);  opacity: 0.85; }
  }
`;

// ─── Particles ─────────────────────────────────────────────────────────────────
const PARTICLES: { x: string; y: string; s: number; d: number; dur: number; drift: string }[] = [
  { x: "10%", y: "72%", s: 2,   d: 0,   dur: 7,   drift: "16px"  },
  { x: "30%", y: "80%", s: 2.5, d: 1.3, dur: 8,   drift: "-18px" },
  { x: "66%", y: "76%", s: 2,   d: 0.7, dur: 6.5, drift: "20px"  },
  { x: "84%", y: "58%", s: 2.5, d: 2.0, dur: 7.5, drift: "-14px" },
  { x: "76%", y: "24%", s: 2,   d: 1.6, dur: 8.5, drift: "12px"  },
  { x: "20%", y: "30%", s: 2,   d: 0.9, dur: 7,   drift: "-20px" },
];

const ringMask = (px: number) =>
  `radial-gradient(farthest-side, transparent calc(100% - ${px + 0.5}px), white calc(100% - ${px}px))`;

const ARC_R   = 100;
const ARC_CIR = 2 * Math.PI * ARC_R;

// ─── Component ─────────────────────────────────────────────────────────────────
export function IntroLoader() {
  const [mounted,         setMounted]         = useState(true);
  const [fading,          setFading]          = useState(false);
  const [circleExpanding, setCircleExpanding] = useState(false);
  const [progress,        setProgress]        = useState(0);
  const [opacity,         setOpacity]         = useState(1);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll lock
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [mounted]);

  // Interactive Space-Bend Canvas Engine
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();

    let mx = w / 2;
    let my = h / 2;
    let targetMx = mx;
    let targetMy = my;

    const handleMouseMove = (e: MouseEvent) => {
      targetMx = e.clientX;
      targetMy = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMx = e.touches[0].clientX;
        targetMy = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    let animId: number;
    const spacing = 38; 
    const maxDist = 380; 

    const draw = () => {
      mx += (targetMx - mx) * 0.12;
      my += (targetMy - my) * 0.12;

      ctx.clearRect(0, 0, w, h);

      for (let x = 0; x <= w; x += spacing) {
        for (let y = 0; y <= h; y += spacing) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let renderX = x;
          let renderY = y;
          let radius = 1.5;

          // Base grey: rgba(160, 160, 160, 0.25)
          let r = 160, g = 160, b = 160, a = 0.25;

          if (dist < maxDist) {
            const force = Math.pow((maxDist - dist) / maxDist, 1.5);

            renderX -= (dx / dist) * force * 55;
            renderY -= (dy / dist) * force * 55;

            radius = 1.5 * (1 - force * 0.5);

            const colorForce = Math.min(1, force * 1.2);

            r = 160 - (160 - 15) * colorForce;
            g = 160 - (160 - 66) * colorForce;
            b = 160 - (160 - 185) * colorForce; 
            
            a = 0.25 + (0.85 - 0.25) * colorForce;
          }

          ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;

          ctx.beginPath();
          ctx.arc(renderX, renderY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  // Progress ticker
  useEffect(() => {
    let cur = 0;
    const t0 = Date.now();
    const id = setInterval(() => {
      const dt = Date.now() - t0;
      if      (cur < 35) cur += Math.floor(Math.random() * 8) + 2;
      else if (cur < 75) cur += Math.floor(Math.random() * 4);
      else               cur += Math.floor(Math.random() * 6) + 1;
      if (dt < 2300 && cur > 95) cur = 95;
      if (document.readyState !== "complete" && cur > 99) cur = 99;
      if (cur >= 100) { cur = 100; clearInterval(id); }
      setProgress(cur);
    }, 80);
    return () => clearInterval(id);
  }, []);

  // Exit sequence
  useEffect(() => {
    if (progress !== 100) return;
    const t1 = setTimeout(() => setCircleExpanding(true),            300);
    const t2 = setTimeout(() => { setFading(true); setOpacity(0); }, 2000);
    const t3 = setTimeout(() => setMounted(false),                   3000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [progress]);

  if (!mounted) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        id="intro-loader"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 45%, #FFFFFF 0%, #F7FBFF 55%, #EFF5FF 100%)",
          overflow: "hidden",
          opacity,
          transition: fading ? "opacity 0.4s ease-in-out" : "none",
          pointerEvents: fading ? "none" : "auto",
          userSelect: "none", WebkitUserSelect: "none",
        }}
      >

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            width: "100%",
            height: "100%"
          }}
        />

        {/* Floating particles — subtle, barely there */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute", left: p.x, top: p.y,
              width: p.s, height: p.s, borderRadius: "50%",
              background: "rgba(15,66,169,0.22)",
              animation: `floatDot ${p.dur}s ease-in-out ${p.d}s infinite`,
              pointerEvents: "none", zIndex: 2,
              ["--drift" as string]: p.drift,
            } as React.CSSProperties}
          />
        ))}

        {/* BUG FIX START - Re-centered the blur directly in the middle, increased height, and bumped the mask/blur radius to reach fully over the top of the logo */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", 
          width: "450px",
          height: "550px", 
          background: "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 55%, transparent 75%)",
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 68%)",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 68%)",
          borderRadius: "50%",
          zIndex: 5,
          pointerEvents: "none",
        }} />
        {/* BUG FIX END */}

        {/* EXIT — black circle, then white, both expand from center */}
        {circleExpanding && (
          <>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "#000", zIndex: 99998, pointerEvents: "none",
              animation: "expandCircle 2.2s both cubic-bezier(0.65,0,0.35,1)",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "#fff", zIndex: 99999, pointerEvents: "none",
              animation: "expandCircle 2.2s both cubic-bezier(0.65,0,0.35,1) 0.4s",
            }} />
          </>
        )}

        {/* ── LOGO + RINGS ──────────────────────────────────────────────────── */}
        <div style={{
          position: "relative", width: 210, height: 210,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "loaderReveal 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s both",
          zIndex: 10,
        }}>

          {/* SVG progress arc */}
          <svg
            viewBox="0 0 210 210"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              transform: "rotate(-90deg)", overflow: "visible",
              pointerEvents: "none",
            }}
          >
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#0F42A9" />
                <stop offset="100%" stopColor="#6b8cce" />
              </linearGradient>
            </defs>
            <circle cx="105" cy="105" r={ARC_R}
              fill="none" stroke="rgba(15,66,169,0.08)" strokeWidth="1.5" />
            <circle cx="105" cy="105" r={ARC_R}
              fill="none" stroke="url(#arcGrad)"
              strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={ARC_CIR}
              strokeDashoffset={ARC_CIR * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 0.12s ease-out" }}
            />
          </svg>

          {/* Outer base ring */}
          <div style={{
            position: "absolute", inset: 16, borderRadius: "50%",
            border: "1px solid rgba(15,66,169,0.08)",
          }} />

          {/* CW comet */}
          <div style={{
            position: "absolute", inset: 16, borderRadius: "50%",
            background: `conic-gradient(from 0deg,
              rgba(15,66,169,0)   0%,
              rgba(15,66,169,0.7) 26%,
              rgba(36,59,105,1)   48%,
              rgba(15,66,169,0.7) 70%,
              rgba(15,66,169,0)   100%)`,
            animation: "spinCW 2.8s linear infinite",
            WebkitMask: ringMask(2), mask: ringMask(2),
            willChange: "transform",
          }} />

          {/* Inner base ring */}
          <div style={{
            position: "absolute", inset: 46, borderRadius: "50%",
            border: "1px solid rgba(15,66,169,0.06)",
          }} />

          {/* CCW counter-spinner */}
          <div style={{
            position: "absolute", inset: 46, borderRadius: "50%",
            background: `conic-gradient(from 90deg,
              rgba(36,59,105,0)    0%,
              rgba(36,59,105,0.45) 25%,
              rgba(36,59,105,0)    50%)`,
            animation: "spinCCW 1.9s linear infinite",
            WebkitMask: ringMask(1), mask: ringMask(1),
            willChange: "transform",
          }} />

          {/* ICC shimmer */}
          <div style={{
            position: "relative", zIndex: 10,
            filter: "drop-shadow(0 0 20px rgba(15,66,169,0.4))",
          }}>
            <span style={{
              display: "block",
              fontSize: "2.9rem", fontWeight: 700, letterSpacing: "0.26em",
              fontFamily: "Georgia, 'Times New Roman', serif",
              backgroundImage: "linear-gradient(108deg, #243B69 0%, #0F42A9 13%, #6b8cce 37%, #243B69 50%, #6b8cce 63%, #0F42A9 87%, #243B69 100%)",
              backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "iccShimmer 3s linear infinite",
            }}>
              ICC
            </span>
          </div>
        </div>

        {/* ── LOADING INDICATOR ─────────────────────────────────────────────── */}
        <div style={{
          marginTop: 44,
          display: "flex", gap: 9,
          alignItems: "center",
          animation: "fadeUp 1s ease-out 0.8s both",
          position: "relative", zIndex: 10,
        }}>
          {[0, 1, 2, 3].map(i => {
            const done = progress >= (i + 1) * 25;
            return (
              <div
                key={i}
                style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: done ? "rgba(15,66,169,0.75)" : "rgba(15,66,169,0.28)",
                  boxShadow: done ? "0 0 8px rgba(15,66,169,0.4)" : "none",
                  animation: done ? "none" : `dotWave 1.6s ease-in-out ${i * 0.2}s infinite`,
                  transition: "background 0.3s ease, box-shadow 0.3s ease",
                }}
              />
            );
          })}
        </div>

      </div>
    </>
  );
}