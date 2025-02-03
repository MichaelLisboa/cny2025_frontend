// fortune.js
// This is the final version of the Fortune page. It includes the following:
// - A DatePicker component that allows users to enter their birthdate
// - A ZodiacPresentation component that displays the user's zodiac sign and fortune
// - Logic to transition between the DatePicker and ZodiacPresentation components
// - Styling to create a visually appealing user experience
// - Animation effects to enhance the transition between components
// - A background image that sets the mood for the page
// - A layout component that provides a consistent design across the site
// - SEO metadata to improve search engine visibility
// - A hook to manage the application state
// - A utility function to determine the user's zodiac sign based on their birthdate
// - A data file containing information about zodiac signs and their fortunes
// - A hook to animate text sequences
// - A hook to handle user interactions with the DatePicker component

import React, { useEffect, useRef, useState, useCallback } from "react";
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
import styled from 'styled-components';

gsap.registerPlugin(Observer);
gsap.registerPlugin(TextPlugin);

const CompatibleSignsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 40px; /* Default margin for desktop */

  flex-wrap: nowrap;

  @media (max-width: 768px) {
    margin-top: 40px; /* Adjust margin for mobile */
  }

  @media (min-width: 1920px) {
    margin-top: 56px; /* Adjust margin for HD screens */
  }
`;

const CompatibleSignWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  flex-wrap: nowrap;

  .animal-name {
    margin-top: 12px;
    color: white;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }

    @media (min-width: 1920px) {
      font-size: 1rem;
    }
  }
`;

const CompatibleSignPill = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-bottom: 16px;

  flex-wrap: nowrap;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }

  @media (min-width: 1920px) {
    width: 100px;
    height: 100px;
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

  const getAnimalImageByName = useCallback(
    (name) => {
      const image = data.allFile.edges.find(({ node }) =>
        node.relativePath.includes(`zodiac-${name.toLowerCase()}.png`)
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

  console.log("currentZodiac", currentZodiac.mostCompatible);

  return (
    <div className="fortune-container">
      <h1 className="fortune-title">{`${element || "Unknown Element"} ${zodiac || "Unknown Zodiac"}`}</h1>
      <p className="fortune-body text-medium text-white text-center">{currentZodiac.story}</p>
      <div className="element-image-wrapper">
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
      </div>
      <div className="zodiac-image-wrapper">
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
      </div>
      <div className="fortune-body-section">
        <div className="positive-traits">
          {currentZodiac.positiveTraits
            ? currentZodiac.positiveTraits.split(",").map((trait, index) => (
              <div className="positive-trait-pill" key={index}>
                {trait.trim()}
              </div>
            ))
            : "No positive traits available."}
        </div>
      </div>
      <div className="fortune-body-section">
        <h3 className="fortune-title inline-header text-white">
          Career
        </h3>
        <p className="fortune-body text-medium text-white">
          {currentZodiac.careerDescription || "No career info available."}
        </p>
      </div>
      <div className="fortune-body-section">
        <h3 className="fortune-title inline-header text-white">
          Health
        </h3>
        <p className="fortune-body text-medium text-white">
          {currentZodiac.healthDescription || "No health info available."}
        </p>
      </div>
      <div className="fortune-body-section">
        <h3 className="fortune-title inline-header text-white">
          Relationships
        </h3>
        <p className="fortune-body text-medium text-white">
          {currentZodiac.relationshipDescription || "No relationship info available."}
        </p>
      </div>
      <div className="fortune-body-section">
        <h3 className="fortune-title inline-header text-white">
          Most Compatible Signs
        </h3>
        <CompatibleSignsGrid>
          {currentZodiac.mostCompatible
            ? (Array.isArray(currentZodiac.mostCompatible)
                ? currentZodiac.mostCompatible
                : currentZodiac.mostCompatible.split(",")
              ).map((sign, index) => {
                const animalImage = getAnimalImageByName(sign.trim());
                return (
                  <CompatibleSignWrapper key={index}>
                    <CompatibleSignPill>
                      {animalImage ? (
                        <GatsbyImage
                          image={animalImage}
                          alt={`${sign.trim()} zodiac`}
                          placeholder="blurred"
                          layout="fixed"
                          width={70}
                          height={70}
                        />
                      ) : (
                        sign.trim()
                      )}
                    </CompatibleSignPill>
                    <div className="animal-name">{sign.trim()}</div>
                  </CompatibleSignWrapper>
                );
              })
            : "No compatibility info available."}
        </CompatibleSignsGrid>
      </div>
      <div className="fortune-body-section">
        <h3 className="fortune-title inline-header text-white">
          Least Compatible Signs
        </h3>
        <CompatibleSignsGrid>
          {currentZodiac.leastCompatible
            ? (Array.isArray(currentZodiac.leastCompatible)
                ? currentZodiac.leastCompatible
                : currentZodiac.leastCompatible.split(",")
              ).map((sign, index) => {
                const animalImage = getAnimalImageByName(sign.trim());
                return (
                  <CompatibleSignWrapper key={index}>
                    <CompatibleSignPill>
                      {animalImage ? (
                        <GatsbyImage
                          image={animalImage}
                          alt={`${sign.trim()} zodiac`}
                          placeholder="blurred"
                          layout="fixed"
                          width={70}
                          height={70}
                        />
                      ) : (
                        sign.trim()
                      )}
                    </CompatibleSignPill>
                    <div className="animal-name">{sign.trim()}</div>
                  </CompatibleSignWrapper>
                );
              })
            : "No compatibility info available."}
        </CompatibleSignsGrid>
      </div>
    </div>
  );
};

const FortunePage = () => {
  const {state, dispatch, birthdateExists} = useAppState();
      const [flowState, setFlowState] = useState('idle');
      const [localBirthdate, setLocalBirthdate] = useState(null);
      const [localZodiac, setLocalZodiac] = useState(null);
      const [localElement, setLocalElement] = useState(null);
      const [isScrolling, setIsScrolling] = useState(true);  // Add state to track scrolling

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

      const {animal, element} = determineZodiacAnimalAndElement(selectedDate);
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
      dispatch({type: "SET_ZODIAC", payload: localZodiac });
      dispatch({type: "SET_ELEMENT", payload: localElement });
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
          <div className="date-picker">
            <DatePicker
              birthdateExists={localBirthdate}
              handleNextClick={handleNextClick}
              onDateSelected={handleDateSelected}
              title="Enter Your Birthdate"
              paragraphText="Discover your fortune for the new year!"
              buttonLabel="Next"
            />
          </div>
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
