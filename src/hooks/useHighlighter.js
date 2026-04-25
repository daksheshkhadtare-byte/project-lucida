import { useState, useEffect } from 'react';

export function useHighlighter(tokens, settings, speak, isSpeechEnabled) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Timer states
  const [wordsRead, setWordsRead] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const highlightSpeed = settings.highlightSpeed ?? 1500;

  const words = tokens.filter(t => !t.isParagraph);
  const validTokens = words; // for backwards compatibility in the file
  
  const currentWord = currentIndex >= 0 && currentIndex < words.length ? words[currentIndex].word : null;

  // Auto-advance interval synced with speech
  useEffect(() => {
    if (!isAutoPlaying || !words || words.length === 0) return;

    const currentWord = words[currentIndex]?.word;

    if (isSpeechEnabled && currentWord && currentWord !== '\n\n') {
      speak(currentWord, () => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      });
      return () => {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      };
    } else {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => {
          if (prev >= words.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, highlightSpeed || 1500);
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, currentIndex, isSpeechEnabled, highlightSpeed, words, speak]);

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
    if (currentIndex < words.length - 1) {
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
    if (currentIndex >= words.length - 1) {
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
    totalValidTokens: words.length,
    wordsRead,
    timeElapsed,
    resetStats
  };
}