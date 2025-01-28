import React, { useEffect, useState, useRef } from 'react';
import useLanternsApi from '../../hooks/useLanternsApi';
import Layout from '../../components/layout';
import Lantern from '../../components/Lantern';
import useFloatingAnimation from '../../hooks/useFloatingAnimation';

const LanternPage = ({ params }) => {
    const { id } = params;
    const { getLanternById } = useLanternsApi();
    const [lantern, setLantern] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const floatingRef = useRef(null);

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
    }, [id, getLanternById]);

    useFloatingAnimation(floatingRef, { minX: -30, maxX: 30, minY: -60, maxY: 60 });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout
            image="background-zodiac-sky.jpg"
            alignImage="top"
            scrollable={false}
        >
            <div ref={floatingRef}>
                <Lantern animalSign={lantern.animal_sign} />
            </div>
        </Layout>
    );
};

export default LanternPage;