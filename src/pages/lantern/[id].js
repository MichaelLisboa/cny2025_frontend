import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useLanternsApi from '../../hooks/useLanternsApi';
import Layout from '../../components/layout';
import Lantern from '../../components/Lantern';
import Button from '../../components/button';
import useAppState from '../../hooks/useAppState'; // Import useAppState
import SocialShare from "../../components/socialShare";

const LanternContainer = styled.div`
    position: relative;
    display: inline-block;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 2vh 0 0 0;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  z-index: 10000;
  bottom: 5vh;
  margin: 4px auto 24px;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const LanternPage = ({ params }) => {
    const { id } = params;
    const { getLanternById } = useLanternsApi();
    const { state } = useAppState(); // Use the useAppState hook
    const [lantern, setLantern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSameUser, setIsSameUser] = useState(false); // State to track if the user is the same
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchLantern = async () => {
            try {
                const data = await getLanternById(id);
                setLantern(data);

                // Check if the current user is the same as the one who created the lantern
                const savedUserData = state.userData;
                if (savedUserData && savedUserData.email === data.email) {
                    setIsSameUser(true);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLantern();
    }, [id, state.userData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
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
                wish={lantern.message}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                mode="share"
                lanternId={id}
                simple={true} // Pass the simple prop to render only social media buttons
            />
        </Layout>
    );
};

export default LanternPage;