import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styled, { css } from 'styled-components';
import { Link as GatsbyLink } from 'gatsby';
import useDeviceInfo from '../hooks/useDeviceInfo';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const variants = {
  glow: css`
    background: rgba(255, 239, 200, 0.2);
    box-shadow: 0 0 30px rgba(255, 239, 200, 0.4), 0 0 60px rgba(255, 239, 200, 0.2);
    color: #ffffff;
    text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);

    &:hover {
      box-shadow: 0 0 60px rgba(255, 239, 200, 0.8), 0 0 150px rgba(255, 239, 200, 0.5);
      transform: scale(1.1);
    }
  `,
  primary: css`
    background: #C0560E;
    color: #ffffff;

    &:hover {
      background: #BE5711;
      transform: scale(1.05);
    }
  `,
  secondary: css`
    background: transparent;
    border: 2px solid #ffffff;
    color: #ffffff;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: scale(1.05);
    }
  `,
};

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
  display: inline-block;
  border-radius: 25px;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  padding: 12px 36px;
  ${({ variant }) => variants[variant] || variants.glow}
`;

const Link = styled(GatsbyLink)`
  position: relative;
  display: inline-block;
  font-size: ${(props) => (props.isMobile ? '1.25em' : '1.5em')};
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  color: inherit; /* Ensures it inherits color from the Wrapper */
  &:visited {
    color: inherit; /* Prevents purple text for visited links */
  }
  &:hover,
  &:focus {
    color: inherit; /* Keeps the color consistent on hover or focus */
  }
`;

const Button = ({ text = 'Continue', to = null, onClick = null, variant = 'glow' }) => {
  const wrapperRef = useRef();
  const { isMobile } = useDeviceInfo();

  useEffect(() => {
    if (variant !== 'glow') return;

    const wrapper = wrapperRef.current;

    // GSAP Glow Animation for "glow" variant
    const tween = gsap.to(wrapper, {
      boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)',
      scale: 1.07,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      duration: 5,
    });

    return () => {
      tween.kill();
    };
  }, [variant]);

  return (
    <ButtonContainer>
      <Wrapper
        ref={wrapperRef}
        variant={variant}
        onMouseEnter={variant === 'glow' ? () => gsap.to(wrapperRef.current, { scale: 1.1 }) : null}
        onMouseLeave={variant === 'glow' ? () => gsap.to(wrapperRef.current, { scale: 1.07 }) : null}
        onClick={!to && onClick ? onClick : null}
      >
        <Link as={!to ? 'span' : undefined} to={to || undefined} isMobile={isMobile} aria-label={text}>
          {text}
        </Link>
      </Wrapper>
    </ButtonContainer>
  );
};

export default Button;