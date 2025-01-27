import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { gsap } from "gsap";
import DatePicker from "../components/datePicker";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";
import LanternPresentation from "../components/LanternPresentation";
import SocialShare from "../components/socialShare"; // Import SocialShare

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

const CreateLanternPage = () => {
  const { state, dispatch, birthdateExists } = useAppState();
  const [flowState, setFlowState] = useState('idle');
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);

  useEffect(() => {
    if (birthdateExists() && state.zodiac) {
      setFlowState('done');
    }
  }, [birthdateExists, state.zodiac]);

  const handleNextClick = () => {
    setFlowState('transitioning1');
  };

  useEffect(() => {
    if (flowState === 'transitioning1') {
      const timeline = gsap.timeline();
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
        "<"
      );

      timeline.fromTo(
        ".lantern-container",
        {
          y: "-100%",
          opacity: 0
        },
        {
          y: "0%",
          opacity: 1,
          duration: 2,
          ease: "power3.out",
          onComplete: () => setFlowState("writing"), // Move to "writing" state
        },
        "-=0.5"
      );
    }

    if (flowState === "transitioning2") {
      const timeline = gsap.timeline();

      timeline.to(
        ".background-image",
        {
          top: 0,
          duration: 8,
          ease: "power2.inOut",
        },
        "<"
      );
    }
  }, [flowState, localBirthdate, localZodiac, localElement, dispatch]);

  const handleDateSelected = (selectedDate) => {
    console.log("Selected Date:", selectedDate);
    setLocalBirthdate(selectedDate);

    const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
    setLocalZodiac(animal);
    setLocalElement(element);
  };

  // const alignImage = flowState === 'done' ? "top" : "bottom";

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage="bottom"
      scrollable={false}
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
        <LanternPresentation
          zodiac={flowState === 'done' ? state.zodiac : localZodiac}
          element={flowState === 'done' ? state.element : localElement}
          setFlowState={setFlowState}
        />
      )}
      <SocialShare /> {/* Add SocialShare component */}
    </Layout>
  );
};

export default CreateLanternPage;

export const Head = () => <SEO title="Create Lantern" />;
