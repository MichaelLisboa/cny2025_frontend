import React, {useEffect} from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const Wrapper = styled.div`
  position: relative;
  margin: 0 auto;
  display: inline-block;
  padding: 8px 32px;
  border-radius: 25px;
  background: rgba(255, 239, 200, 0.2);
  box-shadow: 0 0 30px rgba(255, 239, 200, 0.4), 0 0 60px rgba(255, 239, 200, 0.2);
  z-index: 1;
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  backdrop-filter: blur(4px);

  &:hover {
    box-shadow: 0 0 60px rgba(255, 239, 200, 0.8), 0 0 150px rgba(255, 239, 200, 0.5);
    transform: scale(1.1);
  }
`;

const Link = styled.a`
  position: relative;
  display: inline-block;
  font-size: ${props => (props.isMobile ? '1.25em' : '1.5em')};
  font-weight: 500;
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  z-index: 2;
  text-shadow: 0 2px 10px rgba(255, 255, 255, 0.5);
`;

const Button = ({ text = 'Continue', onClick = () => {} }) => {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wrapper = document.querySelector('.button-wrapper');

    // GSAP Glow Animation for the wrapper
    gsap.to(wrapper, {
      boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)',
      scale: 1.07,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
      duration: 5,
    });

    // Add hover interaction for ripple magic
    const handleMouseOver = () => {
      gsap.to(wrapper, {
        boxShadow: '0 0 60px rgba(255, 239, 200, 0.8), 0 0 150px rgba(255, 239, 200, 0.5)',
        scale: 1.1,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const handleMouseOut = () => {
      gsap.to(wrapper, {
        boxShadow: '0 0 40px rgba(255, 239, 200, 0.6), 0 0 120px rgba(255, 239, 200, 0.3)',
        scale: 1.07,
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: true,
      });
    };

    wrapper.addEventListener('mouseover', handleMouseOver);
    wrapper.addEventListener('mouseout', handleMouseOut);

    // Clean up event listeners
    return () => {
      wrapper.removeEventListener('mouseover', handleMouseOver);
      wrapper.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <ButtonContainer>
      <Wrapper className="button-wrapper" onClick={onClick}>
        <Link isMobile={isMobile} aria-label={text}>
          {text}
        </Link>
      </Wrapper>
    </ButtonContainer>
  );
};

export default Button;