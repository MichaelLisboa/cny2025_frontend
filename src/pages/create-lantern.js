import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import Layout from "../layouts";
import { SEO } from "../components/seo";
import { createDatePicker } from "../components/DatePicker";
import Button from "../components/Button";
import useAppState from "../hooks/useAppState";
import { determineZodiacAnimalAndElement } from "../utils/getZodiacAnimal";
import { gsap } from "gsap";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import { useFloatingAnimation } from "../utils/floatingAnimation";
import { useLanternsApi } from "../hooks/useLanternsApi";

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
  max-width: 600px;
  padding: 96px 0 72px 0;
  margin-bottom: 72px;

  @media (min-width: 1441px) {
    max-width: 1024px;
  }
`;

const LanternImageWrapper = styled.div`
  position: relative;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-height: 75vh;
  margin-bottom: 32px;
  z-index: 2;

  .gatsby-image-wrapper {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100%;
    height: 100%;
    padding: 48px;
    overflow: visible;
    cursor: pointer;
  }

  img {
    width: auto;
    height: 100%;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
    filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
    transition: filter 0.3s ease-in-out;

    &:hover {
      filter: drop-shadow(0 0 16px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
      transition: filter 1s ease-in-out;
    }
  }

  @media (min-width: 1441px) {
    .gatsby-image-wrapper {
        width: 100%;
        min-height: 75vh;
        max-height: 85vh;
    }
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

const LanternPresentation = ({ zodiac }) => {
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
  const floatingRef = useFloatingAnimation({ minX: -10, maxX: 10, minY: -20, maxY: 20 });

  return (
    <LanternContainer>
      <LanternImageWrapper ref={floatingRef}>
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
      <Title>{`${zodiac || "Unknown Zodiac"} Lantern`}</Title>
    </LanternContainer>
  );
};

const BirthdatePicker = ({ datePickerRef, birthdateExists, handleNextClick }) => (
  <DatePickerContainer className="date-picker">
    <HeaderText>Select Your Birthdate</HeaderText>
    <TextParagraph className="text-white text-medium">
      Enter your birthdate to create your custom lantern!
    </TextParagraph>
    <div ref={datePickerRef}></div>
    {birthdateExists && (
      <Button text="Next" onClick={handleNextClick} />
    )}
  </DatePickerContainer>
);

const CreateLanternPage = () => {
  const datePickerRef = useRef(null);
  const { state, dispatch, birthdateExists } = useAppState();
  const [flowState, setFlowState] = useState('idle');
  const [localBirthdate, setLocalBirthdate] = useState(null);
  const [localZodiac, setLocalZodiac] = useState(null);
  const [localElement, setLocalElement] = useState(null);

  const { getRandomLanterns } = useLanternsApi(); // Destructure the function from the hook

  // Fetch and log all lanterns when the component mounts
  useEffect(() => {
    let isMounted = true;

    const fetchLanterns = async () => {
      try {
        const lanterns = await getRandomLanterns(20);
        if (isMounted) console.log("Fetched Lanterns:", lanterns);
      } catch (error) {
        if (isMounted) console.error("Error fetching lanterns:", error);
      }
    };

    fetchLanterns();

    return () => {
      isMounted = false; // Prevent setting state if unmounted
    };
  }, [getRandomLanterns]);

  useEffect(() => {
    if (birthdateExists() && state.zodiac) {
      setFlowState('done');
    }
  }, [birthdateExists, state.zodiac]);

  const handleNextClick = () => {
    setFlowState('transitioning');
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
          onComplete: () => {
            setFlowState('done');
          },
        },
        "-=2"
      );

    }
  }, [flowState, localBirthdate, localZodiac, localElement, dispatch]);

  useEffect(() => {
    if (datePickerRef.current) {
      const datePicker = createDatePicker((selectedDate) => {
        console.log("Selected Date:", selectedDate);
        setLocalBirthdate(selectedDate);

        const { animal, element } = determineZodiacAnimalAndElement(selectedDate);
        setLocalZodiac(animal);
        setLocalElement(element);
      });
      datePickerRef.current.appendChild(datePicker);
    }
  }, []);

  const alignImage = flowState === 'done' ? "top" : "bottom";

  return (
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage={alignImage}
      scrollable="true"
    >
      {flowState !== 'done' && (
        <BirthdatePicker
          datePickerRef={datePickerRef}
          birthdateExists={localBirthdate}
          handleNextClick={handleNextClick}
        />
      )}
      {flowState !== 'idle' && (
        <LanternPresentation
          zodiac={flowState === 'done' ? state.zodiac : localZodiac}
          element={flowState === 'done' ? state.element : localElement}
        />
      )}
    </Layout>
  );
};

export default CreateLanternPage;

export const Head = () => <SEO title="Create Lantern" />;
