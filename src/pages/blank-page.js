import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

const BlankPage = () => {
  return (
    <Layout alignImage="bottom">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Blank Page</h1>
        <p>This is a blank page.</p>
      </div>
    </Layout>
  );
};

export default BlankPage;

export const Head = () => (
  <SEO title="Blank Page" />
);

