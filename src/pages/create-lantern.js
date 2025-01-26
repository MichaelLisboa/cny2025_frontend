import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import SEO from "../components/seo";
import { gsap } from "gsap";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import useFloatingAnimation from '../hooks/useFloatingAnimation'; // Use named import
import useLanternsApi from "../hooks/useLanternsApi";
import DatePicker from "../components/datePicker";
import Button from "../components/button";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";

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

const LanternContainer = styled.div.attrs({
  className: "lantern-container", // Ensures GSAP can target it
})`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
  padding: 96px 0 32px 0;
  margin-bottom: 72px;
  overflow: visible;

  @media (min-width: 1441px) {
  padding: 128px 0 72px 0;
    max-width: 1024px;
  }
`;

const LanternImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70vh; /* 70% of the vertical viewport */
  margin-bottom: 32px;
  z-index: 1; /* Set lower stacking order for the image */

  .gatsby-image-wrapper {
    position: absolute; /* Ensure it doesn't disrupt flexbox alignment */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Ensure it is behind the text */
    pointer-events: none; /* Prevent interactions */
  }

  img {
    width: auto;
    height: 100%;
    margin: auto;
    filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
    transition: filter 0.3s ease-in-out;

    &:hover {
      filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
      transition: filter 1s ease-in-out;
    }
  }

  @media (min-width: 1441px) {
    img {
      width: auto;
      height: 100%;
      margin: auto;
      filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
      transition: filter 0.3s ease-in-out;

      &:hover {
        filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
        transition: filter 1s ease-in-out;
      }
    }
    .gatsby-image-wrapper {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1; /* Keep behind the text */
    }
  }
`;

const TextParagraph = styled.p`
  margin-top: 32px;
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 800;
  max-width: 50%;
  color: rgba(226, 127, 12, 0.6);
  z-index: 3; /* Ensure it appears above the image */
  pointer-events: none; /* Prevent interactions */
  position: relative; /* Explicitly position it for z-index to work */
  text-align: center;
  text-shadow: -1px -1px 1px rgba(226, 127, 12, 0.3); /* Subtle shadow for depth */
  mix-blend-mode: multiply; /* Blend with the lantern background */

  @media (min-width: 1441px) {
    font-size: 2.5rem;
    max-width: 30%;
  }
`;

const WishParagraph = styled.p`
  margin-top: 32px;
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 600;
  max-width: 50%;
  color: rgba(226, 127, 12, 0.8);
  z-index: 3; /* Ensure it appears above the image */
  pointer-events: none; /* Prevent interactions */
  position: relative; /* Explicitly position it for z-index to work */
  text-align: center;
  text-shadow: -1px -1px 1px rgba(226, 127, 12, 0.5); /* Subtle shadow for depth */
  mix-blend-mode: multiply; /* Blend with the lantern background */
  // opacity: 0;

  @media (min-width: 1441px) {
    font-size: 1.5rem;
    max-width: 30%;
  }
`;


const TextAreaContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  border-radius: 50px;
  z-index: 3;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.3s ease-in-out;

  &:focus {
    box-shadow: 0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.9);
  }

  @media (min-width: 1441px) {
    width: 35%;
  }
`;

const TextArea = styled.textarea`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: auto;
  max-width: 400px;
  font-size: 16px;
  font-weight: 800;
  color: rgba(226, 127, 12, 1);
  padding: 32px;
  border-radius: 32px;
  border: none;
  background: white;
  outline: none;
  text-align: center;
  background: none;
  resize: none;
  overflow: hidden;

  &::placeholder {
    font-size: 16px;
    font-weight: 800;
    color: rgba(226, 127, 12, 0.65);
    text-align: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    fill: #999;
    transition: fill 0.2s ease;
    width: 100%;
    height: 100%;
  }

  &:hover svg {
    fill: #e27f0c;
  }
`;

const SaveWishButton = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  overflow: visible;
`;

const LanternPresentation = ({ zodiac, setFlowState }) => {
  const [isWriting, setIsWriting] = useState(false); // State to toggle text area visibility
  const [wish, setWish] = useState(""); // State to capture the user's wish
  const maxCharacters = 150; // Set the maximum character limit
  const textAreaRef = useRef(null); // Reference for TextAreaContainer
  const paragraphRef = useRef(null); // Reference for TextParagraph

  // Helper function to truncate wish
  const truncateWish = (text, maxLength = 128) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

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
      return image ? getImage(image.node.childImageSharp) : null;
    },
    [data]
  );

  const lanternImage = zodiac ? getImageByName(`lantern-${zodiac.toLowerCase()}.png`) : null;
  const floatingRef = useRef(null);

  useFloatingAnimation(floatingRef, { minX: -10, maxX: 10, minY: -30, maxY: 30 });

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to calculate the new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content

    if (e.target.value.length <= maxCharacters) {
      setWish(e.target.value); // Update the wish state if within limit
    }
  };

  const handleClickOutside = (e) => {
    // If click is outside the TextAreaContainer and wish is empty
    if (
      textAreaRef.current &&
      !textAreaRef.current.contains(e.target) &&
      !wish.trim()
    ) {
      setIsWriting(false);
    }
  };

  // Add and clean up the event listener for clicks outside
  useEffect(() => {
    if (isWriting) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isWriting, wish]);

  const handleWrapperClick = (e) => {
    // Prevent toggling if already set to true
    if (!isWriting) {
      setIsWriting(true);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to wrapper
  };

  const clearText = () => {
    setWish(""); // Clear the text
  };


  const handleWishSubmit = () => {
    if (wish.trim()) {
      const timeline = gsap.timeline({
        onComplete: () => {
          setIsWriting(false); // Hide the TextAreaContainer after animation
          setFlowState("transitioning2"); // Move to the next flow state
        },
      });
  
      // Fade out both the TextAreaContainer and SaveWishButton
      timeline.to([textAreaRef.current, ".save-wish-button"], {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });
  
      // Ensure the WishParagraph starts with opacity: 0
      gsap.set(paragraphRef.current, { opacity: 0, scale: 0.8 });
  
      // Fade in the WishParagraph with a subtle scale effect
      timeline.to(
        paragraphRef.current,
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
        "-=0.5" // Overlap with the previous animation slightly
      );
    }
  };

  const handleCreateAnother = () => {
    setWish(""); // Clear the existing wish
    setFlowState("idle"); // Reset to idle state for new lantern creation
  };

  const characterCount = wish.length; // Calculate the number of characters typed


  return (
    <LanternContainer>
      <LanternImageWrapper
        ref={floatingRef}
        onClick={handleWrapperClick} // Toggle the text area on click
      >
        {isWriting ? (
          <TextAreaContainer ref={textAreaRef} onClick={stopPropagation}>
            {wish.length >= 1 && (
              <CloseButton onClick={clearText}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="12" fill="black" />
                  <path
                    d="M15.5 8.5c.3-.3.3-.8 0-1.1-.3-.3-.8-.3-1.1 0L12 9.9 9.6 7.5c-.3-.3-.8-.3-1.1 0-.3.3-.3.8 0 1.1l2.4 2.4-2.4 2.4c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0L12 12.1l2.4 2.4c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L13.1 10l2.4-2.4z"
                    fill="white"
                  />
                </svg>
              </CloseButton>
            )
            }
            <TextArea
              placeholder="Write your wish here..."
              value={wish}
              onChange={handleInput} // Dynamically adjust height
              maxLength={maxCharacters} // Enforce character limit at input level
              onInput={handleInput} // Auto-resize the textarea
            />
            <div style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
              {characterCount}/{maxCharacters}
            </div>
          </TextAreaContainer>
        ) :
          wish.length ? (
            <WishParagraph ref={paragraphRef}>{truncateWish(wish)}</WishParagraph>
          ) : (
            <TextParagraph>Tap to write your message.</TextParagraph>
          )}
        {lanternImage ? (
          <GatsbyImage
            image={lanternImage}
            alt={`${zodiac} lantern`}
            placeholder="blurred"
            layout="fullWidth"
          />
        ) : (
          <p>Lantern image not found</p>
        )}
      </LanternImageWrapper>
      <SaveWishButton className="save-wish-button">
        <Button onClick={handleWishSubmit} text="Save Your Wish" />
      </SaveWishButton>
    </LanternContainer>
  );
};

const CreateLanternPage = () => {
  const { state, dispatch, birthdateExists } = useAppState();
  const [flowState, setFlowState] = useState('idle');
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);

  // useEffect(() => {
  //   if (birthdateExists() && state.zodiac) {
  //     setFlowState('done');
  //   }
  // }, [birthdateExists, state.zodiac]);

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

  const alignImage = flowState === 'done' ? "top" : "bottom";

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage={alignImage}
      scrollable="false"
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
    </Layout>
  );
};

export default CreateLanternPage;

export const Head = () => <SEO title="Create Lantern" />;
