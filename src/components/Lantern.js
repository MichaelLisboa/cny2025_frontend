import React, { forwardRef, useMemo, useRef } from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import styled, { keyframes } from "styled-components";
import useFloatingAnimation from '../hooks/useFloatingAnimation';

const pulse = keyframes`
  0% {
    filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.8));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(255, 255, 179, 0.6));
    transform: scale(1.01);
  }
  100% {
    filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.8));
    transform: scale(1);
  }
`;

const LanternImageWrapper = styled.div`
  height: 75vh;
  max-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  position: relative; /* Add relative positioning */

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
    animation: ${pulse} 5s infinite ease-in-out; /* Add the pulsing animation with easing */
  }
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30%;
  z-index: 1;
  text-align: center;
  color: rgb(224, 119, 0); /* Adjust color to match lantern glow */
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.6), -1px -1px 1px rgba(152, 103, 4, 0.4); /* Add glow effect */
  font-size: 2vw; /* Responsive font-size for standard viewports */
  mix-blend-mode: multiply; /* Add multiply effect */

  @media (max-width: 768px) {
    font-size: 6vw; /* Adjust font-size for smaller screens */
  }

  @media (min-width: 769px) {
    padding: 1.5rem; /* Add padding for larger screens */
    font-size: 1.5vw; /* Adjust font-size for 4k displays */
    bottom: 20%;
  }

  p.large-text {
    font-size: 0.7em;
    font-weight: 800;
  }

  p.name {
    font-size: 0.7em;
    font-weight: 600;
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

  const floatingRef = useRef(null);
  useFloatingAnimation(floatingRef, { minX: -20, maxX: 20, minY: -40, maxY: 40, minRotation: -3, maxRotation: 3 });

  return (
      <LanternImageWrapper ref={floatingRef}>
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
