import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
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
import Button from "../components/button";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";

gsap.registerPlugin(Observer);
gsap.registerPlugin(TextPlugin);

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
`;

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

  .gatsby-image-wrapper {
    width: 100%;
    height: 100%;
  }

  img {
    width: auto;
    height: 100%;
  }
`;

const ZodiacImageWrapper = styled.div`
  position: relative;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 65vh;
  margin-bottom: 32px;
  z-index: 2;

  // add a media query to set max-height to 75vh for larger screens
  @media (min-width: 1441px) {
    max-height: 75vh;
  }

  .gatsby-image-wrapper {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100%;
    height: 100%;
  }

  img {
    width: auto;
    height: 100%;
    display: inline-block;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }
`;

const HeaderText = styled.h1`
  margin: 0;
  padding: 0;
`;

const TextParagraph = styled.p`
  margin-top: 20px;
  padding: 8px 24px;
  text-align: center;
`;

const Title = styled.h1`
  margin-top: 0;
  text-align: center;
  color: white;
`;

const FortuneTitle = styled.h3`
  opacity: 0;
  display: none;
  transition: opacity 0.5s ease-in-out;
`;

const FortuneBody = styled.p`
  opacity: 0;
  display: none;
  transition: opacity 0.5s ease-in-out;
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
              gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
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
      console.log(`Searching for image: ${name}`, image);
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

  const fortunes = [
    {
      title: "Your Yearly Outlook",
      body: currentZodiac.story || "No story available."
    },
    {
      title: "Career",
      body: currentZodiac.careerDescription || "No career info available."
    },
    {
      title: "Health",
      body: currentZodiac.healthDescription || "No health info available."
    },
    {
      title: "Relationships",
      body: currentZodiac.relationshipDescription || "No relationship info available."
    }
  ];

  useEffect(() => {
    const textElements = Array.from(document.querySelectorAll(".fortune-title, .fortune-body"));
    animateRef.current = textElements;
  }, []);

  return (
    <FortuneContainer>
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
            layout="fullWidth"
          />
        ) : (
          <p>Zodiac image not found</p>
        )}
      </ZodiacImageWrapper>
      <div className="container">
        <Title>{`${element || "Unknown Element"} ${zodiac || "Unknown Zodiac"}`}</Title>
        {fortunes.map((fortune, index) => (
          <div key={index}>
            <FortuneTitle className="fortune-title inline-header text-white">
              {fortune.title}
            </FortuneTitle>
            <FortuneBody className="fortune-body text-medium text-white">
              {fortune.body}
            </FortuneBody>
          </div>
        ))}
      </div>
    </FortuneContainer>
  );
};

const BirthdatePicker = ({ birthdateExists, handleNextClick, onDateSelected }) => (
  <DatePickerContainer className="date-picker">
    <HeaderText>Select Your Birthdate</HeaderText>
    <TextParagraph className="text-white text-medium">
      Enter your birthdate to discover your fortune for the new year!
    </TextParagraph>
    <DatePicker onDateSelected={onDateSelected} />
    {birthdateExists && (
      <Button text="Next" onClick={handleNextClick} />
    )}
  </DatePickerContainer>
);

const FortunePage = () => {
  const { state, dispatch, birthdateExists } = useAppState();
  const [flowState, setFlowState] = useState('idle');
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);

  useEffect(() => {
    if (birthdateExists() && state.zodiac && state.element) {
      setFlowState('done');
    }
  }, [birthdateExists, state.zodiac, state.element]);

  const handleNextClick = () => {
    setFlowState('transitioning');
  };

  const handleDateSelected = (selectedDate) => {
    console.log("Selected Date:", selectedDate);
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
        y: "100%",
        opacity: 0,
        duration: 2,
        ease: "power3.inOut",
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
          onComplete: () => {
            setFlowState('done');
          },
        },
        "-=2"
      );
    }
  }, [flowState, localBirthdate, localZodiac, localElement, dispatch]);

  const alignImage = flowState === 'done' ? "top" : "bottom";

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage={alignImage}
      scrollable="true"
    >
      {flowState !== 'done' && (
        <BirthdatePicker
          birthdateExists={localBirthdate}
          handleNextClick={handleNextClick}
          onDateSelected={handleDateSelected}
        />
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
