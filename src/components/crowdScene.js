import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import useDeviceInfo from '../hooks/useDeviceInfo';

const ParallaxImageContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none; /* Ensure this container does not block mouse events */
`;

const ImageWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 300vw; /* Extend beyond the width of the viewport */
  height: auto;
  pointer-events: auto; /* Allow interactions within the image wrapper */

  @media (min-width: 769px) {
    width: 120vw; /* Extend beyond the width of the viewport */
  }
`;

const CrowdScene = () => {
  const { isMobile } = useDeviceInfo();
  const [xOffset, setXOffset] = useState(0);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    // Ensure this effect only runs in the browser
    if (typeof window === 'undefined') return;

    const handleBackgroundMovement = (moveX) => {
      const maxMoveX = (imageWrapperRef.current.clientWidth - window.innerWidth) / 2;
      const constrainedMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, moveX));
      gsap.to(imageWrapperRef.current, {
        x: constrainedMoveX,
        duration: 1,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (event) => {
      const { clientX } = event;
      const moveX =
        ((clientX / window.innerWidth) - 0.5) *
        (imageWrapperRef.current.clientWidth - window.innerWidth) *
        0.2;
      handleBackgroundMovement(moveX);
      setXOffset(moveX);
    };

    const handleDeviceOrientation = (event) => {
      const { gamma } = event;
      const moveX =
        (gamma / 45) *
        (imageWrapperRef.current.clientWidth - window.innerWidth) /
        4;
      handleBackgroundMovement(moveX);
    };

    const handleTouchMove = (event) => {
      const touchMoveX = event.touches[0].clientX;
      const moveX =
        ((touchMoveX - touchStartX) / window.innerWidth) *
        (imageWrapperRef.current.clientWidth - window.innerWidth) *
        0.4;
      handleBackgroundMovement(moveX);
    };

    let touchStartX = 0;
    const handleTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    if (imageWrapperRef.current) {
      imageWrapperRef.current.addEventListener('touchstart', handleTouchStart);
      imageWrapperRef.current.addEventListener('touchmove', handleTouchMove);
    }

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (imageWrapperRef.current) {
        imageWrapperRef.current.removeEventListener('touchstart', handleTouchStart);
        imageWrapperRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);

  return (
    <ParallaxImageContainer>
      <ImageWrapper ref={imageWrapperRef}>
        <StaticImage
          src="../images/crowd-scene.png"
          alt="Crowd Scene"
          style={{ width: '100%', height: 'auto' }}
        />
      </ImageWrapper>
    </ParallaxImageContainer>
  );
};

export default CrowdScene;