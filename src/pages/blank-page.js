import React, { useState } from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import styled from "styled-components";
import { gsap } from "gsap";
// import useLanternsApi from "../hooks/useLanternsApi";

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
};

const DivContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const BlankPage = () => {
    const [lanternsData, setLanternsData] = useState([]); // State to store lanterns fetched from API
    // const { getRandomLanterns } = useLanternsApi(); // Custom hook to fetch lantern data

    return (
        <Layout
            image="background-zodiac-sky.jpg"
            alignImage={"bottom"}
            scrollable="true"
        >
            <DivContainer>
                <h1>Blank Page</h1>
                <p>This is a blank page.</p>
            </DivContainer>
        </Layout>
    );
};

export default BlankPage;

export const Head = () => (
    <SEO title="Blank Page" />
);

