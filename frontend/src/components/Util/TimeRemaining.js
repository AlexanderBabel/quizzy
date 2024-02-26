import React, { useState, useEffect } from 'react';
import "./TimeRemaining.css";


const TimeRemaining = ({ endTime }) => {
  const calculateTimeLeft = () => {
    const now = Date.now(); // ?? Maybe another way
    const end = new Date(endTime).getTime();
    const timeLeft = end - now;
    return timeLeft > 0 ? Math.round(timeLeft / 1000) : 0;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Update the countdown every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="timeBox">
      Time Remaining: {timeLeft} seconds
    </div>
  );
};

export default TimeRemaining;
