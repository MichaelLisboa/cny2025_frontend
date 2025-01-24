import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const useFloatingAnimation = ({ minX, maxX, minY, maxY }) => {
  const ref = useRef(null);

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
  }, [minX, maxX, minY, maxY]);

  return ref;
};

export default useFloatingAnimation;