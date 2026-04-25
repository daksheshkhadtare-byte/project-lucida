import React, { useState, useEffect } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import ReadingPane from './components/ReadingPane';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useHighlighter } from './hooks/useHighlighter';
import { applySettings } from './utils/cssProperties';

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
};

function App() {
  const [settings, setSettings] = useLocalStorage('lucida_current_settings', defaultSettings);
  const [presets, setPresets] = useLocalStorage('lucida_presets', []);
  const [tokens, setTokens] = useState([]);
  const [isImmersion, setIsImmersion] = useState(false);

  const highlighter = useHighlighter(tokens, settings);

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const setSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app-container">
      <header className={`header ${isImmersion ? 'immersion' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <h1 className="header-title">Project Lucida</h1>
          <span className="header-subtitle">Adaptive Reading Environment</span>
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
        />
        <ReadingPane 
          tokens={tokens}
          highlighter={highlighter}
          showRuler={settings.showRuler}
        />
      </main>

      {isImmersion && (
        <>
          <button className="exit-immersion" onClick={() => setIsImmersion(false)}>
            Exit Immersion
          </button>
          
          <div className="immersion-toolbar">
            <button className="secondary" onClick={highlighter.prev}>&larr;</button>
            <button onClick={highlighter.toggleAutoPlay}>
              {highlighter.isAutoPlaying ? 'Pause' : highlighter.completed ? 'Restart' : 'Auto Play'}
            </button>
            <button className="secondary" onClick={highlighter.next}>&rarr;</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;