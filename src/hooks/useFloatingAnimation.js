import { useEffect } from 'react';
import { gsap } from 'gsap';

const useFloatingAnimation = (ref, { minX, maxX, minY, maxY }) => {
  useEffect(() => {
    console.log("useFloatingAnimation: ref", ref);

    if (!ref.current) {
      console.warn("Ref is null, skipping animation");
      return; // Exit early if the ref is not attached
    }

    const element = ref.current;
    console.log("useFloatingAnimation: element", element);

    const animation = setTimeout(() => {
      if (ref.current) {
        gsap.to(ref.current, {
          x: `random(${minX}, ${maxX})`,
          y: `random(${minY}, ${maxY})`,
          duration: 3,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
          overwrite: "auto",
        });
      }
    }, 100);

    return () => {
      console.log("Cleaning up animation");
      animation.kill();
    };
  }, [ref, minX, maxX, minY, maxY]);
};

export default useFloatingAnimation;