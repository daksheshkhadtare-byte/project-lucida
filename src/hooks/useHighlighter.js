import { useState, useEffect } from 'react';

export function useHighlighter(tokens, settings, speak, isSpeechEnabled, speechControls = {}) {
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

  const { speechRate, speechPitch, speechVolume, selectedVoiceName } = speechControls;

  // 1) Pure Timer Auto-Advance
  useEffect(() => {
    if (!isAutoPlaying || !words || words.length === 0) return;

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

  }, [isAutoPlaying, currentIndex, highlightSpeed, words]);

  // 2) Independent Speech Effect
  useEffect(() => {
    if (!isSpeechEnabled || !words || words.length === 0) return;
    const currentWordToSpeak = words[currentIndex]?.word;
    if (!currentWordToSpeak || currentWordToSpeak === '\n\n') return;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentWordToSpeak);
    utterance.rate = speechRate || 0.85;
    utterance.pitch = speechPitch || 1.0;
    utterance.volume = speechVolume || 1.0;

    if (selectedVoiceName) {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, isSpeechEnabled, words, speechRate, speechPitch, speechVolume, selectedVoiceName]);

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