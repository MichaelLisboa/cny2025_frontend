import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { gsap } from "gsap";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Navbar from "../components/navbar"; // Import Navbar
import "./layout.css";


const Content = styled.div.attrs({ className: "layout-content" })`
  overflow-y: ${({ $scrollable }) => ($scrollable ? 'auto' : 'hidden')};
  margin-top: ${({ isRefreshing }) => (isRefreshing ? "64px" : "0")};
`;

const ParallaxImageContainer = styled.div.attrs({ className: "background-image" })`
  bottom: ${({ $alignImage }) => ($alignImage === 'bottom' ? '0' : 'auto')};
  top: ${({ $alignImage }) => ($alignImage === 'top' ? '0' : 'auto')};
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
        <div className="refresh-indicator">
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
        </div>
      )}
      <div className="layout-container">
        {backgroundImage && (
          <ParallaxImageContainer
            ref={backgroundImageRef}
            className="background-image"
            $alignImage={alignImage}
          >
            <GatsbyImage image={backgroundImage} alt="Background Image" />
          </ParallaxImageContainer>
        )}
        <Content className="layout-content" style={contentContainerStyles} $scrollable={scrollable}>
          {children}
        </Content>
      </div>
    </>
  );
}

export default Layout;