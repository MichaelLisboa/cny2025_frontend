import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { gsap } from "gsap";
import useFloatingAnimation from "../hooks/useFloatingAnimation";
import Button from "./button";
import useAppState from "../hooks/useAppState";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique identifiers
import SocialShare from "./socialShare";

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
  z-index: 1; /* Set lower stacking order for the image */

  .gatsby-image-wrapper {
    position: absolute; /* Ensure it doesn't disrupt flexbox alignment */
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-height: 70vh; /* 70% of the vertical viewport */
    z-index: 1; /* Ensure it is behind the text */
    pointer-events: none; /* Prevent interactions */
    overflow: visible;
  }

  img {
    width: auto;
    height: 100%
    margin: auto;
    filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
    transition: filter 0.3s ease-in-out;

    &:hover {
      filter: drop-shadow(0 0 24px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
      transition: filter 0.3s ease-in-out;
    }
  }

  @media (min-width: 1441px) {
    img {
      width: auto;
      height: 90%;
      margin: auto;
      filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
      transition: filter 0.3s ease-in-out;

      &:hover {
        filter: drop-shadow(0 0 24px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
        transition: filter 0.3s ease-in-out;
      }
    }
    .gatsby-image-wrapper {
      position: absolute;
      left: 0;
      transform: translateX(0);
      width: 100%;
      max-height: 80vh;
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

const FormContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 3;
`;

const TextAreaContainer = styled.div`
  position: relative;
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
    width: 60%;
  }
`;

const TextArea = styled.textarea`
  position: relative;
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
    color: rgba(226, 127, 12, 0.65);
    text-align: center;
  }

  &:focus::placeholder {
    color: transparent; /* Make placeholder text disappear on focus */
  }

  @media (min-width: 768px) {
    font-size: 1.75em;
    width: 100%;
    max-width: 640px;
  }

  @media (min-width: 1440px) {
    font-size: 2em;
    width: 100%;
    max-width: 640px;
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
  position: relative;
  z-index: 1000;
  margin: 4px auto 24px;
  overflow: visible;
  display: ${({ visible }) => (visible ? 'block' : 'none')}; /* Conditionally render based on visibility */
`;

const ShareWishButton = styled.div`
  position: relative;
  z-index: 1000;
  bottom: 32px;
  margin: 4px auto 24px;
  overflow: visible;
`;

const LanternPresentation = ({ zodiac, flowState, setFlowState, shareReady, setShareReady }) => {
  const [isWriting, setIsWriting] = useState(false); // State to toggle text area visibility
  const [wish, setWish] = useState(""); // State to capture the user's wish
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal visibility
  const maxCharacters = 150; // Set the maximum character limit
  const textAreaRef = useRef(null); // Reference for TextAreaContainer
  const paragraphRef = useRef(null); // Reference for TextParagraph
  const { state, dispatch } = useAppState(); // Use the useAppState hook

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

  const lanternImage = zodiac ? getImageByName(`lantern-${zodiac.toLowerCase()}.png`) : null;
  const floatingRef = useRef(null);

  useFloatingAnimation(floatingRef, { minX: -30, maxX: 30, minY: -60, maxY: 60 });

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

      // Save the wish to localStorage using useAppState
      const newWish = { id: uuidv4(), wish }; // Add a unique identifier to the wish
      const updatedWishes = [...(state.wishes || []), newWish]; // Ensure state.wishes is an array
      dispatch({ type: "SET_WISHES", payload: updatedWishes });

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

  console.log("STATES", { flowState, isWriting, wish, shareReady });

  return (
    <LanternContainer>
      <LanternImageWrapper
        ref={floatingRef}
        onClick={handleWrapperClick} // Toggle the text area on click
      >
        {isWriting ? (
          <FormContainer>
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
              )}
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
            <SaveWishButton className="save-wish-button" visible={wish.trim().length > 0}>
              <Button onClick={handleWishSubmit} text="Save Your Wish" />
            </SaveWishButton>

          </FormContainer>
        ) : wish.length ? (
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
      {shareReady && (
      <ShareWishButton>
        <Button onClick={() => setIsModalOpen(true)} text="Share Your Wish" />
      </ShareWishButton>
      )}
      <SocialShare isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </LanternContainer>
  );
};

export default LanternPresentation;
