import React, { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import { getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { gsap } from "gsap";
import Button from "./button";
import useAppState from "../hooks/useAppState";
import { v4 as uuidv4 } from "uuid";
import SocialShare from "./socialShare";
import { truncateWish } from "../utils/helpers";
import Lantern from "./Lantern";
import styled from "styled-components";

export const LanternContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 40px 0 0 0;

  .lantern-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100vw;
  }
`;

export const FormContainer = styled.div`
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

export const TextAreaContainer = styled.div`
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
    width: 30%;
  }
`;

export const TextArea = styled.textarea`
  position: relative;
  width: 80%;
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
    color: transparent;
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

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 5;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

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

export const SaveWishButton = styled.div`
  position: relative;
  z-index: 1000;
  margin: 4px auto 24px;
  overflow: visible;
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const ShareButton = styled(Button)`
  margin: 132px !important;
`;

export const ButtonsContainer = styled.div`
  position: absolute;
  bottom: 10vh;
  z-index: 999;
  margin: 0 auto 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

const LanternPresentation = forwardRef(({ zodiac, flowState, setFlowState, shareReady }, ref) => {
  const [isWriting, setIsWriting] = useState(false);
  const [wish, setWish] = useState("");
  const [showSocialShare, setShowSocialShare] = useState(false); // Ensure it's false by default
  const maxCharacters = 150;
  const textAreaRef = useRef(null);
  const textAreaInputRef = useRef(null);
  const paragraphRef = useRef(null);
  const saveWishButtonRef = useRef(null);
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

  const imageMap = useMemo(() => {
    return data.allFile.edges.reduce((map, { node }) => {
      map[node.relativePath] = getImage(node.childImageSharp);
      return map;
    }, {});
  }, [data]);

  const lanternImage = imageMap[`lantern-${zodiac?.toLowerCase()}.png`];

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
      // Cancel writing if no wish is entered
      setIsWriting(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
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
    // When tapped, begin writing: set isWriting true and clear lantern text by showing empty text
    !shareReady &&
    setIsWriting(true);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const clearText = () => {
    setWish("");
  };

  const generateWish = () => ({
    id: uuidv4(),
    wish,
  });

  const handleWishSubmit = () => {
    if (!wish.trim() || flowState !== "writing") return;

    const isDuplicate = state.wishes.some(w => w.wish === newWish.wish);
    if (isDuplicate) {
        console.warn("Duplicate wish detected, skipping...");
        return; 
    }

    const newWish = generateWish();

    dispatch({
        type: "SET_WISHES",
        payload: [...state.wishes, newWish] 
    });

    const timeline = gsap.timeline({
        onComplete: () => {
            setIsWriting(false);
            setFlowState("transitioning2");
        },
    });

    timeline.to([textAreaRef.current, saveWishButtonRef.current], {
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

  const characterCount = wish.length;

  console.log('shareReady:', shareReady, 'showSocialShare:', showSocialShare);

  return (
    <LanternContainer ref={ref}>
      <div className="lantern-wrapper" onClick={handleWrapperClick}>
        {isWriting && (
          <FormContainer>
            <TextAreaContainer ref={textAreaRef} onClick={stopPropagation}>
              {wish.length > 0 && (
                <CloseButton onClick={clearText}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
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
                disabled={!isWriting}
                style={{
                  pointerEvents: !isWriting ? "none" : "auto",
                  opacity: !isWriting ? 0.5 : 1,
                }}
              />
              <div style={{ marginTop: "10px", fontSize: "14px", color: "#999" }}>
                {characterCount}/{maxCharacters}
              </div>
            </TextAreaContainer>
            <SaveWishButton ref={saveWishButtonRef} $visible={wish.trim().length > 0}>
              <Button variant="primary" onClick={handleWishSubmit} text="Save Your Wish" />
            </SaveWishButton>
          </FormContainer>
        )}
        {lanternImage ? (
          <Lantern
            animalSign={zodiac}
            name={null}
            text={
              isWriting
                ? ""
                : wish.length > 0
                  ? truncateWish(wish)
                  : "Tap to write a wish."
            }
          />
        ) : (
          <p>Lantern image not found</p>
        )}
      </div>
      {shareReady && (
        <ButtonsContainer>
          <ShareButton variant="glow" onClick={() => setShowSocialShare(true)} text="Share Your Wish" />
          <ShareButton variant="secondary" to="/fortune" text="Or Get your Fortune" />
        </ButtonsContainer>
      )}
      {showSocialShare && (
        <SocialShare wish={wish} lanternId={null} isOwner={true} />
      )}
    </LanternContainer>
  );
});

export default LanternPresentation;