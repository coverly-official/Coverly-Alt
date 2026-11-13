import { useState, useCallback, useRef } from 'react';
import { useReducedMotionSafe } from './useReducedMotionSafe';

export function useTilt(maxAngle: number = 4) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const reducedMotion = useReducedMotionSafe();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (rotateX is based on Y offset, rotateY is based on X offset)
      const rotateX = ((centerY - y) / centerY) * maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      setTilt({ rotateX, rotateY });
    },
    [maxAngle, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return {
    ref,
    tilt,
    handleMouseMove,
    handleMouseLeave,
  };
}
