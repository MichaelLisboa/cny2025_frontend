import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Layout from "../../components/layout";
import Lantern from "../../components/Lantern";
import Button from "../../components/button";
import useAppState from "../../hooks/useAppState"; // Keep client-side logic
import SocialShare from "../../components/socialShare"; // Social share modal
import SEO from "../../components/seo"; // SEO metadata

const LanternContainer = styled.div`
    position: relative;
    display: flex; // Changed from inline-block to flex
    height: 100vh;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 80px 0 0 0;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  z-index: 10000;
  bottom: 10vh;
  margin: 4px auto 24px;
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
        return { props: { lantern: data || null } }; // Ensure lantern is never undefined
    } catch (error) {
        return {
            status: 500,
            props: { error: "Failed to load lantern. Please try again later." },
        };
    }
}

const LanternPage = ({ serverData }) => {
    const { state } = useAppState(); // Keep client-side user state
    const [isSameUser, setIsSameUser] = useState(false); // Client-side user check
    const [isModalOpen, setIsModalOpen] = useState(false); // Social share modal

    useEffect(() => {
        if (typeof window === "undefined" || serverData.error || !serverData.lantern) return;

        if (state.userData?.email === serverData.lantern.email) {
            setIsSameUser(true);
        }
    }, [state.userData, serverData.lantern]);

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
            <SEO
                title={`${lantern.name} has sent you a lantern ${lantern.message}`}
                description="Create and share your own lanterns with your friends and family."
                image="og-meta.png"
            />
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
                <SocialShare
                    wish={lantern.message || ""}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    lanternId={lantern?.id || ""}
                />
            </Layout>
        </>
    );
};

export default LanternPage;