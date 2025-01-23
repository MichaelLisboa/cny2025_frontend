import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import styled from "styled-components"
import Layout from "../layouts"
import { SEO } from "../components/seo"
import { navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import threeSkyScene from "../components/threeSkyScene"
import Button from "../components/Button"
import CrowdScene from "../components/crowdScene"

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

  // Use a state variable to determine if it's mobile
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    // This logic will only run in the browser
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth <= 768);

      const mainContainer = mainContainerRef.current;

      // Initialize the Three.js scene
      threeSkyScene(mainContainer, window.innerWidth <= 768);

      // Create GSAP timeline for animations
      const tl = gsap.timeline();

      // Fade in the main container using GSAP
      tl.fromTo(contentContainerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 })
        .fromTo(imageWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75")
        .fromTo(textDivRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75")
        .fromTo(buttonWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "-=0.75");

      // Apply floating animation to the main container
      const createFloatingAnimation = ({ minX, maxX, minY, maxY }) => {
        return (element) => {
          gsap.to(element, {
            x: `random(${minX}, ${maxX})`,
            y: `random(${minY}, ${maxY})`,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        };
      };

      const containerAnimation = createFloatingAnimation({
        minX: -5,
        maxX: 5,
        minY: -10,
        maxY: 10,
      });
      containerAnimation(contentContainerRef.current);
    }
  }, []);

  return (
    <Layout alignImage="bottom">
      <div id="main-container" ref={mainContainerRef}>
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
