import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 600px;
  width: 100%;
  margin: 16px auto;
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
`;

const DatePickerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  display: none;
  padding: 16px;
  text-align: center;
  width: 80%;
  max-width: 600px;
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
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const Day = styled.button`
  text-align: center;
  border: none;
  padding: 8px;
  cursor: pointer;
  background: ${(props) => (props.isFuture ? '#fff' : '#f5f5f5')};
  color: ${(props) => (props.isFuture ? '#ccc' : '#333')};
  border-radius: 4px;
  font-size: 1.25rem;
  pointer-events: ${(props) => (props.isFuture ? 'none' : 'auto')};
`;

const DatePicker = ({ onDateSelected }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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
      const isFuture = new Date(currentYear, currentMonth, i) > today;
      days.push(
        <Day
          key={i}
          isFuture={isFuture}
          onClick={() => {
            if (!isFuture) {
              const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
              setSelectedDate(`${i} ${months[currentMonth]}, ${currentYear}`);
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
    datePickerRef.current.style.display = 'block';
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(datePickerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  };

  const hidePicker = () => {
    gsap.to(datePickerRef.current, { opacity: 0, duration: 0.3, onComplete: () => {
      datePickerRef.current.style.display = 'none';
    }});
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
      overlayRef.current.style.display = 'none';
    }});
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target === overlayRef.current) {
        hidePicker();
      }
    };

    overlayRef.current.addEventListener('click', handleOutsideClick);
    return () => overlayRef.current.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <DatePickerWrapper>
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
    </DatePickerWrapper>
  );
};

export default DatePicker;