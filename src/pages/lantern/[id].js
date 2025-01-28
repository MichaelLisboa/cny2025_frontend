import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import useLanternsApi from '../../hooks/useLanternsApi';
import Layout from '../../components/layout';
import Lantern from '../../components/Lantern';

const LanternContainer = styled.div`
    position: relative;
    display: inline-block;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const OverlayMessage = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
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
            </LanternContainer>
        </Layout>
    );
};

export default LanternPage;