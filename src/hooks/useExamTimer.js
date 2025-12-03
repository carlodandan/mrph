import { useState, useEffect, useCallback } from 'react';

export function useExamTimer(initialTime, onTimeUp, autoSaveInterval = 30) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const addTime = useCallback((seconds) => {
    setTimeRemaining(prev => prev + seconds);
  }, []);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeRemaining, onTimeUp]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    pauseTimer,
    resumeTimer,
    addTime,
    setTimeRemaining
  };
}