import React, { useEffect, useState, useRef } from 'react';
import useLanternsApi from '../../hooks/useLanternsApi';
import Layout from '../../components/layout';
import Lantern from '../../components/Lantern';

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
    }, [id, getLanternById]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Layout
            image="background-zodiac-sky.jpg"
            alignImage="top"
            scrollable={false}
        >
                <Lantern animalSign={lantern.animal_sign} />
        </Layout>
    );
};

export default LanternPage;