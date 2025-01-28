import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { gsap } from "gsap";
import DatePicker from "../components/datePicker";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";
import LanternPresentation from "../components/LanternPresentation";
import SocialShare from "../components/socialShare";

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
  const [shareReady, setShareReady] = useState(false); // State to control the visibility of the share button

  const updateFlowState = (newState) => {
    if (flowState !== newState) {
      setFlowState(newState);
    }
  };

  useEffect(() => {
    const isBirthdateAvailable = birthdateExists();
    if (isBirthdateAvailable && state.zodiac && flowState === 'idle') {
      // updateFlowState('done');
      updateFlowState("writing");
    }
  }, [state.zodiac, flowState]);

  const handleNextClick = () => {
    updateFlowState('transitioning1');
  };

  useEffect(() => {
    if (flowState === "transitioning1") {
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
      });

      timeline.fromTo(
        ".lantern-container",
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 2, ease: "power3.out" },
        "-=0.5"
      ).add(() => updateFlowState("writing")); // Ensure "writing" is set here
    }

    if (flowState === "transitioning2") {
      const timeline = gsap.timeline();

      timeline.to(".background-image", {
        top: 0,
        duration: 8,
        ease: "power2.inOut",
      }).add(() => {
        updateFlowState("done"); // Ensure "done" state is reached
        setShareReady(true);
      });
    }
  }, [flowState]);

  const handleDateSelected = (selectedDate) => {
    setLocalBirthdate(selectedDate);

    const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
    setLocalZodiac(animal);
    setLocalElement(element);
  };

  const renderDatePicker = () => {
    if (flowState !== "idle" && flowState !== "transitioning1") return null;
    if (birthdateExists()) return null; // Prevent rendering if birthdate is already set
    return (
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
    );
  };

  const renderLantern = () => {
    if (flowState === "idle") return null;
    console.log(state, localZodiac, localElement);
    return (
      <LanternPresentation
        zodiac={state && state.zodiac}
        element={state && state.element}
        flowState={flowState}
        setFlowState={updateFlowState}
        shareReady={shareReady}
        setShareReady={setShareReady}
      />
    );
  };

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage="bottom"
      scrollable={false}
    >
      {renderDatePicker()}
      {renderLantern()}
      <SocialShare />
    </Layout>
  );
};

export default CreateLanternPage;

export const Head = () => <SEO title="Create Lantern" />;
