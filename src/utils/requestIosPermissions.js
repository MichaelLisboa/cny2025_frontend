import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import gsap from "gsap";
import useDeviceInfo from "../hooks/useDeviceInfo";

const PERMISSION_TIMEOUT = 1200000; // 20 minutes

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
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
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
`;

const Description = styled.p`
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
`;

const AppModal = ({ title, description, actions, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <ModalContainer>
      <ModalBox ref={modalRef}>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <ActionsContainer>
          {actions.map(({ text, onClick }, index) => (
            <ActionButton key={index} onClick={() => { onClick(); onClose(); }}>
              {text}
            </ActionButton>
          ))}
        </ActionsContainer>
      </ModalBox>
    </ModalContainer>
  );
};

const DeviceOrientationPermission = ({ onPermissionGranted }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { OS } = useDeviceInfo();
    const isIOS = OS === "iOS";
  
    const requestPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            const timestamp = Date.now();
            if (response === "granted") {
              localStorage.setItem(
                "deviceOrientationPermission",
                JSON.stringify({ status: "granted", timestamp })
              );
              onPermissionGranted();
            } else {
              localStorage.setItem(
                "deviceOrientationPermission",
                JSON.stringify({ status: "denied", timestamp })
              );
            }
          })
          .catch(console.error);
      } else {
        onPermissionGranted();
      }
    };
  
    useEffect(() => {
      if (typeof window === "undefined") return;
  
      const storedPermission = localStorage.getItem("deviceOrientationPermission");
      if (storedPermission) {
        try {
          const { status, timestamp } = JSON.parse(storedPermission);
          if (Date.now() - timestamp < PERMISSION_TIMEOUT) {
            if (status === "granted") {
              onPermissionGranted();
              return;
            } else if (status === "denied") {
              return;
            }
          }
        } catch (error) {
          console.error("Error parsing stored permission:", error);
        }
      }
  
      if (isIOS) {
        setIsModalOpen(true);
      } else {
        onPermissionGranted();
      }
    }, [onPermissionGranted, isIOS]);
  
    return (
      isModalOpen && (
        <AppModal
          title="Enable Motion?"
          description="Would you like to enable motion functionality for better interaction?"
          actions={[
            {
              text: "No, I'm a loser",
              onClick: () => {
                localStorage.setItem(
                  "deviceOrientationPermission",
                  JSON.stringify({ status: "denied", timestamp: Date.now() })
                );
                setIsModalOpen(false);
              },
            },
            {
              text: "Yes, I effin' rule!",
              onClick: () => {
                setIsModalOpen(false);
                setTimeout(requestPermission, 300);
              },
            },
          ]}
          onClose={() => setIsModalOpen(false)}
        />
      )
    );
  };

export default DeviceOrientationPermission;
