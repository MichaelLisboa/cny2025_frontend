import React, { useState, useRef, useLayoutEffect, useMemo } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { gsap } from "gsap";
import DatePicker from "../components/datePicker";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";
import LanternPresentation from "../components/LanternPresentation";

const DatePickerContainer = styled.div.attrs({ className: "date-picker" })`
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

const CreateLanternPage = () => {
  const { state, dispatch, birthdateExists } = useAppState();
  
  // Compute once on mount whether a birthday exists.
  const initialBirthdayExists = useMemo(() => birthdateExists(), []);
  
  // Use flowState to control the page flow.
  // If a birthday exists initially, we skip animations and start in "writing".
  const [flowState, setFlowState] = useState(initialBirthdayExists ? "writing" : "idle");
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [shareReady, setShareReady] = useState(false);

  const datePickerRef = useRef(null);
  const lanternRef = useRef(null);

  const updateFlowState = (newState) => {
    console.log(`Flow state change: ${flowState} -> ${newState}`);
    setFlowState(newState);
  };

  // For users arriving without a birthday, we let them enter it.
  // (Flow remains "idle" until they hit Next.)
  const handleDateSelected = (selectedDate) => {
    setLocalBirthdate(selectedDate);
    const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
    setLocalZodiac(animal);
    setLocalElement(element);
    setShowNextButton(true);
  };

  const handleNextClick = () => {
    if (flowState === "transitioning1") return;
    updateFlowState("transitioning1");
  };

  // If we’re running transitioning1 (only for new users), run the animation.
  useLayoutEffect(() => {
    if (flowState !== "transitioning1") return;
    // For returning users (initialBirthdayExists is true) we skip animations.
    if (initialBirthdayExists) return;
    const runAnimation = () => {
      if (!datePickerRef.current || !lanternRef.current) {
        requestAnimationFrame(runAnimation);
        return;
      }
      const timeline = gsap.timeline({
        onComplete: () => {
          updateFlowState("writing");
        },
      });
      timeline.to(datePickerRef.current, {
        y: "100%",
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
        lanternRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 2, ease: "power3.out" },
        "-=0.5"
      );
    };
    runAnimation();
  }, [flowState, dispatch, localBirthdate, localZodiac, localElement, initialBirthdayExists]);

  // When flowState is "transitioning2", run the background animation and then set shareReady.
  useLayoutEffect(() => {
    if (flowState !== "transitioning2") return;
    gsap.to(".background-image", {
      top: 0,
      duration: 5,
      ease: "power2.inOut",
      onComplete: () => {
        console.log("Background animation complete");
        setShareReady(true);
      },
    });
  }, [flowState]);

  const renderDatePicker = () => {
    // If a birthday exists initially, we don't render the DatePicker.
    if (initialBirthdayExists) return null;
    if (flowState !== "idle" && flowState !== "transitioning1") return null;
    return (
      <DatePickerContainer ref={datePickerRef}>
        <DatePicker
          selectedBirthdate={localBirthdate}
          handleNextClick={handleNextClick}
          onDateSelected={handleDateSelected}
          title="Enter Your Birthdate"
          paragraphText="Discover your fortune for the new year!"
          buttonLabel="Next"
          showNextButton={showNextButton}
        />
      </DatePickerContainer>
    );
  };

  const renderLantern = () => {
    if (flowState === "idle") return null;
    return (
      <LanternPresentation
        ref={lanternRef}
        zodiac={state?.zodiac}
        element={state?.element}
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
      alignImage={"bottom"}
      scrollable={false}
    >
      {renderDatePicker()}
      {renderLantern()}
    </Layout>
  );
};

export default CreateLanternPage;
export const Head = () => <SEO title="Create Lantern" />;