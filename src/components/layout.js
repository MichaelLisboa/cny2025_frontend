import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Navbar from "../components/navbar"; // Import Navbar
import "./layout.css";

// Styled-components
const Container = styled.div.attrs({ className: "container" })`
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
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
  overflow-y: ${({ $scrollable }) => ($scrollable ? 'auto' : 'hidden')};
  margin-top: ${({ isRefreshing }) => (isRefreshing ? "64px" : "0")};
  transition: margin-top 0.3s ease;
`;

const ParallaxImageContainer = styled.div`
  position: absolute;
  width: 200%; // Ensures it's wide enough for parallax
  bottom: ${({ $alignImage }) => ($alignImage === 'bottom' ? '0' : 'auto')};
  top: ${({ $alignImage }) => ($alignImage === 'top' ? '0' : 'auto')};
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

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const RefreshIndicator = styled.div`
  position: fixed;
  top: 96px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 48px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;

  @media (min-width: 768px) {
    top: 120px;
  }

  svg {
    width: 100%;
    height: 100%;
    animation: ${spin} 1s linear infinite;
  }
`;

const Layout = ({ children, image, scrollable, contentContainerStyles, alignImage }) => {
  const backgroundImageRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentRef = useRef(null);
  const navbarRef = useRef(null);

  useEffect(() => {
    const navbar = navbarRef.current;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      isSwiping = true;
    };

    const handleTouchMove = (e) => {
      if (!isSwiping || isRefreshing) return;

      const currentY = e.touches[0].clientY;
      if (currentY - startY > 50) { // Swipe threshold
        triggerRefresh();
        isSwiping = false;
      }
    };

    const handleTouchEnd = () => {
      isSwiping = false;
    };

    navbar.addEventListener("touchstart", handleTouchStart);
    navbar.addEventListener("touchmove", handleTouchMove);
    navbar.addEventListener("touchend", handleTouchEnd);

    return () => {
      navbar.removeEventListener("touchstart", handleTouchStart);
      navbar.removeEventListener("touchmove", handleTouchMove);
      navbar.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing]);

  const triggerRefresh = () => {
    setIsRefreshing(true);

    // GSAP animation for pull-down
    gsap.to(contentRef.current, {
      y: 50,
      duration: 0.3,
      ease: "power1.out",
    });

    // Clear localStorage and refresh after a delay
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1000);

    setTimeout(() => {
      gsap.to(contentRef.current, { y: 0, duration: 0.3 });
      setIsRefreshing(false);
    }, 1200);
  };

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
    <>
      <Navbar ref={navbarRef} /> {/* Add Navbar component */}
      {isRefreshing && (
        <RefreshIndicator>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" style={{ display: "block", margin: "auto" }}>
            {/* Outer Circle */}
            <circle cx="50" cy="50" r="50" fill="#d40202" />
            <path
              d="M50 15a35 35 0 1 1-24.75 10.25"
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </RefreshIndicator>
      )}
      <Container>
        {backgroundImage && (
          <ParallaxImageContainer
            ref={backgroundImageRef}
            className="background-image"
            $alignImage={alignImage}
          >
            <GatsbyImage image={backgroundImage} alt="Background Image" />
          </ParallaxImageContainer>
        )}
        <Content style={contentContainerStyles} $scrollable={scrollable}>
          {children}
        </Content>
      </Container>
    </>
  );
}

export default Layout;