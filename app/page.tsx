'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to 9:16 aspect ratio
    const updateSize = () => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      // Calculate dimensions maintaining 9:16 ratio
      let width = maxHeight * (9 / 16);
      let height = maxHeight;

      if (width > maxWidth) {
        width = maxWidth;
        height = maxWidth * (16 / 9);
      }

      canvas.width = width;
      canvas.height = height;
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Rain drops array
    const rainDrops: Array<{
      x: number;
      y: number;
      speed: number;
      length: number;
      opacity: number;
    }> = [];

    // Initialize rain drops
    for (let i = 0; i < 200; i++) {
      rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 3 + 2,
        length: Math.random() * 15 + 10,
        opacity: Math.random() * 0.3 + 0.2,
      });
    }

    // Streetlamp flicker state
    let lampIntensity = 0.6;
    let flickerTime = 0;

    const animate = () => {
      // Dark misty background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add fog/mist layers
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.3,
        0,
        canvas.width * 0.5,
        canvas.height * 0.3,
        canvas.width * 0.8
      );
      gradient1.addColorStop(0, 'rgba(30, 30, 40, 0.1)');
      gradient1.addColorStop(1, 'rgba(10, 10, 15, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Streetlamp position (to the side)
      const lampX = canvas.width * 0.2;
      const lampY = canvas.height * 0.25;

      // Flicker logic
      flickerTime += 0.05;
      if (Math.random() > 0.97) {
        lampIntensity = Math.random() * 0.4 + 0.3;
      } else {
        lampIntensity += (0.6 - lampIntensity) * 0.1;
      }

      // Draw streetlamp glow
      const lampGlow = ctx.createRadialGradient(lampX, lampY, 0, lampX, lampY, canvas.width * 0.35);
      lampGlow.addColorStop(0, `rgba(255, 220, 150, ${lampIntensity * 0.15})`);
      lampGlow.addColorStop(0.3, `rgba(255, 200, 100, ${lampIntensity * 0.08})`);
      lampGlow.addColorStop(0.7, `rgba(120, 100, 60, ${lampIntensity * 0.02})`);
      lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lampGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw streetlamp
      ctx.fillStyle = `rgba(255, 220, 150, ${lampIntensity * 0.8})`;
      ctx.beginPath();
      ctx.arc(lampX, lampY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw The Listener - positioned closer/larger
      const listenerX = canvas.width * 0.5;
      const listenerStartY = canvas.height * 0.25;
      const listenerHeight = canvas.height * 0.55;
      const listenerWidth = canvas.width * 0.12;

      // The Listener's body - tall, thin, with slight lean forward
      ctx.save();
      ctx.translate(listenerX, listenerStartY + listenerHeight * 0.5);
      ctx.rotate(0.05); // Slight forward lean
      ctx.translate(-listenerX, -(listenerStartY + listenerHeight * 0.5));

      // Body
      const bodyGradient = ctx.createLinearGradient(
        listenerX - listenerWidth / 2,
        listenerStartY,
        listenerX + listenerWidth / 2,
        listenerStartY
      );
      bodyGradient.addColorStop(0, 'rgba(230, 230, 235, 0.95)');
      bodyGradient.addColorStop(0.5, 'rgba(245, 245, 248, 0.98)');
      bodyGradient.addColorStop(1, 'rgba(230, 230, 235, 0.95)');

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.ellipse(
        listenerX,
        listenerStartY + listenerHeight * 0.6,
        listenerWidth * 0.35,
        listenerHeight * 0.4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Neck - very thin
      ctx.fillStyle = 'rgba(240, 240, 243, 0.96)';
      ctx.fillRect(
        listenerX - listenerWidth * 0.12,
        listenerStartY + listenerHeight * 0.15,
        listenerWidth * 0.24,
        listenerHeight * 0.2
      );

      // Head - smooth, featureless, tilted
      ctx.save();
      ctx.translate(listenerX, listenerStartY + listenerHeight * 0.1);
      ctx.rotate(-0.15); // Head tilt

      const headGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, listenerWidth * 0.4);
      headGradient.addColorStop(0, 'rgba(248, 248, 250, 1)');
      headGradient.addColorStop(0.7, 'rgba(240, 240, 243, 0.98)');
      headGradient.addColorStop(1, 'rgba(230, 230, 235, 0.95)');

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, listenerWidth * 0.35, listenerHeight * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Smooth outline for head
      ctx.strokeStyle = 'rgba(220, 220, 225, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // Arms - thin, hanging
      ctx.fillStyle = 'rgba(240, 240, 243, 0.96)';
      // Left arm
      ctx.fillRect(
        listenerX - listenerWidth * 0.5,
        listenerStartY + listenerHeight * 0.35,
        listenerWidth * 0.15,
        listenerHeight * 0.5
      );
      // Right arm
      ctx.fillRect(
        listenerX + listenerWidth * 0.35,
        listenerStartY + listenerHeight * 0.35,
        listenerWidth * 0.15,
        listenerHeight * 0.5
      );

      ctx.restore();

      // Subtle glow around The Listener
      const listenerGlow = ctx.createRadialGradient(
        listenerX,
        listenerStartY + listenerHeight * 0.5,
        0,
        listenerX,
        listenerStartY + listenerHeight * 0.5,
        listenerWidth * 1.5
      );
      listenerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      listenerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = listenerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rain
      ctx.strokeStyle = 'rgba(180, 190, 200, 0.4)';
      rainDrops.forEach((drop) => {
        ctx.globalAlpha = drop.opacity;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.lineWidth = 1;
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });
      ctx.globalAlpha = 1;

      // Mist overlay
      const mistGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
      mistGradient.addColorStop(0, 'rgba(15, 15, 20, 0)');
      mistGradient.addColorStop(1, 'rgba(15, 15, 20, 0.4)');
      ctx.fillStyle = mistGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <main className={styles.main}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.info}>
        <h1>The Listener</h1>
        <p>It strains to hear...</p>
      </div>
    </main>
  );
}
