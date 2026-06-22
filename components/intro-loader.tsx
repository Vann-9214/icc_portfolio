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
    50%        { opacity: 0.65; transform: scale(1.08); }
  }
  @keyframes dotWave {
    0%, 60%, 100% { transform: scale(0.5);  opacity: 0.2; }
    30%            { transform: scale(1.4);  opacity: 1;   }
  }
  @keyframes loaderReveal {
    from { opacity: 0; transform: scale(0.78); filter: blur(12px); }
    to   { opacity: 1; transform: scale(1);    filter: blur(0);    }
  }
  @keyframes expandCircle {
    0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(150); opacity: 1; }
  }
`;

// ─── tiny color helpers ────────────────────────────────────
const g = (a: number) => `rgba(201,169,110,${a})`;
const w = (a: number) => `rgba(255,255,255,${a})`;

const b = (a: number) => `rgba(15,66,169,${a})`; // Brand Blue (#0F42A9)
const bd = (a: number) => `rgba(36,59,105,${a})`; // Brand Blue Dark (#243B69)

const ringMask = (px: number) =>
  `radial-gradient(farthest-side, transparent calc(100% - ${px + 0.5}px), white calc(100% - ${px}px))`;

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  
  const [opacity, setOpacity]  = useState(1); 
  
  const [fading,  setFading]   = useState(false);

  const [circleExpanding, setCircleExpanding] = useState(false);

  const [progress, setProgress] = useState(0);
  const [deviceType, setDeviceType] = useState("Web");

  useEffect(() => {
    // Detect the user's device based on window width
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDeviceType("Mobile");
      } else if (window.innerWidth < 1024) {
        setDeviceType("Tablet");
      } else {
        setDeviceType("Web");
      }
    };
    
    handleResize(); // Run immediately on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentProgress = 0;
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;

      if (currentProgress < 35) {
        currentProgress += Math.floor(Math.random() * 8) + 2; 
      } else if (currentProgress < 75) {
        currentProgress += Math.floor(Math.random() * 4); 
      } else {
        currentProgress += Math.floor(Math.random() * 6) + 1; 
      }

      if (elapsedTime < 2300 && currentProgress > 95) {
        currentProgress = 95; 
      }

      if (document.readyState !== "complete" && currentProgress > 99) {
        currentProgress = 99;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }

      setProgress(currentProgress);
    };

    interval = setInterval(updateProgress, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      // BUG FIX START - Adjusted timers. The loader now waits for the 2.2s white circle to finish expanding, THEN does a rapid fade-out so there is no transparent overlap.
      const timers = [
        setTimeout(() => setCircleExpanding(true), 300), 
        setTimeout(() => { setFading(true); setOpacity(0); }, 2000), 
        setTimeout(() => setMounted(false), 3000), 
      ];
      // BUG FIX END
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
          background: "radial-gradient(circle at 50% 50%, #ffffff 0%, #EEF3FC 100%)",
          opacity,
          // BUG FIX START - Reduced the fade duration from 2s to a snappy 0.4s clean wipe
          transition: `opacity ${fading ? "0.4s" : "0s"} ease-in-out`,
          // BUG FIX END
          willChange: "opacity",
          pointerEvents: fading ? "none" : "auto",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          cursor: "auto",
        }}
      >
        {circleExpanding && (
          <>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#000",
                zIndex: 99998,
                animation: "expandCircle 2.2s both cubic-bezier(0.65, 0, 0.35, 1)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                zIndex: 99999,
                animation: "expandCircle 2.2s both cubic-bezier(0.65, 0, 0.35, 1) 0.4s",
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* ambient glow disc */}
        <div style={{
          position: "absolute", width: 440, height: 440, borderRadius: "50%",
          background: `radial-gradient(circle, ${b(0.09)} 0%, transparent 70%)`,
          animation: "ambientPulse 4.5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Cool blurred circle shadow in background */}
        <div style={{
          position: "absolute", width: "600px", height: "600px", borderRadius: "50%",
          background: "rgba(15, 66, 169, 0.12)",
          filter: "blur(80px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "ambientPulse 6s ease-in-out infinite",
        }} />

        {/* ── rings + logo ────────────── */}
        <div style={{
          position: "relative", width: 216, height: 216,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "loaderReveal 1.5s cubic-bezier(0.16,1,0.3,1) 0.15s both",
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
            <div style={{ filter: `drop-shadow(0 0 35px rgba(15, 66, 169, 0.75))` }}>
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

        {/* ── dot loader + label ───── */}
        <div style={{
          marginTop: 46,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 14,
          animation: "fadeUp 1s ease-out 0.8s both",
        }}>
          <div style={{ display: "flex", gap: 7 }}>
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#0F42A9",
                  animation: `dotWave 1.6s ease-in-out ${i * 0.17}s infinite`,
                }}
              />
            ))}
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              fontSize: "0.56rem", letterSpacing: "0.46em",
              textTransform: "uppercase",
              color: bd(0.6),
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}>
              Loading for {deviceType}
            </span>
            <span style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: b(0.8),
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontVariantNumeric: "tabular-nums"
            }}>
              {progress}%
            </span>
          </div>

        </div>
      </div>
    </>
  );
}