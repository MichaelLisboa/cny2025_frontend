import styled from "styled-components";

export const LanternContainer = styled.div.attrs({
  className: "lantern-container",
})`
    position: relative;
    display: inline-block;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 40px 0 0 0;

    .lantern-wrapper {
      position: relative;
      display: inline-block;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      width: 100vw;
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
    width: 30%;
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
  display: display: ${(props) => (props.$visible ? "block" : "none")};
`;

export const ButtonsContainer = styled.div`
  position: absolute;
  z-index: 999;
  bottom: 10vh;
  margin: 0 auto 24px;
  overflow: visible;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
`;
