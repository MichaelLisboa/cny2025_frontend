import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { GatsbyImage } from 'gatsby-plugin-image';
import useFloatingAnimation from '../hooks/useFloatingAnimation';

// Styled component for the lantern wrapper
const LanternWrapper = styled.div`
  position: absolute;
  transform-origin: center;
  left: ${({ x }) => `${x}%`};
  top: ${({ y }) => `${y}%`};
  transform: ${({ scale }) => `scale(${scale || 1})`}; /* Default scale fallback */
  ${({ zindex, opacity }) => css`
    z-index: ${zindex};
    opacity: ${opacity};
  `}

  .gatsby-image-wrapper {
    overflow: visible;
    cursor: pointer;
  }

  img {
    filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
    transition: filter 1s ease-in-out;

    &:hover {
      filter: drop-shadow(0 0 24px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
      transition: filter 1s ease-in-out;
    }
  }

  @media (max-width: 768px) {
    transform: ${({ scale }) => `scale(${(scale || 1) * 0.5})`}; // Scale down for mobile devices
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    transform: ${({ scale }) => `scale(${(scale || 1) * 0.75})`}; // Scale down for tablet devices
  }
`;

const Lantern = ({ x, y, scale, zindex, opacity, image, alt }) => {
  const floatingRef = useRef(null);

  // Ensure the floating animation gracefully handles cases where the ref might not be valid
  useFloatingAnimation(floatingRef, { minX: -35, maxX: 35, minY: -45, maxY: 45 });

  // Validate props and skip rendering if the image is missing
  if (!image) {
    console.warn(`Missing image for lantern with alt: ${alt}`);
    return null;
  }

  return (
    <LanternWrapper
      x={x}
      y={y}
      scale={scale}
      zindex={zindex}
      opacity={opacity}
      ref={floatingRef}
    >
      <GatsbyImage image={image} alt={alt} />
    </LanternWrapper>
  );
};

export default Lantern;