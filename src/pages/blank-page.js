import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';
import styled from "styled-components";

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

