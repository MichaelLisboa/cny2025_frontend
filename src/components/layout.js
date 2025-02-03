import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import { graphql, useStaticQuery } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Navbar from "../components/navbar";
import OrientationOverlay from "../utils/orientation";
// import DeviceOrientationPermission from "../utils/requestIosPermissions";
import "./layout.css";


const Content = styled.div.attrs({ className: "layout-content" })`
  overflow-y: ${({ $scrollable }) => ($scrollable ? 'auto' : 'hidden')};
  margin-top: ${({ isRefreshing }) => (isRefreshing ? "64px" : "0")};
`;

const ParallaxImageContainer = ({ alignImage, backgroundImageRef, children }) => {
  return (
    <div
      ref={backgroundImageRef}
      className="background-image"
      style={{
        top: alignImage === "top" ? "0" : "auto",
        bottom: alignImage === "bottom" ? "0" : "auto",
      }}
    >
      {children}
    </div>
  );
};

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
    if (typeof window === "undefined" || !backgroundImageRef.current || !backgroundImage) return;
  
    const imgElement = backgroundImageRef.current;
    const imageWidth = imgElement.scrollWidth || imgElement.offsetWidth || 0;
    const viewportWidth = window.innerWidth;
  
    if (!imageWidth || !viewportWidth) return;
  
    const maxMoveX = imageWidth - viewportWidth;
  
    // Center the image initially once
    gsap.set(imgElement, { x: 0 });
  
    const handleBackgroundMovement = (moveX) => {
      const constrainedMoveX = Math.max(0, Math.min(maxMoveX, moveX));
  
      gsap.to(imgElement, {
        x: -constrainedMoveX,
        duration: 0.3,
        ease: "power2.out",
      });
    };
  
    const handleMouseMove = (event) => {
      const moveX = (event.clientX / viewportWidth) * maxMoveX;
      handleBackgroundMovement(moveX);
    };
  
    let touchMoveRAF;
    const handleTouchMove = (event) => {
      if (touchMoveRAF) return;
  
      touchMoveRAF = requestAnimationFrame(() => {
        const touch = event.touches[0];
        const moveX = (touch.clientX / viewportWidth) * maxMoveX;
        handleBackgroundMovement(moveX);
        touchMoveRAF = null;
      });
    };
  
    let orientationTimeout;
    const handleDeviceOrientation = (event) => {
      clearTimeout(orientationTimeout);
      orientationTimeout = setTimeout(() => {
        const gamma = Math.max(-90, Math.min(90, event.gamma));
        const moveX = ((gamma + 90) / 180) * maxMoveX;
        handleBackgroundMovement(moveX);
      }, 16);
    };
  
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
  
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [backgroundImage]);

  return (
    <>
      <OrientationOverlay />
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
          <ParallaxImageContainer alignImage={alignImage} backgroundImageRef={backgroundImageRef}>
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