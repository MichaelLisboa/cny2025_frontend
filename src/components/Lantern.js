import React from 'react';
import styled, { css } from 'styled-components';
import { GatsbyImage } from 'gatsby-plugin-image';
// import useFloatingAnimation from '../hooks/useFloatingAnimation';

const LanternWrapper = styled.div`
  position: absolute;
  transform-origin: center;
  left: ${({ x }) => `${x}%`};
  top: ${({ y }) => `${y}%`};
  transform: ${({ scale }) => `scale(${scale})`};
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
    transform: ${({ scale }) => `scale(${scale * 0.5})`}; // Scale down for mobile devices
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    transform: ${({ scale }) => `scale(${scale * 0.75})`}; // Scale down for tablet devices
  }
`;

const Lantern = ({ x, y, scale, zindex, opacity, image, alt }) => {
  // const floatingRef = useFloatingAnimation({ minX: -35, maxX: 35, minY: -45, maxY: 45 });

  return (
    <LanternWrapper
      x={x}
      y={y}
      scale={scale}
      zindex={zindex}
      opacity={opacity}
    >
      <GatsbyImage image={image} alt={alt} />
    </LanternWrapper>
  );
};

export default Lantern;
