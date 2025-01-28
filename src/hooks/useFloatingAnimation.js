import { useEffect } from 'react';
import { gsap } from 'gsap';

const useFloatingAnimation = (ref, { minX, maxX, minY, maxY, minRotation = -2, maxRotation = 2 }) => {
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const animation = gsap.to(element, {
        x: `random(${minX}, ${maxX})`,
        y: `random(${minY}, ${maxY})`,
        rotation: `random(${minRotation}, ${maxRotation})`,
        duration: 5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });

      return () => {
        animation.kill();
      };
    }
  }, [ref, minX, maxX, minY, maxY, minRotation, maxRotation]);
};

export default useFloatingAnimation;