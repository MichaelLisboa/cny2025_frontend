import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import {
    LinkedinShareButton,
    FacebookShareButton,
    WhatsappShareButton,
    EmailShareButton,
    XShareButton,
    LinkedinIcon,
    FacebookIcon,
    WhatsappIcon,
    EmailIcon,
    XIcon,
} from 'react-share';

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

const SocialShare = () => {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const overlayRef = useRef(null);
    const modalRef = useRef(null);

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
    
        // Update form data as user types
        setFormData({ ...formData, [name]: value });
    
        // Clear specific errors dynamically
        if (name === 'name') {
            if (value.trim() !== '') setNameError(false); // Clear name error if valid
        }
    
        if (name === 'email') {
            let updatedErrors = error.split('\n'); // Split errors into an array
    
            if (value.trim() === '') {
                // Email is empty
                setEmailError(true);
                updatedErrors = replaceOrAddError(updatedErrors, 'Email must be in the correct format.', 'Email is a required field.');
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                // Email format is invalid
                setEmailError(true);
                updatedErrors = replaceOrAddError(updatedErrors, 'Email is a required field.', 'Email must be in the correct format.');
            } else {
                // Email is valid
                setEmailError(false);
                updatedErrors = updatedErrors.filter((msg) => !msg.includes('Email')); // Remove email-related errors
            }
    
            setError(updatedErrors.join('\n')); // Update the error banner
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

    const handleSubmit = (e) => {
        e.preventDefault();
        let errors = [];
    
        if (!formData.name) {
            setNameError(true);
            errors.push('Name is a required field.');
        } else {
            setNameError(false);
        }
    
        if (!formData.email) {
            setEmailError(true);
            errors.push('Email is a required field.');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setEmailError(true);
            errors.push('Email must be in the correct format.');
        } else {
            setEmailError(false);
        }
    
        if (!selectedIcon) {
            errors.push('Please select a platform to share!');
        }
    
        if (errors.length > 0) {
            setError(errors.join('\n'));
            return;
        }
    
        setError('');
        console.log('Form submitted:', { ...formData, selectedIcon });
    
        const shareText = `Check this out! Shared by ${formData.name}`;
        const shareUrl = window.location.href;
    
        // Ensure window.open() only runs on the client side
        if (typeof window !== 'undefined') {
            switch (selectedIcon) {
                case 'linkedin':
                    window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
                        '_blank'
                    );
                    break;
                case 'facebook':
                    window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
                        '_blank'
                    );
                    break;
                case 'x':
                    window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
                        '_blank'
                    );
                    break;
                case 'whatsapp':
                    window.open(
                        `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
                        '_blank'
                    );
                    break;
                case 'email':
                    window.open(
                        `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
                        '_self'
                    );
                    break;
                default:
                    alert('Invalid platform selected!');
            }
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
                                    error={nameError} // Pass true/false here
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={emailError} // Pass true/false here
                                />
                                <SocialIcons>
                                    <LinkedinIcon
                                        className={selectedIcon === 'linkedin' ? 'selected' : selectedIcon ? 'dimmed' : ''}
                                        onClick={() => handleIconClick('linkedin')}
                                    />
                                    <FacebookIcon
                                        className={selectedIcon === 'facebook' ? 'selected' : selectedIcon ? 'dimmed' : ''}
                                        onClick={() => handleIconClick('facebook')}
                                    />
                                    <XIcon
                                        className={selectedIcon === 'x' ? 'selected' : selectedIcon ? 'dimmed' : ''}
                                        onClick={() => handleIconClick('x')}
                                    />
                                    <WhatsappIcon
                                        className={selectedIcon === 'whatsapp' ? 'selected' : selectedIcon ? 'dimmed' : ''}
                                        onClick={() => handleIconClick('whatsapp')}
                                    />
                                    <EmailIcon
                                        className={selectedIcon === 'email' ? 'selected' : selectedIcon ? 'dimmed' : ''}
                                        onClick={() => handleIconClick('email')}
                                    />
                                </SocialIcons>
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