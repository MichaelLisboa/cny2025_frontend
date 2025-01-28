import styled from "styled-components";

export const LanternContainer = styled.div.attrs({
  className: "lantern-container",
})`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  max-width: 600px;
  padding: 96px 0 32px 0;
  margin-bottom: 72px;
  overflow: visible;

  @media (min-width: 1441px) {
    padding: 128px 0 72px 0;
    max-width: 1024px;
  }
`;

export const LanternImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 70vh;
  z-index: 1;
  overflow: visible;
`;

export const TextParagraph = styled.p`
  margin-top: 32px;
  font-size: 1.75rem;
  line-height: 1;
  font-weight: 800;
  max-width: 50%;
  color: rgba(226, 127, 12, 0.6);
  z-index: 3;
  pointer-events: none;
  position: relative;
  text-align: center;
  text-shadow: -1px -1px 1px rgba(226, 127, 12, 0.3);
  mix-blend-mode: multiply;

  @media (min-width: 1441px) {
    font-size: 2.5rem;
    max-width: 30%;
  }
`;

export const WishParagraph = styled.p`
  margin-top: 32px;
  font-size: 1.25rem;
  line-height: 1;
  font-weight: 600;
  max-width: 50%;
  color: rgba(226, 127, 12, 0.8);
  z-index: 3;
  pointer-events: none;
  position: relative;
  text-align: center;
  text-shadow: -1px -1px 1px rgba(226, 127, 12, 0.5);
  mix-blend-mode: multiply;

  @media (min-width: 1441px) {
    font-size: 1.5rem;
    max-width: 30%;
  }
`;

export const FormContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 3;
`;

export const TextAreaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  border-radius: 50px;
  z-index: 3;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.3s ease-in-out;

  &:focus {
    box-shadow: 0 0 25px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.9);
  }

  @media (min-width: 1441px) {
    width: 60%;
  }
`;

export const TextArea = styled.textarea`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: auto;
  max-width: 400px;
  font-size: 16px;
  font-weight: 800;
  color: rgba(226, 127, 12, 1);
  padding: 32px;
  border-radius: 32px;
  border: none;
  background: white;
  outline: none;
  text-align: center;
  background: none;
  resize: none;
  overflow: hidden;

  &::placeholder {
    color: rgba(226, 127, 12, 0.65);
    text-align: center;
  }

  &:focus::placeholder {
    color: transparent;
  }

  @media (min-width: 768px) {
    font-size: 1.75em;
    width: 100%;
    max-width: 640px;
  }

  @media (min-width: 1440px) {
    font-size: 2em;
    width: 100%;
    max-width: 640px;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    fill: #999;
    transition: fill 0.2s ease;
    width: 100%;
    height: 100%;
  }

  &:hover svg {
    fill: #e27f0c;
  }
`;

export const SaveWishButton = styled.div`
  position: relative;
  z-index: 1000;
  margin: 4px auto 24px;
  overflow: visible;
  display: ${({ visible }) => (visible ? 'block' : 'none')};
`;

export const ShareWishButton = styled.div`
  position: relative;
  z-index: 1000;
  bottom: 32px;
  margin: 4px auto 24px;
  overflow: visible;
`;
