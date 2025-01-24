import { useEffect } from 'react';
import { gsap } from 'gsap';

const useFloatingAnimation = (ref, { minX, maxX, minY, maxY }) => {
  useEffect(() => {
    if (ref.current) {
      gsap.to(ref.current, {
        x: `random(${minX}, ${maxX})`,
        y: `random(${minY}, ${maxY})`,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, [ref, minX, maxX, minY, maxY]);
};

export default useFloatingAnimation;