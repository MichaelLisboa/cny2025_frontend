import React, { useState, useEffect, forwardRef } from 'react';
import styled from 'styled-components';

const NavbarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10000;
  backdrop-filter: blur(6px);
  background: linear-gradient(180deg, rgba(7, 28, 57, 0.6), rgba(7, 28, 57, 0.25) 30%, rgba(7, 28, 57, 0.075) 60%, rgba(7, 28, 57, 0) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  box-sizing: border-box;
  height: 64px;

  @media (min-width: 768px) {
    height: 80px;
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
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background: white;

  @media (min-width: 1440px) {
    width: 102px;
    height: 102px;
    font-size: 32px;
  }
`;

const NavLinkContainer = styled.div`
  margin: 0;
  border-bottom: ${props => (props.selected ? '2px solid white' : '2px solid transparent')};
  transition: border-bottom 0.3s ease-in-out;

  @media (min-width: 1024px) {
    text-align: center;
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1em;
  text-wrap: nowrap;
  transition: text-shadow 0.3s ease-in-out;

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

  return (
    <NavbarContainer ref={ref}>
      <NavContainer>
        <NavLinkContainer selected={selectedLink === 'createLantern'}>
          <NavLink href="/create-lantern" onClick={() => setSelectedLink('createLantern')}>Make a wish</NavLink>
        </NavLinkContainer>
        <Logo>Logo</Logo>
        <NavLinkContainer selected={selectedLink === 'fortune'}>
          <NavLink href="/fortune" onClick={() => setSelectedLink('fortune')}>Your fortune</NavLink>
        </NavLinkContainer>
      </NavContainer>
    </NavbarContainer>
  );
});

export default Navbar;
