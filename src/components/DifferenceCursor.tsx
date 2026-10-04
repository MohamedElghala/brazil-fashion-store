"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function DifferenceCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>('');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only activate on devices that support hover / fine pointer
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check for custom cursor targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveParent = target.closest(
          'a, button, [data-cursor-text], input, select, textarea, [role="button"]'
        ) as HTMLElement | null;

        if (interactiveParent) {
          setIsHovered(true);
          const customText = interactiveParent.getAttribute('data-cursor-text');
          setLabel(customText || '');
        } else {
          setIsHovered(false);
          setLabel('');
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const animate = () => {
      // Lerp (0.18 factor for responsive yet fluid trailing)
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${
          isHovered ? 2.4 : 1
        })`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible, isHovered]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-opacity duration-300 flex items-center justify-center text-[7px] font-bold uppercase tracking-widest text-black select-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        width: '32px',
        height: '32px',
        backgroundColor: '#FFFFFF',
        mixBlendMode: 'difference',
        willChange: 'transform',
      }}
    >
      {isHovered && label && (
        <span className="scale-75 transform text-center px-0.5 leading-none">
          {label}
        </span>
      )}
    </div>
  );
}
