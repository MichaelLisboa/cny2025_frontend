import { useState } from "react";
import { gsap } from "gsap";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";
import { flow } from "lodash";

const useDatePickerTransition = (dispatch, setFlowState) => {
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false); // NEW: Manage "Next" button visibility

  const handleDateSelected = (selectedDate) => {
    setLocalBirthdate(selectedDate);

    const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
    setLocalZodiac(animal);
    setLocalElement(element);

    setShowNextButton(true); // Show "Next" button after a valid date is selected
  };

  const handleNextClick = () => {
    console.log("handleNextClick");
    setFlowState("transitioning");
    console.log("Starting GSAP animation for .date-picker", localBirthdate, localZodiac, localElement);
    const timeline = gsap.timeline();

    timeline.to(".date-picker", {
      y: "350%",
      opacity: 0,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Dispatch updates to global state
        dispatch({ type: "SET_BIRTHDATE", payload: localBirthdate });
        dispatch({ type: "SET_ZODIAC", payload: localZodiac });
        dispatch({ type: "SET_ELEMENT", payload: localElement });
      },
    });
  };

  return { handleDateSelected, handleNextClick, localZodiac, localElement, showNextButton };
};

export default useDatePickerTransition;