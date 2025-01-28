import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useLanternsApi from '../../hooks/useLanternsApi';
import Layout from '../../components/layout';
import Lantern from '../../components/Lantern';
import Button from '../../components/button';

const LanternContainer = styled.div`
    position: relative;
    display: inline-block;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 1rem;
`;

const LanternPage = ({ params }) => {
    const { id } = params;
    const { getLanternById } = useLanternsApi();
    const [lantern, setLantern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLantern = async () => {
            try {
                const data = await getLanternById(id);
                setLantern(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLantern();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(lantern);

    return (
        <Layout
            image="background-zodiac-sky.jpg"
            alignImage="top"
            scrollable={false}
        >
            <LanternContainer>
                <Lantern animalSign={lantern.animal_sign} name={lantern.name} text={lantern.message} />
                <ButtonContainer>
                    <Button variant='glow' to="/create-lantern" text="Create your own lantern" />
                </ButtonContainer>
            </LanternContainer>
        </Layout>
    );
};

export default LanternPage;