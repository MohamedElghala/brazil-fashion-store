'use client';

import React, { useEffect, useRef } from 'react';

interface FabricCanvasProps {
  className?: string;
  lineColor?: string;
  accentColor?: string;
  density?: number;
}

export default function FabricCanvas({
  className = '',
  lineColor = 'rgba(24, 24, 27, 0.045)',
  accentColor = 'rgba(194, 109, 83, 0.18)',
  density = 24,
}: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / width - 0.5;
      targetMouseY = (e.clientY - rect.top) / height - 0.5;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    resize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      time += prefersReducedMotion ? 0.001 : 0.008;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const spacing = height / (density + 1);

      for (let i = 0; i < density; i++) {
        const baseY = spacing * (i + 1);
        const isAccent = i % 7 === 0;

        ctx.beginPath();
        ctx.lineWidth = isAccent ? 1.4 : 0.75;
        ctx.strokeStyle = isAccent ? accentColor : lineColor;

        const stepX = 20;
        for (let x = 0; x <= width + stepX; x += stepX) {
          const normX = x / width;
          const mouseDist = Math.sin((normX + mouseX) * Math.PI) * mouseY * 25;

          const wave1 = Math.sin(x * 0.0028 + time * 1.2 + i * 0.25) * (8 + Math.abs(mouseY) * 12);
          const wave2 = Math.cos(x * 0.0012 + time * 0.6 + i * 0.12) * 12;
          const y = baseY + wave1 + wave2 + mouseDist;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [accentColor, density, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
