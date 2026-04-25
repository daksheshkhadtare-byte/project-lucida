import { useState, useEffect } from 'react';

export function useHighlighter(tokens, settings) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Timer states
  const [wordsRead, setWordsRead] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const speed = settings.highlightSpeed ?? 1500;

  const validTokens = tokens.filter(t => !t.isParagraph);
  
  const currentWord = currentIndex >= 0 && currentIndex < validTokens.length ? validTokens[currentIndex].word : null;

  // Auto-advance interval
  useEffect(() => {
    let interval = null;
    if (isAutoPlaying && !completed && validTokens.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= validTokens.length - 1) {
            setIsAutoPlaying(false);
            setCompleted(true);
            setIsReading(false);
            return prev;
          }
          if (prev === -1 && !isReading) {
            setIsReading(true);
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, completed, speed, validTokens.length, isReading]);

  // Reading Timer
  useEffect(() => {
    let timer = null;
    if (isReading) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isReading]);

  // Update words read when index changes
  useEffect(() => {
    if (currentIndex >= 0) {
      setWordsRead(prev => Math.max(prev, currentIndex + 1));
      if (!isReading && !completed && isAutoPlaying) setIsReading(true);
    }
  }, [currentIndex, isReading, completed, isAutoPlaying]);

  const next = () => {
    if (currentIndex < validTokens.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCompleted(false);
      if (!isReading) setIsReading(true);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCompleted(false);
    } else {
      setCurrentIndex(-1);
    }
  };

  const jumpTo = (index) => {
    setCurrentIndex(index);
    setCompleted(false);
    if (!isReading) setIsReading(true);
  };

  const toggleAutoPlay = () => {
    if (currentIndex >= validTokens.length - 1) {
      setCurrentIndex(0);
      setCompleted(false);
    }
    setIsAutoPlaying(!isAutoPlaying);
  };
  
  const resetStats = () => {
    setWordsRead(0);
    setTimeElapsed(0);
    setIsReading(false);
    setCurrentIndex(-1);
    setIsAutoPlaying(false);
    setCompleted(false);
  };

  return {
    currentIndex,
    currentWord,
    isAutoPlaying,
    completed,
    next,
    prev,
    jumpTo,
    toggleAutoPlay,
    setIsAutoPlaying,
    totalValidTokens: validTokens.length,
    wordsRead,
    timeElapsed,
    resetStats
  };
}