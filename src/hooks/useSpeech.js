import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [rate, setRate] = useState(0.9);
  const [volume, setVolume] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isEnabledRef = useRef(false);
  const rateRef = useRef(0.9);
  const volumeRef = useRef(1.0);
  const selectedVoiceNameRef = useRef('');
  const voicesRef = useRef([]);

  useEffect(() => { isEnabledRef.current = isEnabled; }, [isEnabled]);
  useEffect(() => { rateRef.current = rate; }, [rate]);
  useEffect(() => { volumeRef.current = volume; }, [volume]);
  useEffect(() => { selectedVoiceNameRef.current = selectedVoiceName; }, [selectedVoiceName]);
  useEffect(() => { voicesRef.current = voices; }, [voices]);

  // Load voices — Edge needs the onvoiceschanged event
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const english = all.filter(v => v.lang && v.lang.startsWith('en'));
      if (english.length === 0) return;
      voicesRef.current = english;
      setVoices(english);
      if (!selectedVoiceNameRef.current) {
        const preferred = english.find(v =>
          v.name.includes('David') ||
          v.name.includes('Zira') ||
          v.name.includes('Mark') ||
          v.name.includes('Natural')
        ) || english[0];
        selectedVoiceNameRef.current = preferred.name;
        setSelectedVoiceName(preferred.name);
      }
    };

    // Try immediately and also on voiceschanged (needed for Edge/Chrome)
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Edge sometimes needs a small delay
    const t = setTimeout(loadVoices, 500);

    return () => {
      clearTimeout(t);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((word) => {
    if (!isEnabledRef.current) return;
    if (!word || word.trim() === '' || word === '\n\n') return;
    if (!window.speechSynthesis) return;

    try {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word.trim());
      utterance.rate = rateRef.current;
      utterance.volume = volumeRef.current;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      const voice = voicesRef.current.find(v => v.name === selectedVoiceNameRef.current);
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      // Edge requires a small setTimeout before speak() call
      setTimeout(() => {
        if (window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);

    } catch (err) {
      console.warn('Speech error (non-fatal):', err);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback((val) => {
    if (!val) stop();
    isEnabledRef.current = val;
    setIsEnabled(val);
  }, [stop]);

  const changeVoice = useCallback((name) => {
    stop();
    selectedVoiceNameRef.current = name;
    setSelectedVoiceName(name);
  }, [stop]);

  return {
    isEnabled, toggle,
    rate, setRate,
    volume, setVolume,
    voices, selectedVoiceName, changeVoice,
    isSpeaking, speak, stop,
  };
};
