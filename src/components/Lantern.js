import React, { forwardRef, useMemo, useRef, useEffect, useState } from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import useFloatingAnimation from '../hooks/useFloatingAnimation';
import '../styles/lantern.css';

const Lantern = forwardRef(({ animalSign, text, name }, ref) => {
  const data = useStaticQuery(graphql`
    query {
      allFile {
        edges {
          node {
            relativePath
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
            }
          }
        }
      }
    }
  `);

  const getImageByName = useMemo(() => {
    return (name) => {
      const image = data.allFile.edges.find(({ node }) =>
        node.relativePath.includes(name)
      );
      return image ? getImage(image.node.childImageSharp) : null;
    };
  }, [data]);

  const lanternImage = getImageByName(`lantern-${animalSign.toLowerCase()}.png`);
  const glowImage = getImageByName(`lantern-glow.png`); // 🚀 Fetch glow image

  const floatingRef = useRef(null);
  useFloatingAnimation(floatingRef, { minX: -20, maxX: 20, minY: -40, maxY: 40, minRotation: -3, maxRotation: 3 });

  useEffect(() => {
    const wrapper = document.querySelector('.lantern-image-wrapper');
    const glow = document.querySelector('.styled-glow-image');
    console.log('Wrapper dimensions:', wrapper.offsetWidth, wrapper.offsetHeight);
    console.log('Glow dimensions:', glow.offsetWidth, glow.offsetHeight);
    console.log('Hydration complete');
  }, []);

  return (
    <div className="lantern-image-wrapper" ref={floatingRef}>
      {(text || name) && (
        <div className="text-overlay">
          {name && <p className="name">From {name}</p>}
          {text && <p className="message">{text}</p>}
        </div>
      )}
      {lanternImage && (
        <GatsbyImage
          image={lanternImage}
          alt={`${animalSign} lantern`}
          className="styled-image"
        />
      )}
      {glowImage && (
        <GatsbyImage
          image={glowImage}
          alt="Glowing effect"
          className="styled-glow-image"
        />
      )}
    </div>
  );
});

export default Lantern;
