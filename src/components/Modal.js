import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0); // Start fully transparent
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center; // Center both vertically and horizontally
  pointer-events: auto; // Prevent interaction with anything behind
`;

const ModalBox = styled.div`
  width: 80%;
  max-width: 320px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 1000;
  padding: 1.5rem;
  text-align: center;
  transform: translate(-50%, 150%); // Start off-screen bottom
  opacity: 0; // Start hidden
  position: absolute;
  left: 50%;
  top: 50%;
`;

const ModalTitle = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 0;
  color: #333;
`;

const ModalDescription = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 1.5rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
`;

const ActionButton = styled.a`
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: rgba(0, 122, 255, 1);
  cursor: pointer;
  ${(props) => props.customStyle}
`;

const Modal = ({ title, description, actions }) => {
  useEffect(() => {
    // GSAP animations
    // Step 1: Fade in the modal background overlay
    gsap.to('#modal-container', {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fade in to 50% opacity
      opacity: 1,
      duration: 0.3,
      onComplete: () => {
        // Step 2: Slide modal to vertical and horizontal center
        gsap.to('#modal-box', {
          opacity: 1,
          y: '-50%', // Slide to centered position
          duration: 0.5,
          ease: 'power3.out', // Smooth easing
        });
      },
    });

    return () => {
      gsap.to('#modal-container', {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          document.getElementById('modal-container').remove();
        },
      });
    };
  }, [title, description, actions]);

  return (
    <ModalContainer id="modal-container">
      <ModalBox id="modal-box">
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
        <ActionsContainer>
          {actions.map(({ text, style, onClick }, index) => (
            <ActionButton
              key={index}
              customStyle={style}
              onClick={(event) => {
                event.preventDefault();
                if (onClick) onClick();
                // Slide the modal back down and fade out the overlay
                gsap.to('#modal-box', {
                  y: '150%', // Slide to off-screen bottom
                  duration: 0.5,
                  ease: 'power3.in',
                });
                gsap.to('#modal-container', {
                  opacity: 0,
                  duration: 0.3,
                  delay: 0.2,
                  onComplete: () => document.getElementById('modal-container').remove(),
                });
              }}
            >
              {text}
            </ActionButton>
          ))}
        </ActionsContainer>
      </ModalBox>
    </ModalContainer>
  );
};

export default Modal;
