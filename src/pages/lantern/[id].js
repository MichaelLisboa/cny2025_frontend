// [id].js

import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Layout from "../../components/layout";
import Lantern from "../../components/Lantern";
import Button from "../../components/button";
import useAppState from "../../hooks/useAppState"; // Keep client-side logic
import SocialShare from "../../components/socialShare"; // Social share modal
import { Helmet } from "react-helmet";

const LanternContainer = styled.div`
    position: relative;
    display: flex; // Changed from inline-block to flex
    height: 100vh;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 36px 0 0 0;
`;

export const ButtonContainer = styled.div`
  position: relative;
  z-index: 10000;
  bottom: 5vh;
//   margin: 4px auto 24px;
  overflow: visible;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export async function getServerData({ params }) {
    console.log("Fetching data for ID:", params.id);
    try {
        const { data } = await axios.get(
            `https://cny2025backend-production.up.railway.app/lanterns/${params.id}`,
            {
                headers: { "X-API-Key": process.env.GATSBY_API_KEY },
            }
        );
        console.log("Fetched data:", params.id, data);
        return { props: { lantern: data || null } }; // Ensure lantern is never undefined
    } catch (error) {
        console.error("Failed to load lantern:", error, error.message);
        return {
            status: 500,
            props: { error: "Failed to load lantern. Please try again later." },
        };
    }
}

export function Head({ serverData }) {
    const baseUrl = "https://cny2025.michaellisboa.com";
    const lantern = serverData.lantern || { name: "A Friend", id: "unknown", message: "Happy New Year!" };
    const description = "Create lanterns to share with colleagues, friends and family.";
    const url = `${baseUrl}/lantern/${lantern.id}`;
    const image = `${baseUrl}/og-meta.jpg`;

    const SocialTitleText = `${serverData.lantern.name} released a wishing lantern! "${serverData.lantern.message}" `;

    return (
        <>
            <title>{SocialTitleText}</title>
            <meta name="description" content={description} />

            {/* Twitter Meta Tags */}
            <meta name="twitter:title" content={SocialTitleText} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={SocialTitleText} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />
        </>
    );
}

const LanternPage = ({ serverData }) => {
    const { state } = useAppState(); // Keep client-side user state
    // const [isSameUser, setIsSameUser] = useState(false); // Client-side user check
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isSameUser = state.userData?.email && state.userData.email === serverData.lantern.email;
    console.log("Same user?", isSameUser);

    // Now safe to conditionally render based on serverData
    if (serverData.error || !serverData.lantern) {
        return (
            <div>
                Error: {serverData.error || "Lantern data is missing"}
            </div>
        );
    }

    // Ensure lantern is defined before rendering
    const lantern = serverData.lantern || { message: "", id: "" };

    return (
        <>
        

            <Layout
                image="background-zodiac-sky.jpg"
                alignImage="top"
                scrollable={false}
            >
                <LanternContainer>
                    <Lantern animalSign={lantern.animal_sign} name={lantern.name} text={lantern.message} />
                    {isSameUser ? (
                        <ButtonContainer>
                            <Button variant='glow' text="Share this lantern" onClick={() => setIsModalOpen(true)} />
                            <Button variant='secondary' to="/create-lantern" text="Create a new lantern" />
                        </ButtonContainer>
                    ) : (
                        <ButtonContainer>
                            <Button variant='glow' to="/create-lantern" text="Create your own lantern" />
                        </ButtonContainer>
                    )}

                </LanternContainer>
                {isModalOpen && (
                    <SocialShare
                        wish={lantern.message || ""}
                        isModalOpen={isModalOpen}
                        setIsModalOpen={setIsModalOpen}
                        lanternId={lantern?.id || ""}
                    />
                )}

            </Layout>
        </>
    );
};

export default LanternPage;