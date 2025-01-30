import React, { forwardRef, useMemo, useRef } from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import styled, { keyframes } from "styled-components";
import useFloatingAnimation from '../hooks/useFloatingAnimation';

const LanternImageWrapper = styled.div`
  position: relative;
  width: 75%; /* Scale with viewport or parent */
  aspect-ratio: 3 / 4; /* Keeps the shape proportional */
  max-height: 75vh; /* Prevents oversized lanterns */
  display: flex;
  align-items: center;
  justify-content: center;

  .gatsby-image-wrapper {
    height: 100%; /* Ensure it fills the vertical space */
    display: flex;
    align-items: center;
    justify-content: center; /* Centers the image horizontally */
    width: 100%; /* Prevent shrink-to-fit */
    overflow: visible;
  }

  .gatsby-image-wrapper img {
    height: 100%; /* Scale proportionally */
    width: auto;
    object-fit: contain;
    margin: auto; /* Backup in case Flexbox alignment fails */
  }
`;

const glowPulse = keyframes`
  0% { opacity: 0.45; transform: translate(-50%, -50%) scale(1.05); }
  50% { opacity: 0.55; transform: translate(-50%, -50%) scale(1.08); }
  100% { opacity: 0.45; transform: translate(-50%, -50%) scale(1.05); }
`;

const StyledGlowImage = styled(GatsbyImage)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110%; /* Slightly bigger than the main image */
  opacity: 0.3; /* Initial glow intensity */
  animation: ${glowPulse} 56s infinite ease-in-out;
  filter: blur(10px);
  z-index: 0; /* Behind the main lantern */
  will-change: transform, opacity; /* Optimize for animation */
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%; /* Default width relative to lantern */
  font-size: calc(1vw + 10px); /* Scale text with viewport width */
  text-align: center;
  line-height: 1;
  color: rgb(224, 119, 0); /* Adjust color to match lantern glow */
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.6), -1px -1px 1px rgba(152, 103, 4, 0.4); /* Add glow effect */
  mix-blend-mode: multiply; /* Add multiply effect */
  z-index: 1;

  @media (max-width: 768px) {
    width: 60%; /* Expand width for smaller screens */
    font-size: calc(2vw + 12px); /* Adjust font size for small screens */
  }

  @media (min-width: 768px) {
    width: 30%; /* Shrink width for large screens */
    font-size: calc(1vw + 16px); /* Fine-tune for large displays */
  }

  @media (min-width: 1200px) {
    width: 20%; /* Shrink width for large screens */
    font-size: calc(1.5vw + 12px); /* Fine-tune for large displays */
  }

  @media (min-width: 1920px) {
    width: 15%; /* Shrink width for large screens */
    font-size: calc(1vw + 12px); /* Fine-tune for large displays */
  }

  p.large-text {
    font-size: 0.7em;
    font-weight: 800;
  }

  p.name {
    font-size: 0.7em;
    font-weight: 600;
    white-space: nowrap;
  }

  p.message {
    font-weight: 700;
    line-height: 1;
  }
`;

const StyledImage = styled(GatsbyImage)`
  height: 100%;
  width: auto;
  object-fit: contain;
`;

const Lantern = forwardRef(({ animalSign, text, name }, ref) => {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            relativePath
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
            }
          }
        }
      }
    }
  `);

  const getImageByName = useMemo(() => {
    return (name) => {
      const image = data.allFile.edges.find(({ node }) =>
        node.relativePath.includes(name)
      );
      return image ? getImage(image.node.childImageSharp) : null;
    };
  }, [data]);

  const lanternImage = getImageByName(`lantern-${animalSign.toLowerCase()}.png`);
  const glowImage = getImageByName(`lantern-empty.png`); // 🚀 Fetch glow image

  const floatingRef = useRef(null);
  useFloatingAnimation(floatingRef, { minX: -20, maxX: 20, minY: -40, maxY: 40, minRotation: -3, maxRotation: 3 });

  return (
      <LanternImageWrapper ref={floatingRef}>
        {glowImage && (
        <StyledGlowImage
          image={glowImage}
          alt="Glowing effect"
          className="glow"
        />
      )}
        {(text || name) && (
          <TextOverlay>
            {name && <p className="name">From {name}</p>}
            {text && <p className="message">{text}</p>}
          </TextOverlay>
        )}
        {lanternImage ? (
          <StyledImage
            image={lanternImage}
            alt={`${animalSign} lantern`}
          />
        ) : (
          <p>Lantern image not found</p>
        )}
      </LanternImageWrapper>
  );
});

export default Lantern;
