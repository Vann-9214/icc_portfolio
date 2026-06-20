"use client";

import { useEffect, useRef } from "react";

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 180, // Smaller interaction zone
      vx: 0,
      vy: 0,
    };

    let lastMouse = { x: -1000, y: -1000 };

    // BUG FIX START: Kept only one trail state array to prevent conflicting logic
    const activeTrail: { x: number; y: number; life: number }[] = [];
    // BUG FIX END

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - lastMouse.x;
      mouse.vy = e.clientY - lastMouse.y;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    const colors = {
      software: "rgba(0, 220, 255, ",
      hardware: "rgba(160, 0, 255, ",
      gamedev: "rgba(255, 40, 100, ",
      iot: "rgba(0, 220, 130, ",
    };

    // NEW ADDITION START
    // Mutating the existing colors object to blend with the neutral white background
    colors.software = "rgba(161, 161, 170, "; // Neutral zinc-400
    colors.hardware = "rgba(212, 212, 216, "; // Neutral zinc-300
    colors.gamedev = "rgba(113, 113, 122, "; // Neutral zinc-500
    colors.iot = "rgba(228, 228, 231, "; // Neutral zinc-200
    // NEW ADDITION END

    const codeSymbols = ["{ }", "</>", "=>", "[]", "&&", "||", "AI", "0x00"];

    type ParticleType = "hardware" | "software" | "gamedev" | "iot";

    class Particle {
      x: number;
      y: number;
      z: number;
      baseSize: number;
      speedX: number;
      speedY: number;
      speedZ: number;
      type: ParticleType;
      colorPrefix: string;
      rotation: number;
      rotSpeed: number;
      symbol: string;
      offset: number;
      vx: number;
      vy: number;
      isSnapped: boolean;
      pulseRate: number;

      // NEW ADDITION START
      shockLevel: number;
      wasJustShocked: boolean;
      repelVX: number;
      repelVY: number;
      // NEW ADDITION END

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 1000 + 100;
        this.baseSize = Math.random() * 10 + 6;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.speedZ = (Math.random() - 0.5) * 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.008;
        this.symbol =
          codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
        this.offset = Math.random() * 100;
        this.isSnapped = false;
        this.pulseRate = 1;

        // NEW ADDITION START
        this.shockLevel = 0;
        this.wasJustShocked = false;
        this.repelVX = 0;
        this.repelVY = 0;
        // NEW ADDITION END

        const rand = Math.random();
        if (rand < 0.25) this.type = "hardware";
        else if (rand < 0.5) this.type = "software";
        else if (rand < 0.75) this.type = "gamedev";
        else this.type = "iot";

        this.colorPrefix = colors[this.type];
        this.vx = this.speedX;
        this.vy = this.speedY;
      }

      update() {
        this.z += this.speedZ;
        this.rotation += this.rotSpeed;

        const parallaxFactor = 500 / this.z;
        this.x -= mouse.vx * 0.02 * parallaxFactor;
        this.y -= mouse.vy * 0.02 * parallaxFactor;

        const bound = this.baseSize * parallaxFactor + 20;
        if (this.x < -bound) {
          this.x = canvas!.width + bound;
        } else if (this.x > canvas!.width + bound) {
          this.x = -bound;
        }

        if (this.y < -bound) {
          this.y = canvas!.height + bound;
        } else if (this.y > canvas!.height + bound) {
          this.y = -bound;
        }

        if (this.z > 1500 || this.z < 100) this.speedZ *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const inRange = distance < mouse.radius;

        // BUG FIX START: Continuous drag on slow movement, massive throw on fast movement
        if (inRange) {
          this.shockLevel = 1.0;
          this.wasJustShocked = true;

          const mouseSpeed = Math.sqrt(
            mouse.vx * mouse.vx + mouse.vy * mouse.vy,
          );

          // Drag effect: Decreased pull multiplier from 0.06 to 0.02 for a much lighter drag
          if (mouseSpeed > 0.1 && mouseSpeed < 25 && mouse.x > -1000) {
            // Increased buffer distance from 40 to 60 so they don't crowd the mouse as much
            if (distance > 60) {
              this.x += dx * 0.02; // TWEAK THIS: Adjust drag strength (lower = weaker pull)
              this.y += dy * 0.02; // TWEAK THIS: Adjust drag strength (lower = weaker pull)
            }
            this.repelVX *= 0.5;
            this.repelVY *= 0.5;
          }
        } else {
          if (this.wasJustShocked) {
            const mouseSpeed = Math.sqrt(
              mouse.vx * mouse.vx + mouse.vy * mouse.vy,
            );
            // Hover out: Reduced the blow away multiplier and max force
            if (mouseSpeed >= 25) {
              const angle = Math.atan2(-dy, -dx);
              // TWEAK THIS: Change 0.8 (speed multiplier) and 35 (max speed limit) to adjust the throw
              const blowForce = Math.min(mouseSpeed * 0.8, 35);
              this.repelVX = Math.cos(angle) * blowForce;
              this.repelVY = Math.sin(angle) * blowForce;
            }
            this.wasJustShocked = false;
          }
          if (this.shockLevel > 0) {
            this.shockLevel -= 0.025;
          }
        }

        // Apply velocity and friction
        this.x += this.repelVX;
        this.y += this.repelVY;
        this.repelVX *= 0.92;
        this.repelVY *= 0.92;
        // BUG FIX END

        if (this.type === "software") {
          if (inRange) {
            const angle = Math.atan2(dy, dx);
            const force = 1 - distance / mouse.radius;
            this.x +=
              Math.cos(angle + Math.PI / 2) * force * 3 * parallaxFactor;
            this.y +=
              Math.sin(angle + Math.PI / 2) * force * 3 * parallaxFactor;
            this.x += dx * 0.004;
            this.y += dy * 0.004;
            this.rotSpeed = 0.06 * force + 0.008;
          } else {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotSpeed *= 0.98;
            if (Math.abs(this.rotSpeed) < 0.005)
              this.rotSpeed = (Math.random() - 0.5) * 0.008;
          }
        } else if (this.type === "hardware") {
          if (inRange) {
            const gridSize = 70;
            const relX = this.x - mouse.x;
            const relY = this.y - mouse.y;
            const targetX = mouse.x + Math.round(relX / gridSize) * gridSize;
            const targetY = mouse.y + Math.round(relY / gridSize) * gridSize;
            this.x += (targetX - this.x) * 0.06;
            this.y += (targetY - this.y) * 0.06;
            this.isSnapped =
              Math.abs(this.x - targetX) < 4 && Math.abs(this.y - targetY) < 4;
          } else {
            this.isSnapped = false;
            this.x += this.speedX;
            this.y += this.speedY;
          }
        } else if (this.type === "gamedev") {
          if (inRange) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 4 * parallaxFactor;
            this.vy -= Math.sin(angle) * force * 4 * parallaxFactor;
          }
          this.vx *= 0.88;
          this.vy *= 0.88;
          this.vx += (this.speedX - this.vx) * 0.04;
          this.vy += (this.speedY - this.vy) * 0.04;
          this.x += this.vx;
          this.y += this.vy;
        } else if (this.type === "iot") {
          if (inRange) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / (distance || 1)) * force * 3 * parallaxFactor;
            this.y -= (dy / (distance || 1)) * force * 3 * parallaxFactor;
            this.pulseRate = 1 + force * 2;
          } else {
            this.pulseRate += (1 - this.pulseRate) * 0.03;
            this.x += this.speedX;
            this.y += this.speedY;
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = 500 / this.z;
        const size = this.baseSize * scale;
        const baseOpacity = Math.min(0.4, Math.max(0.05, 0.45 - this.z / 2000));

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hoverBoost =
          dist < mouse.radius ? (1 - dist / mouse.radius) * 0.3 : 0;
        const opacity = Math.min(0.6, baseOpacity + hoverBoost);

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // BUG FIX START: Handle shock color override and electric arc
        let currentPrefix = this.colorPrefix;
        let currentOpacity = opacity;

        if (this.shockLevel > 0) {
          currentPrefix = "rgba(15, 66, 169, "; // Turns to primary blue when shocked
          currentOpacity = Math.max(opacity, this.shockLevel * 0.9);

          // Draw electrical arc connecting to mouse while in range
          if (
            this.shockLevel === 1.0 &&
            mouse.x > -1000 &&
            Math.random() > 0.4
          ) {
            ctx.save();
            ctx.rotate(-this.rotation);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const midX = dx * 0.5 + (Math.random() - 0.5) * 40;
            const midY = dy * 0.5 + (Math.random() - 0.5) * 40;
            ctx.lineTo(midX, midY);
            ctx.lineTo(dx, dy);
            ctx.strokeStyle = `rgba(15, 66, 169, ${Math.random() * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();
          }
        }

        /* BUG FIX START: Removed '* scale' to ensure the glow/blur is equal on all sides and doesn't distort */
        ctx.shadowBlur = 8;
        /* BUG FIX END */
        ctx.shadowColor = currentPrefix + currentOpacity * 0.6 + ")";
        ctx.strokeStyle = currentPrefix + currentOpacity + ")";
        ctx.fillStyle = currentPrefix + currentOpacity + ")";
        ctx.lineWidth = 1.5 * scale;
        // BUG FIX END

        if (this.type === "hardware") {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            i === 0
              ? ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size)
              : ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
          }
          ctx.closePath();
          ctx.stroke();
          if (this.isSnapped) {
            ctx.lineWidth = 0.8 * scale;
            ctx.beginPath();
            ctx.moveTo(-size * 0.4, 0);
            ctx.lineTo(size * 0.4, 0);
            ctx.moveTo(0, -size * 0.4);
            ctx.lineTo(0, size * 0.4);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === "software") {
          ctx.shadowBlur = 0;
          ctx.font = `bold ${size * 1.4}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(this.symbol, 0, 0);
        } else if (this.type === "gamedev") {
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          const jiggle = Math.min(speed * 0.025, 0.2);
          const s = size * (1 + jiggle);
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.866, -s * 0.5);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.lineTo(-s * 0.866, -s * 0.5);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, s);
          ctx.moveTo(0, 0);
          ctx.lineTo(s * 0.866, -s * 0.5);
          ctx.moveTo(0, 0);
          ctx.lineTo(-s * 0.866, -s * 0.5);
          ctx.stroke();
        } else if (this.type === "iot") {
          const pulse =
            Math.sin(time * 0.04 * this.pulseRate + this.offset) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, 0, size * (0.48 + pulse * 0.4), 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.setLineDash([size * 0.18, size * 0.18]);
          ctx.arc(0, 0, size * (0.9 + pulse * 0.35), 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.restore();
      }
    }

    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const count = (window.innerWidth * window.innerHeight) / 13500;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const drawCircuitTrace = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      opacity: number,
      colorPrefix: string,
      scale: number,
    ) => {
      ctx.strokeStyle = colorPrefix + opacity + ")";
      ctx.fillStyle = colorPrefix + opacity + ")";
      ctx.lineWidth = 0.8 * scale;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x2, y1, 2 * scale, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);

        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dz = pi.z - pj.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Shorter connection range — less visual noise
          if (dist > 160) continue;

          const scale = 500 / pi.z;
          const baseOpacity = (1 - dist / 160) * 0.2;

          if (pi.type === pj.type) {
            if (pi.type === "software") {
              ctx.shadowBlur = 0;
              ctx.beginPath();
              ctx.strokeStyle = pi.colorPrefix + baseOpacity + ")";
              ctx.lineWidth = 0.8 * scale;
              ctx.moveTo(pi.x, pi.y);
              const cpX =
                (pi.x + pj.x) / 2 + Math.sin(time * 0.01 + pi.offset) * 25;
              const cpY =
                (pi.y + pj.y) / 2 + Math.cos(time * 0.01 + pj.offset) * 25;
              ctx.quadraticCurveTo(cpX, cpY, pj.x, pj.y);
              ctx.stroke();
            } else if (pi.type === "hardware") {
              drawCircuitTrace(
                pi.x,
                pi.y,
                pj.x,
                pj.y,
                baseOpacity * 0.8,
                pi.colorPrefix,
                scale,
              );
            } else if (pi.type === "gamedev") {
              ctx.beginPath();
              ctx.setLineDash([4 * scale, 4 * scale]);
              ctx.strokeStyle = pi.colorPrefix + baseOpacity * 0.7 + ")";
              ctx.lineWidth = 0.8 * scale;
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
              ctx.setLineDash([]);
            } else if (pi.type === "iot") {
              ctx.beginPath();
              ctx.setLineDash([2 * scale, 6 * scale]);
              ctx.strokeStyle = pi.colorPrefix + baseOpacity * 0.5 + ")";
              ctx.lineWidth = 0.8 * scale;
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
              ctx.setLineDash([]);

              const t = (time * 0.015 + pi.offset * 0.1) % 1;
              const packetX = pi.x + (pj.x - pi.x) * t;
              const packetY = pi.y + (pj.y - pi.y) * t;
              ctx.beginPath();
              ctx.fillStyle =
                pi.colorPrefix + Math.min(0.7, baseOpacity + 0.35) + ")";
              ctx.arc(packetX, packetY, 2.5 * scale, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Cross-type: barely visible
            ctx.beginPath();
            ctx.strokeStyle = pi.colorPrefix + baseOpacity * 0.12 + ")";
            ctx.lineWidth = 0.4;
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      // BUG FIX START: Electric meteor burst (active only when moving, fast expanding jagged rings)
      const isMoving = Math.abs(mouse.vx) > 0.5 || Math.abs(mouse.vy) > 0.5;

      if (mouse.x > -1000 && isMoving) {
        const lastPoint = activeTrail[activeTrail.length - 1];
        const distance = lastPoint
          ? Math.sqrt(
              Math.pow(mouse.x - lastPoint.x, 2) +
                Math.pow(mouse.y - lastPoint.y, 2),
            )
          : 20;

        if (distance > 12) {
          activeTrail.push({ x: mouse.x, y: mouse.y, life: 1.0 });
        }
      }

      for (let i = activeTrail.length - 1; i >= 0; i--) {
        activeTrail[i].life -= 0.08;
        if (activeTrail[i].life <= 0) {
          activeTrail.splice(i, 1);
        }
      }

      if (activeTrail.length > 0) {
        ctx.save();

        for (let i = 0; i < activeTrail.length; i++) {
          const pt = activeTrail[i];
          const intensity = pt.life;
          const progress = 1 - pt.life;

          const radius = 2 + progress * 35;

          // 1. Electric jagged field outline (Primary Palette: #0F42A9)
          ctx.beginPath();
          const segments = 12; // Enough to form a circle, low enough to look jagged
          for (let j = 0; j <= segments; j++) {
            const angle = (j / segments) * Math.PI * 2;
            // Heavy random jitter makes it an electric field shape rather than a perfect round circle
            const jitter = (Math.random() - 0.5) * 16 * intensity;
            const r = radius + jitter;
            const px = pt.x + Math.cos(angle) * r;
            const py = pt.y + Math.sin(angle) * r;

            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(15, 66, 169, ${intensity})`;
          ctx.strokeStyle = `rgba(15, 66, 169, ${intensity * 0.5})`;
          ctx.lineWidth = 1 + intensity * 2;
          ctx.stroke();

          // 2. Inner core field (Secondary Palette: #243B69)
          ctx.beginPath();
          const coreSegments = 8;
          const coreRadius = Math.max(0.1, radius * 0.25);
          for (let j = 0; j <= coreSegments; j++) {
            const angle = (j / coreSegments) * Math.PI * 2;
            const coreJitter = (Math.random() - 0.5) * 8 * intensity;
            const r = coreRadius + coreJitter;
            const px = pt.x + Math.cos(angle) * r;
            const py = pt.y + Math.sin(angle) * r;

            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();

          ctx.fillStyle = `rgba(36, 59, 105, ${Math.max(0, intensity - 0.2) * 0.3})`;
          ctx.fill();
        }

        ctx.restore();
      }
      // BUG FIX END

      mouse.vx *= 0.88;
      mouse.vy *= 0.88;

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
