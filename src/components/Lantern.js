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

const LanternContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const LanternImageWrapper = styled.div`
  height: 75vh;
  max-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .gatsby-image-wrapper {
    height: 100%; /* Ensure it fills the vertical space */
    display: flex;
    align-items: center;
    justify-content: center; /* Centers the image horizontally */
    width: 100%; /* Prevent shrink-to-fit */
  }

  .gatsby-image-wrapper img {
    height: 100%; /* Scale proportionally */
    width: auto;
    object-fit: contain;
    margin: auto; /* Backup in case Flexbox alignment fails */
    
    animation: ${pulse} 3s infinite ease-in-out; /* Add the pulsing animation with easing */
  }
`;

const StyledImage = styled(GatsbyImage)`
  height: 100%;
  width: auto;
  object-fit: contain;
`;

const Lantern = forwardRef(({ animalSign }, ref) => {
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
  useFloatingAnimation(floatingRef, { minX: -30, maxX: 30, minY: -60, maxY: 60, minRotation: -3, maxRotation: 3 });

  return (
    <LanternContainer ref={ref}>
      <LanternImageWrapper ref={floatingRef}>
        {lanternImage ? (
          <StyledImage
            image={lanternImage}
            alt={`${animalSign} lantern`}
          />
        ) : (
          <p>Lantern image not found</p>
        )}
      </LanternImageWrapper>
    </LanternContainer>
  );
});

export default Lantern;
