import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = () => {
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);
  const isSpeechEnabledRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isSpeechEnabledRef.current = isSpeechEnabled;
  }, [isSpeechEnabled]);

  // Load voices safely
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoices = voices.filter(v =>
        v.lang.startsWith('en')
      );
      setAvailableVoices(englishVoices);
      if (englishVoices.length > 0 && !selectedVoiceName) {
        // Prefer natural/online voices
        const preferred = englishVoices.find(v =>
          v.name.includes('Natural') ||
          v.name.includes('Online') ||
          v.name.includes('Joanne') ||
          v.name.includes('Samantha')
        );
        setSelectedVoiceName(preferred?.name || englishVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((word, onComplete) => {
    if (!isSpeechEnabledRef.current) {
      onComplete?.();
      return;
    }
    if (!window.speechSynthesis || !word || word === '\n\n') {
      onComplete?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word.trim());

      // Apply selected voice
      if (selectedVoiceName && availableVoices.length > 0) {
        const voice = availableVoices.find(v => v.name === selectedVoiceName);
        if (voice) utterance.voice = voice;
      }

      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = speechVolume;
      utterance.lang = 'en-US';

      utterance.onstart = () => setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        onComplete?.();
      };

      utterance.onerror = (e) => {
        setIsSpeaking(false);
        // Only call onComplete if it wasn't manually cancelled
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          onComplete?.();
        }
      };

      utteranceRef.current = utterance;

      // Small delay prevents Chrome audio context issues
      setTimeout(() => {
        if (isSpeechEnabledRef.current && window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 30);

    } catch(e) {
      console.warn('Speech error:', e);
      onComplete?.();
    }
  }, [speechRate, speechPitch, speechVolume, selectedVoiceName, availableVoices]);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const toggleSpeech = useCallback((value) => {
    if (!value) stopSpeaking();
    setIsSpeechEnabled(value);
  }, [stopSpeaking]);

  return {
    isSpeechEnabled,
    toggleSpeech,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    speechVolume,
    setSpeechVolume,
    availableVoices,
    selectedVoiceName,
    setSelectedVoiceName,
    isSpeaking,
    speak,
    stopSpeaking
  };
};
