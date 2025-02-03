import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 1);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  text-align: center;
  opacity: 0; /* Start hidden */
  pointer-events: none;
  z-index: 10000;
`;

const OrientationOverlay = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkOrientation = () => {
      if (!("ontouchstart" in window)) return setIsLandscape(false);
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    const mediaQuery = window.matchMedia("(orientation: landscape)");
    mediaQuery.addEventListener("change", checkOrientation);
    checkOrientation(); // Initial check

    return () => mediaQuery.removeEventListener("change", checkOrientation);
  }, []);

  useEffect(() => {
    if (overlayRef.current) {
      if (isLandscape) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.5, pointerEvents: "auto" });
      } else {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, pointerEvents: "none" });
      }
    }
  }, [isLandscape]);

  return (
    <Overlay ref={overlayRef}>
      Please rotate back to portrait mode for the best experience.
    </Overlay>
  );
};

export default OrientationOverlay;