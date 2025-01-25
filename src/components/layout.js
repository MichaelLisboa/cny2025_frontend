import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Navbar from "../components/navbar"; // Import Navbar
import "./layout.css";

// Styled-components
const Container = styled.div`
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: ${({ scrollable }) => (scrollable ? 'auto' : 'hidden')};
`;

const ParallaxImageContainer = styled.div`
  position: absolute;
  bottom: ${({ alignImage }) => (alignImage === 'bottom' ? '0' : 'auto')};
  top: ${({ alignImage }) => (alignImage === 'top' ? '0' : 'auto')};
  left: 0;
  right: 0;
  width: 200%; // Ensures it's wide enough for parallax
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
  z-index: -1;

  @media (min-width: 1440px) {
    width: 175%;
  }

  @media (min-width: 1920px) {
    width: 125%;
  }

  @media (min-width: 3840px) {
    width: 110%;
  }
`;

const Layout = ({ children, image, scrollable, contentContainerStyles, alignImage }) => {
  const backgroundImageRef = useRef(null);

  const data = useStaticQuery(graphql`
    query {
      allFile(filter: { extension: { regex: "/(jpg|jpeg|png)/" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
            )
          }
        }
      }
    }
  `);

  const backgroundImage = image ? getImage(data.allFile.nodes.find(node => node.relativePath === image)) : null;

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined' || !backgroundImageRef.current || !backgroundImage) return;

    const handleBackgroundMovement = (moveX) => {
      const maxMoveX = (backgroundImageRef.current.scrollWidth - window.innerWidth) / 2;
      const constrainedMoveX = Math.max(-maxMoveX, Math.min(maxMoveX, moveX));
      gsap.to(backgroundImageRef.current, {
        x: constrainedMoveX,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseMove = (event) => {
      const { clientX } = event;
      const moveX = ((clientX / window.innerWidth) - 0.5) * (backgroundImageRef.current.scrollWidth - window.innerWidth) * 0.05;
      handleBackgroundMovement(moveX);
    };

    const handleDeviceOrientation = (event) => {
      const { gamma } = event;
      const moveX = (gamma / 45) * (backgroundImageRef.current.scrollWidth - window.innerWidth) / 8;
      handleBackgroundMovement(moveX);
    };

    let touchStartX = 0;
    const handleTouchStart = (event) => {
      touchStartX = event.touches[0].clientX;
    };

    const handleTouchMove = (event) => {
      const touchMoveX = event.touches[0].clientX;
      const moveX = ((touchMoveX - touchStartX) / window.innerWidth) * (backgroundImageRef.current.scrollWidth - window.innerWidth) * 0.1;
      handleBackgroundMovement(moveX);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    if (backgroundImageRef.current) {
      backgroundImageRef.current.addEventListener('touchstart', handleTouchStart);
      backgroundImageRef.current.addEventListener('touchmove', handleTouchMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      if (backgroundImageRef.current) {
        backgroundImageRef.current.removeEventListener('touchstart', handleTouchStart);
        backgroundImageRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [backgroundImage]);

  return (
    <Container>
      <Navbar /> {/* Add Navbar component */}
      {backgroundImage && (
        <ParallaxImageContainer
          ref={backgroundImageRef}
          className="background-image"
          alignImage={alignImage}
        >
          <GatsbyImage image={backgroundImage} alt="Background Image" />
        </ParallaxImageContainer>
      )}
      <Content style={contentContainerStyles} scrollable={scrollable}>
        {children}
      </Content>
    </Container>
  );
}

export default Layout;