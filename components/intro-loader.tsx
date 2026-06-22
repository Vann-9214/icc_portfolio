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

      // Realistic loading simulation (bursts and stalls)
      if (currentProgress < 35) {
        currentProgress += Math.floor(Math.random() * 8) + 2; // Fast initial burst
      } else if (currentProgress < 75) {
        currentProgress += Math.floor(Math.random() * 4); // Slower middle section, occasionally adding 0 (stalling)
      } else {
        currentProgress += Math.floor(Math.random() * 6) + 1; // Steady climb to the end
      }

      // Enforce the 2.5-second minimum: cap at 95% until 2300ms have passed
      if (elapsedTime < 2300 && currentProgress > 95) {
        currentProgress = 95; 
      }

      // Hold at 99% if the user's browser is genuinely still downloading heavy assets
      if (document.readyState !== "complete" && currentProgress > 99) {
        currentProgress = 99;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }

      setProgress(currentProgress);
    };

    // Run every 80ms to create a slightly jittery, realistic network pulling effect
    interval = setInterval(updateProgress, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Only begin the exit animation once progress has reached 100% locally
    if (progress === 100) {
      const timers = [
        // BUG FIX START - Extended the delay before fading starts. This gives the browser's main thread enough time to process heavy background content (like your interactive background) and recover from the FPS spike before attempting to animate the fade.
        setTimeout(() => { setFading(true); setOpacity(0); }, 1500), 
        // Extended the unmount timer significantly so it doesn't delete the component from the DOM while it's still trying to fade out through the lag.
        setTimeout(() => setMounted(false), 3500), 
        // BUG FIX END
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [progress]);

  if (!mounted) return null;

  return (
    <>
      <style>{KEYFRAMES}</style>

      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "#ffffff",
          opacity,
          transition: `opacity ${fading ? "1s" : "0s"} ease-in-out`,
          willChange: "opacity",
          // BUG FIX START - Added pointerEvents so the wrapper stops blocking your mouse clicks immediately once it starts fading out
          pointerEvents: fading ? "none" : "auto",
          // BUG FIX END
        }}
      >
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