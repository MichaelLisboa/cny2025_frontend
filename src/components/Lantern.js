import React, { forwardRef, useMemo, useRef, useEffect } from 'react';
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { graphql, useStaticQuery } from "gatsby";
import useFloatingAnimation from '../hooks/useFloatingAnimation';

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

  const imageMap = useMemo(() => {
    return data.allFile.edges.reduce((map, { node }) => {
      map[node.relativePath] = getImage(node.childImageSharp);
      return map;
    }, {});
  }, [data]);

  const lanternImage = imageMap[`lantern-${animalSign.toLowerCase()}.png`];
  const glowImage = imageMap[`lantern-glow.png`];

  const wrapperRef = useRef(null);
  const glowRef = useRef(null);
  useFloatingAnimation(ref || wrapperRef, { minX: -20, maxX: 20, minY: -40, maxY: 40, minRotation: -3, maxRotation: 3 });

  useEffect(() => {
    if (wrapperRef.current && glowRef.current) {
      console.log('Wrapper dimensions:', wrapperRef.current.offsetWidth, wrapperRef.current.offsetHeight);
      console.log('Glow dimensions:', glowRef.current.offsetWidth, glowRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className="lantern-image-wrapper" ref={ref || wrapperRef}>
      <div className="text-overlay">
        <p className="name">{name || ' '}</p>
        <p className="message">{text || ' '}</p>
      </div>
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