import { useState, useRef, useEffect, useCallback } from 'react';

export const useHighlighter = ({ words = [], initialSpeed = 1500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [highlightSpeed, setHighlightSpeed] = useState(initialSpeed);

  const isPlayingRef = useRef(false);
  const speedRef = useRef(initialSpeed);
  const indexRef = useRef(0);
  const wordsRef = useRef(words);
  const timerRef = useRef(null);

  // Keep refs synced
  useEffect(() => { wordsRef.current = words; }, [words]);
  useEffect(() => { speedRef.current = highlightSpeed; }, [highlightSpeed]);
  useEffect(() => { indexRef.current = currentIndex; }, [currentIndex]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    isPlayingRef.current = true;
    setIsAutoPlaying(true);

    timerRef.current = setInterval(() => {
      const nextIndex = indexRef.current + 1;
      const total = wordsRef.current.length;
      if (nextIndex >= total) {
        stopTimer();
        isPlayingRef.current = false;
        setIsAutoPlaying(false);
        return;
      }
      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
    }, speedRef.current);
  }, [stopTimer]);

  const stopAuto = useCallback(() => {
    stopTimer();
    isPlayingRef.current = false;
    setIsAutoPlaying(false);
  }, [stopTimer]);

  const updateSpeed = useCallback((newSpeed) => {
    speedRef.current = newSpeed;
    setHighlightSpeed(newSpeed);
    // If currently playing, restart timer with new speed immediately
    if (isPlayingRef.current) {
      stopTimer();
      timerRef.current = setInterval(() => {
        const nextIndex = indexRef.current + 1;
        const total = wordsRef.current.length;
        if (nextIndex >= total) {
          stopTimer();
          isPlayingRef.current = false;
          setIsAutoPlaying(false);
          return;
        }
        indexRef.current = nextIndex;
        setCurrentIndex(nextIndex);
      }, newSpeed);
    }
  }, [stopTimer]);

  const goNext = useCallback(() => {
    const next = Math.min(indexRef.current + 1, wordsRef.current.length - 1);
    indexRef.current = next;
    setCurrentIndex(next);
  }, []);

  const goPrev = useCallback(() => {
    const prev = Math.max(indexRef.current - 1, 0);
    indexRef.current = prev;
    setCurrentIndex(prev);
  }, []);

  const jumpTo = useCallback((index) => {
    indexRef.current = index;
    setCurrentIndex(index);
  }, []);

  const reset = useCallback(() => {
    stopAuto();
    indexRef.current = 0;
    setCurrentIndex(0);
  }, [stopAuto]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  return {
    currentIndex,
    isAutoPlaying,
    highlightSpeed,
    startAuto: startTimer,
    stopAuto,
    updateSpeed,
    goNext,
    goPrev,
    jumpTo,
    reset,
  };
};