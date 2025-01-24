import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo" // Corrected import statement
import { navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import ThreeSkyScene from '../components/threeSkyScene'
import Button from "../components/button"
import CrowdScene from "../components/crowdScene"
import useDeviceInfo from '../hooks/useDeviceInfo';
import useFloatingAnimation from '../hooks/useFloatingAnimation';

const ContentContainer = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 80%;
  padding: 128px 0;
  max-width: 600px;
  opacity: 1; /* Set initial opacity to 1 */
  z-index: 2;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  height: auto;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 80vw;
  }

  @media (min-width: 769px) {
    width: 30vw;
  }
`;

const TextDiv = styled.div`
  text-align: center;
  margin-top: 1rem;
  opacity: 0;
`;

const ButtonWrapper = styled.div`
  opacity: 0;
  margin-top: 1rem;
`;

const IndexPage = () => {
  const contentContainerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const textDivRef = useRef(null);
  const buttonWrapperRef = useRef(null);
  const mainContainerRef = useRef(null);

  const { isMobile } = useDeviceInfo();
  const [xOffset, setXOffset] = useState(0);

  useFloatingAnimation(contentContainerRef, {
    minX: -5,
    maxX: 5,
    minY: -10,
    maxY: 10,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create GSAP timeline for animations
    const tl = gsap.timeline();

    // Fade in the main container using GSAP
    tl.fromTo(contentContainerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(imageWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75")
      .fromTo(textDivRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75")
      .fromTo(buttonWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75");

    // Example: track mouse movement across screen width
    const handleMouseMove = event => {
      const offset = event.clientX / window.innerWidth;
      setXOffset(offset);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  console.log('index.js isMobile:', isMobile);

  return (
    <Layout alignImage="bottom">
      <div id="main-container" ref={mainContainerRef}>
      <ThreeSkyScene isMobile={isMobile} />
        <CrowdScene />
        <ContentContainer ref={contentContainerRef}>
          <ImageWrapper ref={imageWrapperRef}>
            <StaticImage
              src="../images/logo-text.png"
              alt="Logo Text"
              placeholder="none"
            />
          </ImageWrapper>
          <TextDiv ref={textDivRef}>
            <p className="text-medium text-white">
              Share wishes with your loved ones, slithering into the new year with hope, wisdom, and lucky fortunes.
            </p>
          </TextDiv>
          <ButtonWrapper ref={buttonWrapperRef}>
            <Button text="Continue" onClick={() => navigate('/create-lantern')} />
          </ButtonWrapper>
        </ContentContainer>
      </div>
    </Layout>
  );
};

export default IndexPage

export const Head = () => (
  <SEO />
)
