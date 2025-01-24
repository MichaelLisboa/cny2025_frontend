import React, { useEffect, useState, useMemo, useRef } from "react";
import { graphql, useStaticQuery } from "gatsby";
import { getImage } from "gatsby-plugin-image";
import Layout from "../components/layout"
import { useLanternsApi } from "../hooks/useLanternsApi";
import styled from "styled-components";
import { gsap } from "gsap";
import Lantern from "../components/Lantern";
import useDeviceInfo from "../hooks/useDeviceInfo"; // Import the custom hook

// import { LanternConfig } from "../config/lanternConfig";

// lanternConfig.js

/**
 * Configuration for lantern rendering and positioning.
 * Adjust these constants to tweak the visual and functional aspects of the lantern display.
 */
const LanternConfig = {
  // Viewport dimensions (percentage)
  viewportWidth: 100, // % of the screen width to consider for lantern placement
  viewportHeight: 90, // % of the screen height (max range for lantern positions)

  // Lantern scaling
  defaultScale: 0.8, // Default scale for the largest lantern
  minScale: 0.2, // Minimum random scale for smaller lanterns
  maxScale: 0.6, // Maximum random scale

  // Z-index scaling
  zIndexMultiplier: 10, // Used to scale z-index based on size

  // Parallax sensitivity
  parallaxSpeed: {
    x: 0.1, // Horizontal parallax speed factor
    y: 0.2, // Vertical parallax speed factor
  },

  // Throttling for mouse move
  throttleInterval: 16, // ~60 FPS throttling for mouse move event

  // Debugging
  debugBorders: false, // Enable/disable debug borders
};

const generateLanternData = (count) => {
  const positions = [];
  const { viewportWidth, viewportHeight, minScale, maxScale, zIndexMultiplier, defaultScale } = LanternConfig;

  // Example positions for a few lanterns
  positions.push({
    x: viewportWidth / 2,
    y: viewportHeight / 3,
    scale: defaultScale,
    zindex: defaultScale * zIndexMultiplier,
    opacity: 1,
  });

  for (let i = 1; i < count; i++) {
    const x = Math.random() * viewportWidth;
    const y = Math.random() * (viewportHeight - 20);
    const scale = Math.random() * (maxScale - minScale) + minScale;
    const zindex = Math.round(scale * zIndexMultiplier);
    const opacity = 0.8 + scale * 0.2;

    positions.push({ x, y, scale, zindex, opacity });
  }

  return positions;
};

const ParallaxContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  ${LanternConfig.debugBorders ? "border: 1px solid red;" : ""}
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
    width: 120%;
  }
`;

const ViewLanterns = () => {
  const [lanternsData, setLanternsData] = useState([]);
  const { getRandomLanterns } = useLanternsApi();
  const deviceInfo = useDeviceInfo(); // Use the custom hook

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

  const images = useMemo(() => {
    const imageMap = {};
    data.allFile.edges.forEach(({ node }) => {
      const animalName = node.name.replace("lantern-", "").replace(".png", "").toLowerCase();
      imageMap[animalName] = getImage(node.childImageSharp);
    });
    return imageMap;
  }, [data]);

  const defaultImage = images["default"] || null;

  useEffect(() => {
    const fetchLanterns = async () => {
      try {
        const data = await getRandomLanterns(20);
        setLanternsData(data);
      } catch (error) {
        console.error("Error fetching lanterns:", error);
      }
    };
    fetchLanterns();
  }, [getRandomLanterns]);

  const lanternDataRef = useRef(null);

  if (!lanternDataRef.current && lanternsData.length > 0) {
    const positions = generateLanternData(lanternsData.length);
    lanternDataRef.current = lanternsData.map((lantern, index) => {
      const { x, y, scale, zindex, opacity } = positions[index];
      const animalName = lantern.animal_sign.trim().toLowerCase();
      const image = images[animalName] || defaultImage;
      if (!image) {
        console.warn(`Image not found for animal_sign: ${lantern.animal_sign}`);
        return null;
      }
      return { ...lantern, position: { x, y }, scale, zindex, opacity, image };
    }).filter(Boolean);
  }

  const lanternData = lanternDataRef.current || [];

  const layerRef = useRef();
  const lastMove = useRef(0);

  const handleMouseMove = (e) => {
    if (typeof window === "undefined") return;

    const now = Date.now();
    if (now - lastMove.current < LanternConfig.throttleInterval) return;
    lastMove.current = now;

    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) * LanternConfig.parallaxSpeed.x;
    const y = (clientY - window.innerHeight / 2) * LanternConfig.parallaxSpeed.y;
    if (layerRef.current) {
      gsap.to(layerRef.current, { x, y, duration: 0.5, ease: "power2.out" });
    }
  };

  const handleDeviceOrientation = (e) => {
    if (typeof window === "undefined") return;

    const x = e.gamma * LanternConfig.parallaxSpeed.x;
    const y = e.beta * LanternConfig.parallaxSpeed.y;
    if (layerRef.current) {
      gsap.to(layerRef.current, { x, y, duration: 0.5, ease: "power2.out" });
    }
  };

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
    <Layout
      image="background-zodiac-sky.jpg"
      alignImage="top"
      scrollable="false"
    >
      <ParallaxContainer>
        <LanternLayer ref={layerRef}>
          {lanternData.map((lantern, index) => (
            <Lantern
              key={index}
              x={lantern.position.x}
              y={lantern.position.y}
              scale={lantern.scale}
              zindex={lantern.zindex}
              opacity={lantern.opacity}
              image={lantern.image}
              alt={`Lantern for ${lantern.animal_sign}`}
            />
          ))}
        </LanternLayer>
      </ParallaxContainer>
    </Layout>
  );
};

export default ViewLanterns;