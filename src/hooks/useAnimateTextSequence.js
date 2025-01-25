// useAnimateTextSequence.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);

const useAnimateTextSequence = ({
  waveSpeed = 0.1,
  fadeDuration = 0.5,
  startDelay = 0
} = {}) => {
  // 1. The hook creates & manages its own ref
  const elementsRef = useRef(null);

  useEffect(() => {
    const elements = elementsRef.current;
    if (!elements || elements.length === 0) return;

    // 2. Ensure each element is hidden initially and text is split
    elements.forEach((el, index) => {
      gsap.set(el, { display: 'block', opacity: 0 });
      if (!el.dataset.text) el.dataset.text = el.textContent.trim();

      // split text into spans
      el.innerHTML = el.dataset.text
        .split('')
        .map((char) => (char === ' ' ? ' ' : `<span class="char">${char}</span>`))
        .join('');
      // store order for sorting in IntersectionObserver
      el.dataset.index = index;
    });

    // 3. Create a timeline for sequential or wave-based animations
    const timeline = gsap.timeline({ paused: true, delay: startDelay });

    // 4. IntersectionObserver to start animation when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.dataset.index - b.target.dataset.index)
          .forEach((entry) => {
            const el = entry.target;
            const characters = el.querySelectorAll('.char');
            timeline.add(
              gsap
                .timeline()
                .to(el, { opacity: 1, duration: fadeDuration, ease: 'power1.out' })
                .fromTo(
                  characters,
                  { y: 40, opacity: 0, scale: 0.05 },
                  {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.5,
                    stagger: waveSpeed,
                    ease: 'power1.out'
                  },
                  `-=${fadeDuration / 4}`
                )
            );

            // once animated, stop observing
            observer.unobserve(el);
          });

        timeline.play();
      },
      { threshold: 0.2, rootMargin: '0px 0px -2% 0px' }
    );

    // 5. Observe each element
    elements.forEach((el) => {
      observer.observe(el);
    });

    // 6. Cleanup on unmount
    return () => {
      observer.disconnect();
      timeline.kill();
    };
  }, [waveSpeed, fadeDuration, startDelay]);

  // Return this so any component can set elementsRef.current to the relevant nodes
  return elementsRef;
};

export default useAnimateTextSequence;