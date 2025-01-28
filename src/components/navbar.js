import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery, Link } from 'gatsby';

const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  backdrop-filter: blur(3px);
  background: linear-gradient(180deg, rgba(7, 28, 57, 0.3), rgba(7, 28, 57, 0.2) 30%, rgba(7, 28, 57, 0.025) 60%, rgba(7, 28, 57, 0) 80%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  box-sizing: border-box;
  height: 64px;

  @media (min-width: 768px) {
    height: 72px;
    padding: 0;
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  @media (min-width: 2000px) {
    width: 33%;
  }
`;

const Logo = styled.div`
  margin-top: 16px;
  width: auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: auto;
    height: 64px;
  }

  @media (min-width: 1440px) {
  margin-top: 16px;
    width: 102px;
    height: 102px;
    
    img {
    width: auto;
    height: 72px;
  }
  }
`;

const NavLinkContainer = styled.div`
  margin: 0;
  min-width: 33.33%;

  @media (min-width: 1024px) {
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1em;
  text-wrap: nowrap;
  transition: text-shadow 0.3s ease-in-out;
  border-bottom: ${props => (props.selected ? '2px solid white' : '2px solid transparent')};
  transition: border-bottom 0.3s ease-in-out;

  &:hover {
    text-shadow: 0 0 24px rgba(255, 255, 255, 0.5);
  }

  @media (min-width: 1024px) {
    font-size: 1.5em;
  }

  @media (min-width: 1440px) {
    font-size: 1.75em;
  }

  @media (min-width: 2440px) {
    font-size: 2em;
  }
`;

const Navbar = forwardRef((props, ref) => {
  const [selectedLink, setSelectedLink] = useState(null);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    if (path.includes('create-lantern')) {
      setSelectedLink('createLantern');
    } else if (path.includes('fortune')) {
      setSelectedLink('fortune');
    }
  }, []);

  const data = useStaticQuery(graphql`
    query {
      logo: file(relativePath: { eq: "logo.png" }) {
        childImageSharp {
          gatsbyImageData(width: 88, height: 88)
        }
      }
    }
  `);

  const logoImage = getImage(data.logo);

  return (
    <NavbarContainer ref={ref}>
      <NavContainer>
        <NavLinkContainer style={{textAlign: "right"}}>
          <NavLink
            style={{textAlign: "right"}}
            to="/create-lantern"
            selected={selectedLink === 'createLantern'}
            onClick={() => setSelectedLink('createLantern')}>
              Make a wish
          </NavLink>
        </NavLinkContainer>
        <Logo>
          <Link to="/" onClick={() => setSelectedLink('')}><GatsbyImage image={logoImage} alt="Logo" /></Link>
        </Logo>
        <NavLinkContainer style={{textAlign: "left"}}>
          <NavLink
            style={{textAlign: "left"}}
            to="/fortune"
            selected={selectedLink === 'fortune'}
            onClick={() => setSelectedLink('fortune')}>
              Your fortune
          </NavLink>
        </NavLinkContainer>
      </NavContainer>
    </NavbarContainer>
  );
});

export default Navbar;
