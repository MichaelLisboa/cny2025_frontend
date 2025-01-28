import React, { useState, useRef, useEffect, useMemo } from "react";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { gsap } from "gsap";
import useFloatingAnimation from "../hooks/useFloatingAnimation";
import Button from "./button";
import useAppState from "../hooks/useAppState";
import { v4 as uuidv4 } from 'uuid';
import SocialShare from "./socialShare";
import {
  LanternContainer,
  LanternImageWrapper,
  TextParagraph,
  WishParagraph,
  FormContainer,
  TextAreaContainer,
  TextArea,
  CloseButton,
  SaveWishButton,
  ShareWishButton
} from "./LanternPresentationStyles"; // Import styled components
import { truncateWish } from "../utils/helpers"; // Import truncateWish

const LanternPresentation = ({ zodiac, flowState, setFlowState, shareReady, setShareReady }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [wish, setWish] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasShareReady, setWasShareReady] = useState(false);
  const maxCharacters = 150;
  const textAreaRef = useRef(null);
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
  const floatingRef = useRef(null);

  useFloatingAnimation(floatingRef, { minX: -30, maxX: 30, minY: -60, maxY: 60 });

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
    if (isWriting) {
      setWasShareReady(shareReady);
      setShareReady(false);
    } else if (wasShareReady) {
      setShareReady(true);
    }
  }, [isWriting, shareReady, setShareReady, wasShareReady]);

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
    if (wish.trim()) {
      const newWish = { id: uuidv4(), wish };
      const updatedWishes = [...(state.wishes || []), newWish];
      dispatch({ type: "SET_WISHES", payload: updatedWishes });

      const timeline = gsap.timeline({
        onComplete: () => {
          setIsWriting(false);
          setFlowState("transitioning2");
        },
      });

      timeline.to([textAreaRef.current, ".save-wish-button"], {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      gsap.set(paragraphRef.current, { opacity: 0, scale: 0.8 });

      timeline.to(
        paragraphRef.current,
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
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
      <LanternImageWrapper
        ref={floatingRef}
        onClick={handleWrapperClick}
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
                onChange={handleInput}
                maxLength={maxCharacters}
                onInput={handleInput}
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
      <SocialShare wish={wish} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </LanternContainer>
  );
};

export default LanternPresentation;
