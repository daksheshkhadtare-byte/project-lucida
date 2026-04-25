import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import ReadingPane from './components/ReadingPane';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHighlighter } from './hooks/useHighlighter';
import { applySettings } from './utils/cssProperties';
import OnboardingTour from './components/OnboardingTour';

const defaultSettings = {
  fontFace: 'OpenDyslexic',
  letterSpacing: 0.05,
  wordSpacing: 0.10,
  lineHeight: 1.8,
  paragraphSpacing: 1.5,
  columnWidth: 65,
  bgTint: '#fefae0',
  autoAdvance: false,
  highlightSpeed: 1500,
  showRuler: true,
  highlightStyle: 'marker',
  isSpeechEnabled: false,
  speechRate: 0.9,
  speechVoice: null
};

function App() {
  const [settings, setSettings] = useLocalStorage('lucida_current_settings', defaultSettings);
  const [presets, setPresets] = useLocalStorage('lucida_presets', []);
  const [tokens, setTokens] = useState([]);
  const [isImmersion, setIsImmersion] = useState(false);
  const [toast, setToast] = useState(null);
  
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const highlighter = useHighlighter(tokens, settings);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const setSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const progressPercent = highlighter.totalValidTokens > 0 
    ? ((Math.max(0, highlighter.currentIndex + 1)) / highlighter.totalValidTokens) * 100 
    : 0;

  return (
    <div className="app-container">
      <div className="global-progress" style={{ width: `${progressPercent}%`, background: 'linear-gradient(to right, #7c6af7, #ffd166)' }}></div>
      <header className={`header ${isImmersion ? 'immersion' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '10px', flexShrink: 0, animation: 'pulse-glow 3s ease-in-out infinite'}}>
            <circle cx="19" cy="19" r="17" fill="url(#grad1)" opacity="0.15"/>
            <path d="M4 19 C8 10 14 6 19 6 C24 6 30 10 34 19 C30 28 24 32 19 32 C14 32 8 28 4 19Z" fill="none" stroke="url(#grad2)" strokeWidth="2"/>
            <circle cx="19" cy="19" r="7" fill="none" stroke="#a78bfa" strokeWidth="1.5"/>
            <circle cx="19" cy="19" r="3.5" fill="url(#grad1)"/>
            <circle cx="21.5" cy="16.5" r="1.2" fill="white" opacity="0.9"/>
            <line x1="4" y1="15" x2="11" y2="15" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="4" y1="19" x2="9" y2="19" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <line x1="4" y1="23" x2="11" y2="23" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="27" y1="15" x2="34" y2="15" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <line x1="29" y1="19" x2="34" y2="19" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
            <line x1="27" y1="23" x2="34" y2="23" stroke="#7c6af7" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c6af7"/>
                <stop offset="100%" stopColor="#ffd166"/>
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c6af7"/>
                <stop offset="50%" stopColor="#a78bfa"/>
                <stop offset="100%" stopColor="#ffd166"/>
              </linearGradient>
            </defs>
          </svg>
          <h1 className="header-title" style={{ display: 'flex', alignItems: 'baseline' }}>
            Lumina
            <span className="header-subtitle">Adaptive Reading Environment</span>
          </h1>
        </div>
        <button onClick={() => setIsImmersion(true)}>Immersion Mode</button>
      </header>

      <main className={`app-content ${isImmersion ? 'immersion' : ''}`}>
        <ControlPanel 
          isImmersion={isImmersion}
          settings={settings}
          setSetting={setSetting}
          setSettings={setSettings}
          onTokensUpdate={setTokens}
          highlighter={highlighter}
          presets={presets}
          setPresets={setPresets}
          showToast={showToast}
        />
        <ReadingPane 
          tokens={tokens}
          highlighter={highlighter}
          showRuler={settings.showRuler}
          highlightStyle={settings.highlightStyle}
          setSetting={setSetting}
          showToast={showToast}
        />
        <OnboardingTour />
      </main>

      {isImmersion && (
        <>
          <button className="exit-immersion" onClick={() => setIsImmersion(false)}>
            Exit Immersion
          </button>
          
          <div className="immersion-toolbar">
            <button className="secondary" onClick={highlighter.prev}>Prev</button>
            <span style={{ color: '#e2e2f0', fontSize: '14px', margin: '0 10px' }}>
              {Math.max(0, highlighter.currentIndex + 1)} / {highlighter.totalValidTokens}
            </span>
            <button className="secondary" onClick={highlighter.next}>Next</button>
            <div style={{ width: '1px', height: '24px', background: '#2a2a4a', margin: '0 5px' }}></div>
            <button onClick={highlighter.toggleAutoPlay}>
              {highlighter.isAutoPlaying ? 'Pause' : highlighter.completed ? 'Restart' : 'Resume'}
            </button>
          </div>
        </>
      )}

      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;