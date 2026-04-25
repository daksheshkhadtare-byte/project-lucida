import { useState, useEffect, useRef } from 'react';

export function useHighlighter(tokens, settings, selectedVoice) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  // Timer states
  const [wordsRead, setWordsRead] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const speed = settings.highlightSpeed ?? 1500;

  const validTokens = tokens.filter(t => !t.isParagraph);

  const isAutoPlayingRef = useRef(isAutoPlaying);
  isAutoPlayingRef.current = isAutoPlaying;

  const isReadingRef = useRef(isReading);
  isReadingRef.current = isReading;

  // Text-to-Speech logic
  const currentWord = currentIndex >= 0 && currentIndex < validTokens.length ? validTokens[currentIndex].word : null;
  const isSpeechEnabled = settings.isSpeechEnabled;
  const speechRate = settings.speechRate ?? 0.9;
  
  useEffect(() => {
    if (!isSpeechEnabled || !currentWord) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (isAutoPlayingRef.current) {
        const gap = Math.max(0, speed - 1000);
        setTimeout(() => {
          if (!isAutoPlayingRef.current) return;
          setCurrentIndex(i => {
            if (i >= validTokens.length - 1) {
              setIsAutoPlaying(false);
              setCompleted(true);
              setIsReading(false);
              return i;
            }
            if (!isReadingRef.current) setIsReading(true);
            return i + 1;
          });
        }, gap);
      }
    };

    utterance.onerror = () => {
      if (isAutoPlayingRef.current) {
        setTimeout(() => {
          if (!isAutoPlayingRef.current) return;
          setCurrentIndex(i => {
            if (i >= validTokens.length - 1) {
              setIsAutoPlaying(false);
              setCompleted(true);
              setIsReading(false);
              return i;
            }
            if (!isReadingRef.current) setIsReading(true);
            return i + 1;
          });
        }, speed);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [currentIndex, isSpeechEnabled]); // deliberate dependency array per requirements

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-advance interval (only used when speech is OFF)
  useEffect(() => {
    let interval = null;
    if (isAutoPlaying && !completed && validTokens.length > 0 && !isSpeechEnabled) {
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
  }, [isAutoPlaying, completed, speed, validTokens.length, isReading, isSpeechEnabled]);

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