import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import {
  LinkedinShareButton,
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TwitterShareButton, // Corrected import
  LinkedinIcon,
  FacebookIcon,
  WhatsappIcon,
  EmailIcon,
  TwitterIcon, // Corrected import
} from 'react-share';
import useAppState from '../hooks/useAppState'; // Import useAppState
import useLanternsApi from '../hooks/useLanternsApi'; // Import useLanternsApi

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
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
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

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;

    @media (min-width: 768px) {
      font-size: 2rem;
    }

    @media (min-width: 1024px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1rem;
    margin-bottom: 20px;

    @media (min-width: 768px) {
      font-size: 1.25rem;
    }

    @media (min-width: 1024px) {
      font-size: 1.5rem;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;

  input {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;

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

const SocialIcons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 24px auto;

  svg {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.3s ease, transform 0.3s ease;

    &:hover {
      opacity: 0.7;
    }

    @media (min-width: 768px) {
      width: 50px;
      height: 50px;
    }

    @media (min-width: 1024px) {
      width: 60px;
      height: 60px;
    }
  }

  .selected {
    transform: scale(1.2);
  }

  .dimmed {
    opacity: 0.3;
    transform: scale(0.8);
  }
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: #d40202;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 1.25rem;
  }

  @media (min-width: 1024px) {
    padding: 14px 28px;
    font-size: 1.5rem;
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
  margin-bottom: 10px;
  border: 1px solid ${({ error }) => (error ? 'rgba(212, 2, 2, 1) !important' : '#ccc')};
  border-radius: 4px;
  font-size: 1rem;
  box-shadow: ${({ error }) => (error ? '0 0 4px rgba(212, 2, 2, 0.5)' : 'none')};
  outline: none; /* Remove the default focus outline */

  @media (min-width: 768px) {
    padding: 12px;
    font-size: 1.25rem;
  }

  @media (min-width: 1024px) {
    padding: 14px;
    font-size: 1.5rem;
  }
`;

const SocialShare = ({ wish, isModalOpen, setIsModalOpen }) => {
  const { dispatch, state } = useAppState(); // Use the useAppState hook
  const { createLantern } = useLanternsApi(); // Use the useLanternsApi hook
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formTouched, setFormTouched] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const shareRefs = {
    linkedin: useRef(null),
    facebook: useRef(null),
    twitter: useRef(null), // Corrected key
    whatsapp: useRef(null),
    email: useRef(null),
  };

  // const shareUrl = window.location.href;
  // const title = `Check this out!`;

  useEffect(() => {
    if (isModalOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.5 });
      gsap.to(modalRef.current, { opacity: 1, duration: 0.5, delay: 0.3 });
    }
  }, [isModalOpen]);

  const closeModal = () => {
    gsap.to(modalRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, delay: 0.3, onComplete: () => setIsModalOpen(false) });
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(icon === selectedIcon ? null : icon);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closeModal();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'name' && value.trim() !== '') {
      setNameError(false); // Clear name error
    }

    if (name === 'email') {
      if (value.trim() === '' || !/\S+@\S+\.\S+/.test(value)) {
        setEmailError(false); // Only clear the error when valid
      }
    }
  };

  // Helper function to replace or add an error
  const replaceOrAddError = (errorsArray, oldError, newError) => {
    const errorIndex = errorsArray.indexOf(oldError);
    if (errorIndex > -1) {
      errorsArray[errorIndex] = newError; // Replace the error
    } else if (!errorsArray.includes(newError)) {
      errorsArray.push(newError); // Add the new error if not already present
    }
    return errorsArray;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched(true);

    // Validation
    const errors = [];
    if (!formData.name) errors.push('Name is required.');
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.push('Valid email is required.');
    if (!selectedIcon) errors.push('Please select a platform to share.');

    if (errors.length) {
      setError(errors.join('\n'));
      return;
    }

    // Get state data from localStorage
    const savedData = JSON.parse(localStorage.getItem('appState'));
    console.log('Saved Data from localStorage:', savedData);

    // Map fields to match backend requirements
    const backendData = {
      name: savedData?.userData?.name || formData.name,
      email: savedData?.userData?.email || formData.email,
      birthdate: savedData?.birthdate || '', // Map birthdate
      animal_sign: savedData?.zodiac || '', // Map zodiac to animal_sign
      element: savedData?.element || '', // Map element
      message: wish || savedData?.wishes?.[0]?.wish, // Use first wish message
    };

    // POST to backend
    try {
      const newLantern = await createLantern(backendData);
    } catch (err) {
      console.error('Error posting to API:', err);
    }

    // Trigger sharing regardless of API success
    if (shareRefs[selectedIcon]?.current) {
      shareRefs[selectedIcon].current.click();
    } else {
      alert('Sharing platform not configured correctly.');
    }
  };

  return (
    <div>
      {isModalOpen && (
        <Overlay ref={overlayRef} onClick={handleOverlayClick}>
          <Modal ref={modalRef}>
            <ModalContent>
              <h2>Share your wish</h2>
              <p>Placeholder content for social sharing buttons.</p>
              {error && <ErrorBanner>{error}</ErrorBanner>}
              <Form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  {...(formTouched && nameError ? { error: true } : {})}
                />

                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  {...(formTouched && nameError ? { error: true } : {})}
                />
                <SocialIcons>
                  {['linkedin', 'facebook', 'twitter', 'whatsapp', 'email'].map((platform) => {
                    const IconComponent = {
                      linkedin: LinkedinIcon,
                      facebook: FacebookIcon,
                      twitter: TwitterIcon, // Corrected key
                      whatsapp: WhatsappIcon,
                      email: EmailIcon,
                    }[platform];

                    return (
                      <IconComponent
                        key={platform}
                        className={selectedIcon === platform ? 'selected' : selectedIcon ? 'dimmed' : ''}
                        onClick={() => setSelectedIcon(platform)}
                      />
                    );
                  })}
                </SocialIcons>
                <div style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}>
                  <LinkedinShareButton
                    ref={shareRefs.linkedin}
                    url={`https://example.com/lantern/${formData.name}`}
                    title={`Check this out! Shared by ${formData.name}`}
                  />
                  <FacebookShareButton
                    ref={shareRefs.facebook}
                    url={`https://example.com/lantern/${formData.name}`}
                    quote={`Check this out! Shared by ${formData.name}`}
                  />
                  <TwitterShareButton // Corrected component
                    ref={shareRefs.twitter}
                    url={`https://example.com/lantern/${formData.name}`}
                    title={`Check this out! Shared by ${formData.name}`}
                  />
                  <WhatsappShareButton
                    ref={shareRefs.whatsapp}
                    url={`https://example.com/lantern/${formData.name}`}
                    title={`Check this out! Shared by ${formData.name}`}
                  />
                  <EmailShareButton
                    ref={shareRefs.email}
                    url={`https://example.com/lantern/${formData.name}`}
                    subject={`Check this out!`}
                    body={`Hi there, check this out: https://example.com/lantern/${formData.name}`}
                  />
                </div>
                <SubmitButton type="submit">Submit</SubmitButton>
              </Form>
            </ModalContent>
          </Modal>
        </Overlay>
      )}
    </div>
  );
};

export default SocialShare;