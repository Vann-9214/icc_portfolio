"use client";

import { useState, useEffect } from "react";

// ─── keyframes injected once at mount ────────────────────
const KEYFRAMES = `
  @keyframes spinCW  { to { transform: rotate(360deg);  } }
  @keyframes spinCCW { to { transform: rotate(-360deg); } }

  @keyframes tiltedRing {
    from { transform: rotateX(68deg) rotateZ(0deg);   }
    to   { transform: rotateX(68deg) rotateZ(360deg); }
  }
  @keyframes iccShimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes ambientPulse {
    0%, 100% { opacity: 0.2; transform: scale(0.88); }
    50%       { opacity: 0.65; transform: scale(1.08); }
  }
  @keyframes dotWave {
    0%, 60%, 100% { transform: scale(0.5); opacity: 0.2; }
    30%            { transform: scale(1.4); opacity: 1;   }
  }
  @keyframes loaderReveal {
    from { opacity: 0; transform: scale(0.78); filter: blur(12px); }
    to   { opacity: 1; transform: scale(1);    filter: blur(0);    }
  }
  @keyframes expandCircle {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(150); opacity: 1; }
  }

  /* ── NEW: Radar / sonar BG effects ── */
  @keyframes radarRing {
    0%   { transform: translate(-50%, -50%) scale(0.06); opacity: 0;   }
    8%   { opacity: 0.85; }
    100% { transform: translate(-50%, -50%) scale(18);   opacity: 0;   }
  }
  @keyframes radarSweep {
    from { transform: translate(-50%, -50%) rotate(0deg);   }
    to   { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes floatUp {
    0%   { opacity: 0; transform: translateY(0px) translateX(0px); }
    18%  { opacity: 1; }
    82%  { opacity: 1; }
    100% { opacity: 0; transform: translateY(-160px) translateX(var(--p-drift, 20px)); }
  }
  @keyframes auroraBlob {
    0%, 100% { transform: translate(0px,   0px)  scale(1);    }
    33%       { transform: translate(50px, -40px) scale(1.13); }
    66%       { transform: translate(-30px, 28px) scale(0.91); }
  }
  @keyframes gridPulse {
    0%, 100% { opacity: 0.09; }
    50%       { opacity: 0.20; }
  }
  @keyframes crosshairPulse {
    0%, 100% { opacity: 0.06; }
    50%       { opacity: 0.13; }
  }
`;

// Floating particle data — precomputed so no flicker on re-render
const PARTICLES: Array<{ x: string; y: string; s: number; d: number; dur: number; drift: number }> = [
  { x: "7%",  y: "68%", s: 2.5, d: 0,   dur: 6,   drift:  22 },
  { x: "18%", y: "52%", s: 2,   d: 1.4, dur: 8.5, drift: -18 },
  { x: "33%", y: "78%", s: 3,   d: 0.7, dur: 7,   drift:  28 },
  { x: "52%", y: "82%", s: 2,   d: 2.3, dur: 9,   drift: -22 },
  { x: "68%", y: "75%", s: 2.5, d: 0.9, dur: 6.5, drift:  16 },
  { x: "83%", y: "62%", s: 2,   d: 2.8, dur: 7.5, drift: -24 },
  { x: "91%", y: "42%", s: 3,   d: 0.4, dur: 8,   drift:  12 },
  { x: "78%", y: "22%", s: 2,   d: 1.9, dur: 6,   drift: -28 },
  { x: "62%", y: "12%", s: 2.5, d: 1.1, dur: 9,   drift:  18 },
  { x: "42%", y: "18%", s: 2,   d: 3.3, dur: 7,   drift: -14 },
  { x: "24%", y: "28%", s: 3,   d: 0.2, dur: 8.5, drift:  26 },
  { x: "11%", y: "44%", s: 2,   d: 2.6, dur: 6.5, drift: -20 },
];

// ─── tiny color helpers ────────────────────────────────────
const b  = (a: number) => `rgba(15,66,169,${a})`;
const bd = (a: number) => `rgba(36,59,105,${a})`;

const ringMask = (px: number) =>
  `radial-gradient(farthest-side, transparent calc(100% - ${px + 0.5}px), white calc(100% - ${px}px))`;

export function IntroLoader() {
  const [mounted,         setMounted]         = useState(true);
  const [opacity,         setOpacity]         = useState(1);
  const [fading,          setFading]          = useState(false);
  const [circleExpanding, setCircleExpanding] = useState(false);
  const [progress,        setProgress]        = useState(0);
  const [deviceType,      setDeviceType]      = useState("Web");

  // ── device detection ─────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if      (window.innerWidth < 768)  setDeviceType("Mobile");
      else if (window.innerWidth < 1024) setDeviceType("Tablet");
      else                               setDeviceType("Web");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── progress ticker ──────────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let cur = 0;
    const t0 = Date.now();

    const tick = () => {
      const dt = Date.now() - t0;
      if      (cur < 35) cur += Math.floor(Math.random() * 8) + 2;
      else if (cur < 75) cur += Math.floor(Math.random() * 4);
      else               cur += Math.floor(Math.random() * 6) + 1;
      if (dt < 2300 && cur > 95) cur = 95;
      if (document.readyState !== "complete" && cur > 99) cur = 99;
      if (cur >= 100) { cur = 100; clearInterval(interval); }
      setProgress(cur);
    };

    interval = setInterval(tick, 80);
    return () => clearInterval(interval);
  }, []);

  // ── exit sequence ────────────────────────────────────────
  useEffect(() => {
    if (progress === 100) {
      const timers = [
        setTimeout(() => setCircleExpanding(true),             300),
        setTimeout(() => { setFading(true); setOpacity(0); }, 2000),
        setTimeout(() => setMounted(false),                   3000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [progress]);

  if (!mounted) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        id="intro-loader"
        data-fading={fading.toString()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          // ← blue-tinted pearl — not pure white
          background: "radial-gradient(ellipse at 40% 38%, #E6F0FF 0%, #D8E8FA 55%, #C9DAFA 100%)",
          overflow: "hidden",
          opacity,
          transition: `opacity ${fading ? "0.4s" : "0s"} ease-in-out`,
          willChange: "opacity",
          pointerEvents: fading ? "none" : "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          cursor: "auto",
        }}
      >

        {/* ══ EXIT: black → white circle expand ═══════════════ */}
        {circleExpanding && (
          <>
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "#000", zIndex: 99998,
              animation: "expandCircle 2.2s both cubic-bezier(0.65,0,0.35,1)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              width: 40, height: 40, borderRadius: "50%",
              backgroundColor: "#fff", zIndex: 99999,
              animation: "expandCircle 2.2s both cubic-bezier(0.65,0,0.35,1) 0.4s",
              pointerEvents: "none",
            }} />
          </>
        )}


        {/* ══ LAYER 0 — Aurora blobs (slow, deep-blurred) ═════ */}
        <div style={{
          position: "absolute", top: "-25%", left: "-18%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(15,66,169,0.16) 0%, transparent 68%)",
          filter: "blur(55px)",
          animation: "auroraBlob 15s ease-in-out infinite",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", bottom: "-22%", right: "-16%",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,140,206,0.14) 0%, transparent 68%)",
          filter: "blur(65px)",
          animation: "auroraBlob 19s ease-in-out infinite 5s",
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", top: "-12%", right: "5%",
          width: 550, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(36,59,105,0.11) 0%, transparent 68%)",
          filter: "blur(75px)",
          animation: "auroraBlob 22s ease-in-out infinite 9s",
          pointerEvents: "none", zIndex: 0,
        }} />


        {/* ══ LAYER 1 — Dot grid (pulsing) ════════════════════ */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(15,66,169,0.22) 1px, transparent 1px)",
          backgroundSize: "38px 38px",
          animation: "gridPulse 7s ease-in-out infinite",
          pointerEvents: "none", zIndex: 1,
        }} />


        {/* ══ LAYER 2 — Crosshair lines through center ════════ */}
        {/* horizontal */}
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0,
          height: 1, marginTop: "-0.5px",
          background: "linear-gradient(to right, transparent 0%, rgba(15,66,169,0.10) 20%, rgba(15,66,169,0.20) 50%, rgba(15,66,169,0.10) 80%, transparent 100%)",
          animation: "crosshairPulse 4.5s ease-in-out infinite",
          pointerEvents: "none", zIndex: 2,
        }} />
        {/* vertical */}
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: 1, marginLeft: "-0.5px",
          background: "linear-gradient(to bottom, transparent 0%, rgba(15,66,169,0.10) 20%, rgba(15,66,169,0.20) 50%, rgba(15,66,169,0.10) 80%, transparent 100%)",
          animation: "crosshairPulse 4.5s ease-in-out infinite 2.25s",
          pointerEvents: "none", zIndex: 2,
        }} />


        {/* ══ LAYER 3 — Radar sweep (rotating luminous wedge) ═ */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: "260vmax", height: "260vmax",
          borderRadius: "50%",
          background: [
            "conic-gradient(from 0deg,",
            "  rgba(15,66,169,0)    0%,",
            "  rgba(15,66,169,0)    78%,",
            "  rgba(15,66,169,0.02) 84%,",
            "  rgba(15,66,169,0.10) 91%,",
            "  rgba(15,66,169,0.16) 94%,",
            "  rgba(15,66,169,0.08) 97%,",
            "  rgba(15,66,169,0)    100%",
            ")",
          ].join(" "),
          animation: "radarSweep 5.5s linear infinite",
          pointerEvents: "none", zIndex: 3,
        }} />


        {/* ══ LAYER 4 — Expanding radar pulse rings ════════════ */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: 80, height: 80, borderRadius: "50%",
            border: `1.5px solid rgba(15,66,169,${0.8 - i * 0.06})`,
            animation: `radarRing 5.5s ease-out ${i * 1.375}s infinite`,
            animationFillMode: "backwards",
            pointerEvents: "none", zIndex: 3,
          }} />
        ))}


        {/* ══ LAYER 5 — Floating particles ════════════════════ */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x, top: p.y,
              width: p.s, height: p.s,
              borderRadius: "50%",
              background: "rgba(15,66,169,0.55)",
              boxShadow: "0 0 5px rgba(15,66,169,0.45)",
              animation: `floatUp ${p.dur}s ease-in-out ${p.d}s infinite`,
              pointerEvents: "none", zIndex: 3,
              // custom CSS property for per-particle drift direction
              ["--p-drift" as string]: `${p.drift}px`,
            } as React.CSSProperties}
          />
        ))}


        {/* ══ LAYER 6 — Ambient glow + haze behind logo ═══════ */}
        <div style={{
          position: "absolute", width: 440, height: 440, borderRadius: "50%",
          background: `radial-gradient(circle, ${b(0.10)} 0%, transparent 70%)`,
          animation: "ambientPulse 4.5s ease-in-out infinite",
          pointerEvents: "none", zIndex: 4,
        }} />
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "rgba(15,66,169,0.13)",
          filter: "blur(80px)",
          animation: "ambientPulse 6s ease-in-out infinite",
          pointerEvents: "none", zIndex: 4,
        }} />


        {/* ══ LOGO + SPINNER RINGS ═════════════════════════════ */}
        <div style={{
          position: "relative", width: 216, height: 216,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "loaderReveal 1.5s cubic-bezier(0.16,1,0.3,1) 0.15s both",
          zIndex: 10,
        }}>

          {/* tilted 3-D orbit ring (outermost) */}
          <div style={{ position: "absolute", inset: 0, perspective: "700px" }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              border: `1px solid ${b(0.4)}`,
              boxShadow: `0 0 35px ${b(0.5)}, inset 0 0 25px ${b(0.3)}`,
              animation: "tiltedRing 7.5s linear infinite",
            }} />
          </div>

          {/* outer static base ring */}
          <div style={{
            position: "absolute", inset: 12, borderRadius: "50%",
            border: `1px solid ${b(0.1)}`,
          }} />

          {/* outer conic comet (CW) */}
          <div style={{
            position: "absolute", inset: 12, borderRadius: "50%",
            background: `conic-gradient(from 0deg,
              ${b(0)}    0%,
              ${b(0.75)} 26%,
              rgba(36,59,105,1) 48%,
              ${b(0.75)} 70%,
              ${b(0)}    100%
            )`,
            animation: "spinCW 2.8s linear infinite",
            WebkitMask: ringMask(2),
            mask: ringMask(2),
            willChange: "transform",
          }} />

          {/* inner static base ring */}
          <div style={{
            position: "absolute", inset: 40, borderRadius: "50%",
            border: `1px solid ${b(0.1)}`,
          }} />

          {/* inner counter-spinner (CCW) */}
          <div style={{
            position: "absolute", inset: 40, borderRadius: "50%",
            background: `conic-gradient(from 90deg,
              ${bd(0)}    0%,
              ${bd(0.55)} 25%,
              ${bd(0)}    50%
            )`,
            animation: "spinCCW 1.9s linear infinite",
            WebkitMask: ringMask(1),
            mask: ringMask(1),
            willChange: "transform",
          }} />

          {/* ICC shimmer text — signature element */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <div style={{ filter: "drop-shadow(0 0 35px rgba(15,66,169,0.75))" }}>
              <span style={{
                display: "block",
                fontSize: "3rem", fontWeight: 700, letterSpacing: "0.26em",
                fontFamily: "Georgia, 'Times New Roman', serif",
                backgroundImage: "linear-gradient(108deg, #243B69 0%, #0F42A9 13%, #6b8cce 37%, #243B69 50%, #6b8cce 63%, #0F42A9 87%, #243B69 100%)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                animation: "iccShimmer 3s linear infinite",
              }}>
                ICC
              </span>
            </div>
          </div>
        </div>


        {/* ══ DOT LOADER + LABEL ═══════════════════════════════ */}
        <div style={{
          marginTop: 46,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 14,
          animation: "fadeUp 1s ease-out 0.8s both",
          position: "relative", zIndex: 10,
        }}>
          <div style={{ display: "flex", gap: 7 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "#0F42A9",
                animation: `dotWave 1.6s ease-in-out ${i * 0.17}s infinite`,
              }} />
            ))}
          </div>

          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
          }}>
            <span style={{
              fontSize: "0.56rem", letterSpacing: "0.46em",
              textTransform: "uppercase", color: bd(0.6),
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}>
              Loading for {deviceType}
            </span>
            <span style={{
              fontSize: "0.8rem", fontWeight: 600,
              letterSpacing: "0.1em", color: b(0.8),
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontVariantNumeric: "tabular-nums",
            }}>
              {progress}%
            </span>
          </div>
        </div>

      </div>
    </>
  );
}