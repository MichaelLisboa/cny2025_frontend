import React, { useEffect, useState, useMemo, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import { useLanternsApi } from "../hooks/useLanternsApi";
import styled from "styled-components";
import { gsap } from "gsap";
// import Lantern from "../components/Lantern";
import useDeviceInfo from "../hooks/useDeviceInfo"; // Import the custom hook

// Configuration for lantern rendering and positioning
const LanternConfig = {
  viewportWidth: 100, // % of the screen width for lantern placement
  viewportHeight: 90, // % of the screen height for lantern placement
  defaultScale: 0.8, // Scale for the largest lantern
  minScale: 0.2, // Minimum random scale
  maxScale: 0.6, // Maximum random scale
  zIndexMultiplier: 10, // Used to scale z-index based on size
  parallaxSpeed: {
    x: 0.1, // Horizontal parallax sensitivity
    y: 0.2, // Vertical parallax sensitivity
  },
  throttleInterval: 16, // Throttling interval (~60 FPS)
  debugBorders: false, // Debugging flag to show element borders
};

/**
 * Generates random lantern data for positioning and scaling.
 * @param {number} count - Number of lanterns to generate data for.
 * @returns {Array} Array of lantern position and scaling data.
 */
const generateLanternData = (count) => {
  const positions = [];
  const { viewportWidth, viewportHeight, minScale, maxScale, zIndexMultiplier, defaultScale } = LanternConfig;

  // Initial lantern in the center of the viewport
  positions.push({
    x: viewportWidth / 2,
    y: viewportHeight / 3,
    scale: defaultScale,
    zindex: defaultScale * zIndexMultiplier,
    opacity: 1,
  });

  // Randomly generate positions for the remaining lanterns
  for (let i = 1; i < count; i++) {
    const x = Math.random() * viewportWidth;
    const y = Math.random() * (viewportHeight - 20);
    const scale = Math.random() * (maxScale - minScale) + minScale;
    const zindex = Math.round(scale * zIndexMultiplier);
    const opacity = 0.8 + scale * 0.2; // Slightly higher opacity for larger lanterns

    positions.push({ x, y, scale, zindex, opacity });
  }

  return positions;
};

// Styled components for the lantern container and parallax layer
const ParallaxContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ${LanternConfig.debugBorders ? "border: 1px solid red;" : ""} /* Optional debug borders */
`;

const LanternLayer = styled.div`
  position: relative;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 200vh;
  transition: transform 0.1s ease-out;

  @media (min-width: 1024px) {
    width: 120%; /* Adjust width for larger screens */
  }
`;

const ViewLanterns = () => {
  const [lanternsData, setLanternsData] = useState([]); // State to store lanterns fetched from API
  const { getRandomLanterns } = useLanternsApi(); // Custom hook to fetch lantern data
  const deviceInfo = useDeviceInfo(); // Device information hook (e.g., isMobile)

  // Query to fetch lantern images
  const data = useStaticQuery(graphql`
    query LanternImages {
      allFile(filter: { relativePath: { regex: "/lantern-.+\\.png$/" } }) {
        edges {
          node {
            childImageSharp {
              gatsbyImageData(width: 300, placeholder: BLURRED)
            }
            relativePath
            name
          }
        }
      }
    }
  `);

  // Memoize image mapping for performance
  const images = useMemo(() => {
    const imageMap = {};
    data.allFile.edges.forEach(({ node }) => {
      const animalName = node.name.replace("lantern-", "").replace(".png", "").toLowerCase();
      imageMap[animalName] = getImage(node.childImageSharp); // Map image data to animal names
    });
    return imageMap;
  }, [data]);

  const defaultImage = images["default"] || null; // Default fallback image

  useEffect(() => {
    const fetchLanterns = async () => {
      try {
        const data = await getRandomLanterns(20); // Fetch 20 lanterns
        setLanternsData(data);
      } catch (error) {
        console.error("Error fetching lanterns:", error);
      }
    };
    fetchLanterns();
  }, [getRandomLanterns]);

  const lanternDataRef = useRef(null); // Ref to store generated lantern data

  // Generate positions and add image references for the lanterns
  if (!lanternDataRef.current && lanternsData.length > 0) {
    const positions = generateLanternData(lanternsData.length);
    lanternDataRef.current = lanternsData
      .map((lantern, index) => {
        const { x, y, scale, zindex, opacity } = positions[index];
        const animalName = lantern.animal_sign.trim().toLowerCase();
        const image = images[animalName] || defaultImage;
        if (!image) {
          console.warn(`Image not found for animal_sign: ${lantern.animal_sign}`);
          return null; // Skip rendering lanterns without valid images
        }
        return { ...lantern, position: { x, y }, scale, zindex, opacity, image };
      })
      .filter(Boolean); // Remove invalid entries
  }

  const lanternData = lanternDataRef.current || []; // Fallback to an empty array if no data

  const layerRef = useRef(); // Ref for the parallax layer
  const lastMove = useRef(0); // Ref to throttle mouse movement events

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    if (now - lastMove.current < LanternConfig.throttleInterval) return; // Throttle the events
    lastMove.current = now;

    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * LanternConfig.parallaxSpeed.x;
    const y = (clientY - window.innerHeight / 2) * LanternConfig.parallaxSpeed.y;
    if (layerRef.current) {
      gsap.to(layerRef.current, { x, y, duration: 0.5, ease: "power2.out" });
    }
  };

  // Handle device orientation for parallax effect
  const handleDeviceOrientation = (e) => {
    if (typeof window === "undefined") return;

    const x = e.gamma * LanternConfig.parallaxSpeed.x; // Horizontal movement
    const y = e.beta * LanternConfig.parallaxSpeed.y; // Vertical movement
    if (layerRef.current) {
      gsap.to(layerRef.current, { x, y, duration: 0.5, ease: "power2.out" });
    }
  };

  // Attach and clean up event listeners for mouse and device orientation
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("deviceorientation", handleDeviceOrientation);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      };
    }
  }, []);

  return (
    <Layout image="background-zodiac-sky.jpg" alignImage="top" scrollable="false">
      <ParallaxContainer>
        <LanternLayer ref={layerRef}>
          {lanternData.map((lantern, index) => (
            <>
              {console.log(lantern.animal_sign)}
              <p key={index}>{lantern.animal_sign}</p>
            </>
          ))}
        </LanternLayer>
      </ParallaxContainer>
    </Layout>
  );
};

export default ViewLanterns;