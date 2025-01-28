import React, { useState, useRef, useEffect, useMemo } from "react";
import { getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { gsap } from "gsap";
import Button from "./button";
import useAppState from "../hooks/useAppState";
import { v4 as uuidv4 } from 'uuid';
import SocialShare from "./socialShare";
import {
  LanternContainer,
  FormContainer,
  TextAreaContainer,
  TextArea,
  CloseButton,
  ButtonContainer,
  SaveWishButton,
  ShareWishButton
} from "./LanternPresentationStyles"; // Import styled components
import { truncateWish } from "../utils/helpers"; // Import truncateWish
import Lantern from "./Lantern"; // Import Lantern component

const LanternPresentation = ({ zodiac, flowState, setFlowState, shareReady }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [wish, setWish] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const maxCharacters = 150;
  const textAreaRef = useRef(null);
  const textAreaInputRef = useRef(null);
  const paragraphRef = useRef(null);
  const { state, dispatch } = useAppState();

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

  const getImageByName = useMemo(() => {
    return (name) => {
      const image = data.allFile.edges.find(({ node }) =>
        node.relativePath.includes(name)
      );
      return image ? getImage(image.node.childImageSharp) : null;
    };
  }, [data]);

  const lanternImage = zodiac ? getImageByName(`lantern-${zodiac.toLowerCase()}.png`) : null;

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (e.target.value.length <= maxCharacters) {
      setWish(e.target.value);
    }
  };

  const handleClickOutside = (e) => {
    if (
      textAreaRef.current &&
      !textAreaRef.current.contains(e.target) &&
      !wish.trim()
    ) {
      setIsWriting(false);
    }
  };

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

  useEffect(() => {
    if (isWriting && textAreaInputRef.current) {
      textAreaInputRef.current.focus();
    }
  }, [isWriting]);

  const handleWrapperClick = (e) => {
    if (!isWriting) {
      setIsWriting(true);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const clearText = () => {
    setWish("");
  };

  const handleWishSubmit = () => {
    if (!wish.trim() || flowState !== "writing") return; 
  
    textAreaInputRef.current.blur();
  
    const newWish = { id: uuidv4(), wish };
    const updatedWishes = [...(state.wishes || []), newWish];
    dispatch({ type: "SET_WISHES", payload: updatedWishes });
  
    const timeline = gsap.timeline({
      onComplete: () => {
        setIsWriting("locked");
        setFlowState("transitioning2"); // Move to "transitioning2" after submission
      },
    });
  
    timeline.to([textAreaRef.current, ".save-wish-button"], {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
    });
  
    if (paragraphRef.current) {
      gsap.set(paragraphRef.current, { opacity: 0, scale: 0.8 });
      timeline.to(
        paragraphRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }
  };

  const handleCreateAnother = () => {
    setWish("");
    setFlowState("idle");
  };

  const characterCount = wish.length;

  return (
    <LanternContainer>
      <div className="lantern-wrapper" onClick={handleWrapperClick}>
        {isWriting && (
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
                ref={textAreaInputRef}
                placeholder="Write your wish here..."
                value={wish}
                onChange={handleInput}
                maxLength={maxCharacters}
                onInput={handleInput}
              />
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
                {characterCount}/{maxCharacters}
              </div>
            </TextAreaContainer>
            <SaveWishButton className="save-wish-button" $visible={wish.trim().length > 0}>
              <Button variant="primary" onClick={handleWishSubmit} text="Save Your Wish" />
            </SaveWishButton>
          </FormContainer>
        )}
        {lanternImage ? (
          <Lantern
            animalSign={zodiac}
            name={null}
            text={wish.length ? isWriting === "locked" && truncateWish(wish) : !isWriting && "Tap to write a wish."}
          />
        ) : (
          <p>Lantern image not found</p>
        )}
      </div>
      {shareReady && (
        <ButtonContainer>
          <Button variant="glow" onClick={() => setIsModalOpen(true)} text="Share Your Wish" />
          <Button variant="secondary" to="/fortune" text="Or Get your Fortune" />
        </ButtonContainer>
      )}
      <SocialShare wish={wish} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </LanternContainer>
  );
};

export default LanternPresentation;
