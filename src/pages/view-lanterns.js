import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { gsap } from "gsap";
import useLanternsApi from "../hooks/useLanternsApi";
import useFloatingAnimation from '../hooks/useFloatingAnimation'; // Use named import
import Layout from "../components/layout";
import Button from "../components/button"; // Import the Button component
import Lantern from "../components/Lantern"; // Import Lantern component

// Styled components

const ParentContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden; /* Prevent scrollbars and clipping */
`;

const LanternContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 150vh;
`;

const LanternWrapper = styled.div`
  position: absolute;
  transform: ${({ scale, x, y }) =>
        `translate(${x}px, ${y}px) scale(${scale})`};
  z-index: ${({ zIndex }) => zIndex};
  opacity: ${({ opacity }) => opacity};

  .gatsby-image-wrapper {
    overflow: visible;
    cursor: pointer;
  }

  img {
    max-height: 33vh;
    filter: drop-shadow(0 0 10px rgba(255, 255, 179, 0.8)); /* Add glow effect */
    transition: filter 1s ease-in-out;

    &:hover {
      filter: drop-shadow(0 0 24px rgba(255, 255, 179, 0.9)); /* Increase glow effect on hover */
      transition: filter 1s ease-in-out;
    }
  }

  transition: transform 0.3s ease-out;

  &:hover {
    transform: ${({ scale, x, y }) =>
        `translate(${x}px, ${y}px) scale(${scale * 1.05})`}; /* Slight zoom on hover */
  }

    @media (min-width: 768px) {
    img {
      max-height: 50vh;
    }
    }
`;

const CreateLanternButton = styled.div`
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const ViewLanterns = () => {
    const [lanterns, setLanterns] = useState([]);
    const [selectedLanternId, setSelectedLanternId] = useState(null); // Track the selected lantern
    const { getRandomLanterns } = useLanternsApi();
    const containerRef = useRef(null); // Ref for the container

    const fetchLanterns = async () => {
        const apiData = await getRandomLanterns(20);

        const numLanterns = apiData.length;
        const gridSize = Math.ceil(Math.sqrt(numLanterns));
        const cellWidth = window.innerWidth / gridSize;
        const cellHeight = (window.innerHeight * 1.5) / gridSize;

        const randomLanterns = apiData.map((lantern, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;

            const baseX = col * cellWidth + cellWidth / 2;
            const baseY = row * cellHeight + cellHeight / 2;

            const jitterX = (Math.random() - 0.5) * cellWidth * 0.8;
            const jitterY = (Math.random() - 0.5) * cellHeight * 0.8;

            const position = {
                x: baseX + jitterX,
                y: baseY + jitterY,
            };

            const scale = Math.random() * 0.6 + 0.2;

            const minOpacity = 0.45;
            const maxOpacity = 0.95;
            const opacity = minOpacity + (scale - 0.2) * ((maxOpacity - minOpacity) / (0.7 - 0.2));

            const zIndex = Math.round(scale * 100);

            return {
                ...lantern,
                position,
                scale,
                opacity,
                zIndex,
            };
        });

        setLanterns(randomLanterns);
    };

    useEffect(() => {
        fetchLanterns();
    }, []);

    // GSAP animation for selecting/deselecting a lantern
    const handleLanternClick = (id, ref, originalPosition, originalScale) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (selectedLanternId === id) {
            // Deselect lantern
            gsap.to(ref, {
                x: originalPosition.x,
                y: originalPosition.y,
                scale: originalScale,
                zIndex: originalPosition.zIndex,
                duration: 0.5,
                ease: "power3.out",
            });
            setSelectedLanternId(null);
        } else {
            // Deselect previously selected lantern
            if (selectedLanternId !== null) {
                const prevLantern = lanterns.find((lantern) => lantern.id === selectedLanternId);
                const prevRef = document.getElementById(`lantern-${selectedLanternId}`);
                gsap.to(prevRef, {
                    x: prevLantern.position.x,
                    y: prevLantern.position.y,
                    scale: prevLantern.scale,
                    zIndex: prevLantern.zIndex,
                    duration: 0.5,
                    ease: "power3.out",
                });
            }

            // Select new lantern
            const centerX = windowWidth / 2 - ref.offsetWidth / 2;
            const centerY = windowHeight / 2 - ref.offsetHeight / 2;

            gsap.to(ref, {
                x: centerX,
                y: centerY,
                scale: windowHeight * 0.7 / ref.offsetHeight, // Scale to 70% of viewport height
                zIndex: 999,
                duration: 0.5,
                ease: "power3.out",
            });
            setSelectedLanternId(id);
        }
    };

    const handleClickOutside = (e) => {
        if (selectedLanternId !== null) {
            const selectedLantern = lanterns.find((lantern) => lantern.id === selectedLanternId);
            const ref = document.getElementById(`lantern-${selectedLanternId}`);
            gsap.to(ref, {
                x: selectedLantern.position.x,
                y: selectedLantern.position.y,
                scale: selectedLantern.scale,
                zIndex: selectedLantern.zIndex,
                duration: 0.5,
                ease: "power3.out",
            });
            setSelectedLanternId(null);
        }
    };

    useEffect(() => {
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, [selectedLanternId]);

    useEffect(() => {
        const container = containerRef.current; // Get the container from the ref
    
        if (!container) return; // Safety check to avoid null reference
    
        const onDeviceOrientation = (event) => {
            const { beta, gamma } = event; // Get tilt values
    
            // Normalize beta and gamma values to a range of [-1, 1]
            const normalizedX = gamma / 45; // Left/right tilt (max ±45 degrees)
            const normalizedY = beta / 90; // Forward/back tilt (max ±90 degrees)
    
            // Map normalized values to x/y positions
            const x = normalizedX * 50; // Adjust the multiplier to control movement intensity
            const y = normalizedY * 50;
    
            // Animate the container
            gsap.to(container, {
                x,
                y,
                duration: 0.5,
                ease: "power3.out",
            });
        };
    
        const onMouseMove = (e) => {
            const x = (e.clientX - window.innerWidth / 2) * 0.2;
            const y = (e.clientY - window.innerHeight / 2) * 0.2;
    
            gsap.to(container, { x, y, duration: 0.5 });
        };
    
        // Attach event listeners
        if ("DeviceOrientationEvent" in window) {
            window.addEventListener("deviceorientation", onDeviceOrientation);
        } else {
            window.addEventListener("mousemove", onMouseMove);
        }
    
        // Cleanup event listeners
        return () => {
            window.removeEventListener("deviceorientation", onDeviceOrientation);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    const floatingRef = useRef(null);
    useFloatingAnimation(floatingRef, { minX: -40, maxX: 80, minY: -80, maxY: 80 });

    return (
        <Layout image="background-zodiac-sky.jpg" alignImage="top" scrollable={false}>
            <ParentContainer>
            <LanternContainer ref={containerRef}>
                {lanterns.map((lantern) => (
                    <LanternWrapper
                        key={lantern.id}
                        id={`lantern-${lantern.id}`}
                        onClick={(e) =>
                            handleLanternClick(
                                lantern.id,
                                e.currentTarget,
                                lantern.position,
                                lantern.scale
                            )
                        }
                        x={lantern.position.x}
                        y={lantern.position.y}
                        scale={lantern.scale}
                        zIndex={lantern.zIndex}
                        opacity={lantern.opacity}
                    >
                        <Lantern
                            animalSign={lantern.animal_sign}
                            alt={`Lantern for ${lantern.animal_sign}`}
                        />
                    </LanternWrapper>
                ))}
            </LanternContainer>
            </ParentContainer>
            <CreateLanternButton>
                <Button to="/create-lantern" text="Create your own lantern" />
            </CreateLanternButton>
        </Layout>
    );
};

export default ViewLanterns;