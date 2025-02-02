// socialShare.js

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import {
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinIcon,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon, // Replace XIcon with TwitterIcon
} from 'react-share';
import Button from './button';
import useAppState from '../hooks/useAppState'; // Import useAppState
import useLanternsApi from '../hooks/useLanternsApi'; // Import useLanternsApi
import { navigate } from "gatsby";

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(10px);
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 1.875rem;;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 0;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 500px;

  @media (min-width: 768px) {
    padding: 30px;
  }

  @media (min-width: 1024px) {
    padding: 40px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

    @media (min-width: 768px) {
      padding: 12px;
      font-size: 1.25rem;
    }

    @media (min-width: 1024px) {
      padding: 14px;
      font-size: 1.5rem;
    }
  }
`;

const ErrorBanner = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
  white-space: pre-line;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid ${({ $error }) => ($error === 'true' ? 'rgba(212, 2, 2, 1) !important' : '#ccc')};
  font-size: 1rem;
  outline: none;

  @media (min-width: 768px) {
    padding: 12px;
    font-size: 1.25rem;
  }

  @media (min-width: 1024px) {
    padding: 14px;
    font-size: 1.5rem;
  }
`;

const SubmitButton = styled.div`
  font-size: 0.75em;
`;

const SharePanel = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 640px;
  background: rgba(255, 255, 255, 0.85);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 24px 144px 24px;
  z-index: 10002;
  display: flex;
  flex-direction: column; /* Stack title and icons */
  align-items: center;
  backdrop-filter: blur(10px);
`;

const ShareTitle = styled.h3`
  text-align: center;
  margin-bottom: 32px;
  color: #333;
`;

const SocialGrid = styled.div`
  display: flex; /* Use flexbox for a row layout */
  justify-content: space-around; /* Spread buttons evenly across the width */
  align-items: center; /* Center buttons vertically */
  width: 100%; /* Ensure it spans the full panel width */
  padding: 0 16px; /* Add some padding for spacing */

  @media (min-width: 768px) {
    justify-content: space-evenly; /* Better spacing on larger screens */
  }
`;

const SocialItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0.9;
    transition: opacity 0.3s ease, transform 0.3s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  @media (min-width: 1024px) {
    svg {
      width: 60px;
      height: 60px;
    }
  }
`;

const SocialLabel = styled.span`
  margin-top: 8px;
  font-size: 1rem;
`;

const ShareOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001; // Ensure this is lower than SharePanel
  pointer-events: all; /* Blocks interaction */
  backdrop-filter: blur(10px);
`;

// Main Component

const SocialShare = ({ wish, lanternId: initialLanternId, isOwner }) => {
  const { state, dispatch } = useAppState();
  const { createLantern } = useLanternsApi();

  // Get email from state
  const userEmail = state?.userData?.email || null; // Check if email exists in state

  // State for modal and share panel visibility
  const [isModalOpen, setIsModalOpen] = useState(!userEmail); // Open modal if no email
  const [isSharingPanelOpen, setIsSharingPanelOpen] = useState(!!userEmail); // Open share panel if email exists
  const [lanternId, setLanternId] = useState(initialLanternId || null); // Set initial lantern ID
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState([]);
  const [isLanternSubmitted, setIsLanternSubmitted] = useState(false);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const sharePanelRef = useRef(null);

  useEffect(() => {
    console.log('isModalOpen:', isModalOpen, 'isSharingPanelOpen:', isSharingPanelOpen);
  }, [isModalOpen, isSharingPanelOpen]);

  // **Prevent modal from opening if email exists**
  useEffect(() => {
    if (userEmail) {
      setIsModalOpen(false); // Close the modal
      setIsSharingPanelOpen(true); // Open the share panel
  
      if (!lanternId) {
        // If no lanternId exists, create one
        const backendData = {
          name: state.userData.name,
          email: userEmail,
          birthdate: state?.birthdate || '',
          animal_sign: state?.zodiac || '',
          element: state?.element || '',
          message: wish,
        };
  
        createLantern(backendData).then((newLantern) => {
          if (newLantern?.id) {
            setLanternId(newLantern.id);
            setIsLanternSubmitted(true);
          }
        }).catch(() => {
          console.error("Failed to create lantern.");
        });
      }
    }
  }, [userEmail]);

  // Handle modal animations
  useEffect(() => {
    if (isModalOpen && !userEmail) {  // Only animate if email does NOT exist
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.5 });
      gsap.to(modalRef.current, { opacity: 1, duration: 0.5, delay: 0.3 });
    }
  }, [isModalOpen, overlayRef, modalRef]);

  // Handle share panel animations
  useEffect(() => {
    if (isSharingPanelOpen) {
      console.log('Animating SharePanel', sharePanelRef.current);
      gsap.fromTo(
        sharePanelRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.5, ease: 'power2.inOut' }
      );
    }
  }, [isSharingPanelOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => setIsModalOpen(false) });
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Handle individual validation
    setErrors((prevErrors) => {
      const newErrors = [...prevErrors];

      if (name === 'name') {
        // Clear name error if valid
        if (value.trim() !== '') {
          return newErrors.filter((err) => !err.startsWith('name'));
        } else if (!newErrors.some((err) => err.startsWith('name'))) {
          newErrors.push('name: Name is required.');
        }
      }

      if (name === 'email') {
        // Only clear email error when format is valid
        if (value.trim() !== '' && /\S+@\S+\.\S+/.test(value)) {
          return newErrors.filter((err) => !err.startsWith('email'));
        } else if (!newErrors.some((err) => err.startsWith('email'))) {
          newErrors.push('email: Valid email is required.');
        }
      }

      return newErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = [];
    if (!formData.name) validationErrors.push('name: Name is required.');
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) validationErrors.push('email: Valid email is required.');

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const savedData = JSON.parse(localStorage.getItem('appState') || '{}');
      const backendData = {
        name: formData.name,
        email: formData.email,
        birthdate: savedData?.birthdate || '',
        animal_sign: savedData?.zodiac || '',
        element: savedData?.element || '',
        message: wish,
      };

      const newLantern = await createLantern(backendData);

      if (newLantern?.id) {
        setLanternId(newLantern.id); // Save the lantern ID
        dispatch({ type: 'SET_USER_DATA', payload: { name: formData.name, email: formData.email } });
        setIsLanternSubmitted(true); // Mark lantern as submitted
        closeModal(); // Close the modal
        setIsSharingPanelOpen(true); // Open the sharing panel
      }
    } catch (err) {
      setErrors(['api: Something went wrong. Please try again later.']);
    }
  };

  const handleNavigate = () => {
    // Add any pre-navigation logic here
    navigate(`/lantern/${lanternId}`);
  };

  return (
    <div>
      {isModalOpen && (
        <Overlay ref={overlayRef} onClick={handleOverlayClick}>
          <Modal ref={modalRef}>
            <ModalContent>
              <p>Enter your name and email to create your lantern!</p>
              {errors.length > 0 && <ErrorBanner>{errors.map((err) => err.split(': ')[1]).join('\n')}</ErrorBanner>}
              <Form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  $error={errors.some((err) => err.startsWith('name')) ? 'true' : 'false'} // Pass as string explicitly
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  $error={errors.some((err) => err.startsWith('email')) ? 'true' : 'false'} // Pass as string explicitly
                />
                <SubmitButton>
                  <Button variant="primary" text="Share your lantern" onClick={handleSubmit} />
                </SubmitButton>
              </Form>
            </ModalContent>
          </Modal>
        </Overlay>
      )}

      {isSharingPanelOpen && (
        <>
          <ShareOverlay /> {/* Ensure ShareOverlay is rendered */}
          <SharePanel ref={sharePanelRef}>
            <ShareTitle>Share Your Lantern</ShareTitle>
            <SocialGrid>
              <SocialItem>
                <LinkedinShareButton
                  url={`https://cny2025.michaellisboa.com/lantern/${lanternId}`}
                  title={`Check this out! Shared by ${formData.name}`}
                  onShareWindowClose={handleNavigate}
                >
                  <LinkedinIcon size={40} round />
                </LinkedinShareButton>
                <SocialLabel>LinkedIn</SocialLabel>
              </SocialItem>
              <SocialItem>
                <FacebookShareButton
                  url={`https://cny2025.michaellisboa.com/lantern/${lanternId}`}
                  quote={`Check this out! Shared by ${formData.name}`}
                  onShareWindowClose={handleNavigate}
                >
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <SocialLabel>Facebook</SocialLabel>
              </SocialItem>
              <SocialItem>
                <TwitterShareButton
                  url={`https://cny2025.michaellisboa.com/lantern/${lanternId}`}
                  title={`Check this out! Shared by ${formData.name}`}
                  onShareWindowClose={handleNavigate}
                >
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <SocialLabel>Twitter</SocialLabel>
              </SocialItem>
              <SocialItem>
                <WhatsappShareButton
                  url={`https://cny2025.michaellisboa.com/lantern/${lanternId}`}
                  title={`Check this out! Shared by ${formData.name}`}
                  onShareWindowClose={handleNavigate}
                >
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <SocialLabel>Whatsapp</SocialLabel>
              </SocialItem>
            </SocialGrid>
          </SharePanel>
        </>
      )}
    </div>
  );
};

export default SocialShare;