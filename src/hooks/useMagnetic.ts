import { useRef, useState, useCallback } from 'react';
import { useReducedMotionSafe } from './useReducedMotionSafe';

export function useMagnetic(maxDisplacement: number = 8) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reducedMotion = useReducedMotionSafe();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !ref.current) return;

      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Limit displacement to maxDisplacement
      const clampedX = Math.max(-maxDisplacement, Math.min(maxDisplacement, distanceX * 0.2));
      const clampedY = Math.max(-maxDisplacement, Math.min(maxDisplacement, distanceY * 0.2));

      setPosition({ x: clampedX, y: clampedY });
    },
    [maxDisplacement, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handleMouseMove,
    handleMouseLeave,
  };
}
