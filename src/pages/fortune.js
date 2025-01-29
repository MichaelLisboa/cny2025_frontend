import React, { useEffect, useRef, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo"; // Ensure correct import
import { zodiacData } from "../data/fortune-data";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Observer } from "gsap/Observer";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import useAnimateTextSequence from "../hooks/useAnimateTextSequence";
import DatePicker from "../components/datePicker";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";

gsap.registerPlugin(Observer);
gsap.registerPlugin(TextPlugin);

const FortuneContainer = styled.div.attrs({
  className: "fortune-container", // Ensures GSAP can target it
})`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  max-width: 600px;
  padding: 96px 0 72px 0;
  margin-bottom: 72px;

  @media (min-width: 1441px) {
    max-width: 1024px;
  }
`;

const ElementImageWrapper = styled.div`
  position: absolute;
  top: -120px;
  left: -120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 55vh;
  z-index: 1;
  opacity: 0.5;
  // color filter to make the image look more like a watermark
  filter: grayscale(100%) brightness(0.5);

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }

  img {
    width: auto;
    height: 100%;
  }
`;

const pulse = keyframes`
  0% {
    filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.5));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 32px rgba(255, 255, 179, 0.4));
    transform: scale(1.01);
  }
  100% {
    filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.5));
    transform: scale(1);
  }
`;

const ZodiacImageWrapper = styled.div`
  position: relative;
  width: 75%;
  max-height: 65vh;
  aspect-ratio: 3 / 4; /* Keeps the shape proportional */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  .gatsby-image-wrapper {
    height: 100%; /* Ensure it fills the vertical space */
    display: flex;
    align-items: center;
    justify-content: center; /* Centers the image horizontally */
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

const Title = styled.h1`
  margin: 0 auto;
  text-align: center;
  color: white;
`;

const FortuneBodySection = styled.div`
  margin: 24px 0;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const FortuneTitle = styled.h3`
  // opacity: 0;
  // display: none;
  transition: opacity 0.5s ease-in-out;
`;

const FortuneBody = styled.p`
  // opacity: 0;
  // display: none;
  // transition: opacity 0.5s ease-in-out;
`;

const DatePickerContainer = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  max-width: 600px;
  text-align: center;
  z-index: 2;

  @media (min-width: 1441px) {
    max-width: 1024px;
  }

  &.date-picker {
    transition: transform 2s ease, opacity 2s ease;
  }
`;

const PositiveTraitPill = styled.div`
  display: inline-block;
  padding: 2px 8px;
  margin: 0 8px;
  border-radius: 9999px;
  background-color:rgba(255, 249, 190, 0.6);
  color: rgba(69, 22, 0, 0.8);
  font-size: 1rem;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6);
  animation: ${pulse} 3s infinite ease-in-out;

  @media (min-width: 768px) {
    padding: 8px 16px;
    margin: 8px 16px;
    font-size: 1.25rem;
  }

  @media (min-width: 1440px) {
    padding: 12px 24px;
    margin: 12px 24px;
    font-size: 1.5rem;
  }
`;

const ZodiacPresentation = ({ zodiac, element }) => {

  const animateRef = useAnimateTextSequence({
    waveSpeed: 0.02,
    fadeDuration: 0.25,
    startDelay: 0.5
  });

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

  const getImageByName = useCallback(
    (name) => {
      const image = data.allFile.edges.find(({ node }) =>
        node.relativePath.includes(name)
      );
      return image ? getImage(image.node.childImageSharp) : null;
    },
    [data]
  );

  const elementImage = element ? getImageByName(`element-${element.toLowerCase()}.png`) : null;
  const zodiacImage = zodiac ? getImageByName(`zodiac-${zodiac.toLowerCase()}.png`) : null;

  const currentZodiac =
    zodiacData.find(
      (item) => item.slug.toLowerCase() === (zodiac || "").toLowerCase()
    ) || {};

  useEffect(() => {
    const textElements = Array.from(document.querySelectorAll(".fortune-title, .fortune-body"));
    animateRef.current = textElements;
  }, []);

  return (
    <FortuneContainer>
      <Title className="fortune-title">{`${element || "Unknown Element"} ${zodiac || "Unknown Zodiac"}`}</Title>
      <p className="fortune-body text-medium text-white text-center">{currentZodiac.story}</p>
      <ElementImageWrapper>
        {elementImage ? (
          <GatsbyImage
            image={elementImage}
            alt={`${element} element`}
            placeholder="blurred"
            layout="fullWidth"
          />
        ) : (
          <p>Element image not found</p>
        )}
      </ElementImageWrapper>
      <ZodiacImageWrapper>
        {zodiacImage ? (
          <GatsbyImage
            image={zodiacImage}
            alt={`${zodiac} zodiac`}
            placeholder="blurred"
            layout="constrained"
          />
        ) : (
          <p>Zodiac image not found</p>
        )}
      </ZodiacImageWrapper>
      <div>
        <FortuneBodySection>
          <div className="fortune-body text-medium text-white">
            {currentZodiac.positiveTraits
              ? currentZodiac.positiveTraits.split(",").map((trait, index) => (
                <PositiveTraitPill key={index}>
                  {trait.trim()}
                </PositiveTraitPill>
              ))
              : "No positive traits available."}
          </div>
        </FortuneBodySection>
        <FortuneBodySection>
          <FortuneTitle className="fortune-title inline-header text-white">
            Career
          </FortuneTitle>
          <FortuneBody className="fortune-body text-medium text-white">
            {currentZodiac.careerDescription || "No career info available."}
          </FortuneBody>
        </FortuneBodySection>
        <FortuneBodySection>
          <FortuneTitle className="fortune-title inline-header text-white">
            Health
          </FortuneTitle>
          <FortuneBody className="fortune-body text-medium text-white">
            {currentZodiac.healthDescription || "No health info available."}
          </FortuneBody>
        </FortuneBodySection>
        <FortuneBodySection>
          <FortuneTitle className="fortune-title inline-header text-white">
            Relationships
          </FortuneTitle>
          <FortuneBody className="fortune-body text-medium text-white">
            {currentZodiac.relationshipDescription || "No relationship info available."}
          </FortuneBody>
        </FortuneBodySection>
      </div>
    </FortuneContainer>
  );
};

const FortunePage = () => {
  const { state, dispatch, birthdateExists } = useAppState();
  const [flowState, setFlowState] = useState('idle');
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);  // Add state to track scrolling

  useEffect(() => {
    if (birthdateExists() && state.zodiac && state.element) {
      setFlowState('done');
      setIsScrolling(true);
    }
  }, [birthdateExists, state.zodiac, state.element]);

  const handleNextClick = () => {
    setFlowState('transitioning');
  };

  const handleDateSelected = (selectedDate) => {
    setLocalBirthdate(selectedDate);

    const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
    setLocalZodiac(animal);
    setLocalElement(element);
  };

  useEffect(() => {
    if (flowState === 'transitioning') {
      const timeline = gsap.timeline();

      timeline.to(
        ".background-image",
        {
          top: 0,
          duration: 5,
          ease: "power2.inOut",
        },
        "<"
      );

      timeline.to(".date-picker", {
        y: "350%",
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          dispatch({ type: "SET_BIRTHDATE", payload: localBirthdate });
          dispatch({ type: "SET_ZODIAC", payload: localZodiac });
          dispatch({ type: "SET_ELEMENT", payload: localElement });
        },
      },
        "-=4.5"
      );

      timeline.fromTo(
        ".fortune-container",
        {
          y: "-100%",
          opacity: 0
        },
        {
          y: "0%",
          opacity: 1,
          duration: 2,
          ease: "power3.out",
          clearProps: "transform",
          onComplete: () => { 
            setFlowState('done');
            setIsScrolling(true);
          }
        },
        "-=2"
      );
    }
  }, [flowState]);

  const alignImage = flowState === 'done' ? "top" : "bottom";

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage={alignImage}
      scrollable={isScrolling}
    >
      {flowState !== 'done' && (
        <DatePickerContainer className="date-picker">
          <DatePicker
            birthdateExists={localBirthdate}
            handleNextClick={handleNextClick}
            onDateSelected={handleDateSelected}
            title="Enter Your Birthdate"
            paragraphText="Discover your fortune for the new year!"
            buttonLabel="Next"
          />
        </DatePickerContainer>
      )}
      {flowState !== 'idle' && (
        <ZodiacPresentation
          zodiac={flowState === 'done' ? state.zodiac : localZodiac}
          element={flowState === 'done' ? state.element : localElement}
        />
      )}
    </Layout>
  );
};

export default FortunePage;

export const Head = () => <SEO title="Fortune" />;
