import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import Button from './button';

const DatePickerWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 600px;
  height: 100vh;
  width: 100%;
  margin: 16px auto;
  padding: 16px;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  outline: none;
  cursor: pointer;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const DatePickerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #F9F8ED;
  border-radius: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: none; // Initially hidden
  padding: 16px;
  text-align: center;
  width: 80vw;
  height: 80vw;
  max-width: 600px;
  max-height: 600px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Dropdown = styled.select`
  font-size: 1.5rem;
  border: none;
  background: none;
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  outline: none;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }

  @media (min-width: 1024px) {
    font-size: 2rem;
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  flex-grow: 1;
  align-items: center;
`;

const Day = styled.button`
  text-align: center;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: ${(props) => (props.isSelected ? '#FFFFFF' : props.isFuture ? '#C7C6BD' : '#101113')};
  border-radius: 50%;
  font-size: 1rem;
  // don't wrap text
  white-space: nowrap;
  background-color: ${(props) => (props.isSelected ? 'rgba(192, 86, 14, 1)' : 'transparent')};
  pointer-events: ${(props) => (props.isFuture ? 'none' : 'auto')};

  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }

  @media (min-width: 1024px) {
    width: 60px;
    height: 60px;
    font-size: 1.75rem;
  }
`;

const HeaderText = styled.h1`
  margin: 0;
  padding: 0;

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const TextParagraph = styled.p`
  margin-top: 20px;
  padding: 8px 24px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.25rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const DatePicker = ({ onDateSelected, birthdateExists, handleNextClick, title, paragraphText, buttonLabel }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [highlightedDate, setHighlightedDate] = useState(new Date().getDate());
  const overlayRef = useRef(null);
  const datePickerRef = useRef(null);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const updateDays = () => {
    const today = new Date();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        i === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear();
      const isSelected = i === highlightedDate && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const isFuture = new Date(currentYear, currentMonth, i) > today;

      days.push(
        <Day
          key={i}
          isFuture={isFuture}
          isSelected={isSelected}
          onClick={() => {
            if (!isFuture) {
              const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
              setSelectedDate(`${i} ${months[currentMonth]}, ${currentYear}`);
              setHighlightedDate(i);
              onDateSelected(formattedDate);
              hidePicker();
            }
          }}
        >
          {i}
        </Day>
      );
    }
    return days;
  };

  const showPicker = () => {
    overlayRef.current.style.display = 'block';
    datePickerRef.current.style.display = 'flex'; // Change to flex when shown
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(datePickerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  };

  const hidePicker = () => {
    gsap.to(datePickerRef.current, {
      opacity: 0, duration: 0.3, onComplete: () => {
        datePickerRef.current.style.display = 'none';
      }
    });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.5, onComplete: () => {
        overlayRef.current.style.display = 'none';
      }
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target === overlayRef.current) {
        hidePicker();
      }
    };

    if (overlayRef.current) {
      overlayRef.current.addEventListener('click', handleOutsideClick);
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.removeEventListener('click', handleOutsideClick);
      }
    };
  }, []);

  return (
    <DatePickerWrapper>
      <HeaderText>{title}</HeaderText>
      <TextParagraph className="text-white text-medium">
        {paragraphText}
      </TextParagraph>
      <InputField
        value={selectedDate}
        onClick={showPicker}
        placeholder="Enter your birthdate"
        readOnly
      />
      <Overlay ref={overlayRef} />
      <DatePickerContainer ref={datePickerRef}>
        <Header>
          <Dropdown
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </Dropdown>
          <Dropdown
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
          >
            {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i).map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </Dropdown>
        </Header>
        <DaysGrid>
          {daysOfWeek.map((day) => (
            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {day}
            </div>
          ))}
          {updateDays()}
        </DaysGrid>
      </DatePickerContainer>
      {birthdateExists && (
        <Button text={buttonLabel} onClick={handleNextClick} />
      )}
    </DatePickerWrapper>
  );
};

export default DatePicker;