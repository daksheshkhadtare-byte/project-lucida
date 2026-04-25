import React, { useState, useEffect } from 'react';

export default function HighlightControls({ highlighter, settings, setSetting }) {
  const {
    currentIndex, isAutoPlaying, completed,
    next, prev, toggleAutoPlay, totalValidTokens
  } = highlighter;

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
      setVoices(englishVoices);
      
      if (!settings.speechVoice && englishVoices.length > 0) {
        setSetting('speechVoice', englishVoices[0].name);
      }
    };
    
    // Call once in case they are already loaded
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [settings.speechVoice, setSetting]);

  const progress = totalValidTokens > 0 ? ((currentIndex + 1) / totalValidTokens) * 100 : 0;

  const speedProgress = (((settings.highlightSpeed ?? 1500) - 500) / (4000 - 500)) * 100;
  const highlightSpeedBg = `linear-gradient(to right, #a78bfa ${speedProgress}%, #2a2a4a ${speedProgress}%)`;
  
  const speechRateProgress = (((settings.speechRate ?? 0.9) - 0.5) / (1.5 - 0.5)) * 100;
  const speechRateBg = `linear-gradient(to right, #a78bfa ${speechRateProgress}%, #2a2a4a ${speechRateProgress}%)`;

  return (
    <div className="card" id="highlight-card">
      <h3>Word Highlighter</h3>
      
      <div className="highlight-controls">
        <div className="highlight-row">
          <button className="secondary" onClick={prev}>&larr; Prev</button>
          <button className="secondary" onClick={next}>Next &rarr;</button>
        </div>

        <div className="toggle-container" style={{ marginTop: '10px' }}>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.autoAdvance} 
              onChange={(e) => {
                setSetting('autoAdvance', e.target.checked);
                if (!e.target.checked && isAutoPlaying) toggleAutoPlay();
              }} 
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Auto-Advance</span>
        </div>

        {settings.autoAdvance && (
          <>
            <div className="slider-group">
              <div className="slider-header">
                <label className="slider-label" htmlFor="speed">Interval: {(settings.highlightSpeed ?? 1500) / 1000}s</label>
              </div>
              <input 
                id="speed"
                type="range" min="500" max="4000" step="100" 
                value={settings.highlightSpeed ?? 1500} 
                onChange={(e) => setSetting('highlightSpeed', parseInt(e.target.value))}
                style={{ background: highlightSpeedBg }}
                aria-label="Highlight Speed slider"
              />
            </div>
            
            <button onClick={toggleAutoPlay}>
              {isAutoPlaying ? 'Pause Auto' : completed ? 'Restart Auto' : 'Start / Resume Auto'}
            </button>
          </>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #2a2a4a', margin: '15px 0' }} />

        <div className="toggle-container">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.isSpeechEnabled} 
              onChange={(e) => {
                setSetting('isSpeechEnabled', e.target.checked);
                if (!e.target.checked) window.speechSynthesis.cancel();
              }} 
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={settings.isSpeechEnabled ? 'pulsing-speaker' : ''}>🔊</span> Speak Words Aloud
          </span>
        </div>

        {settings.isSpeechEnabled && (
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="slider-group">
              <div className="slider-header">
                <label className="slider-label" htmlFor="speech-rate">Speech Rate: {(settings.speechRate ?? 0.9).toFixed(1)}x</label>
              </div>
              <input 
                id="speech-rate"
                type="range" min="0.5" max="1.5" step="0.1" 
                value={settings.speechRate ?? 0.9} 
                onChange={(e) => setSetting('speechRate', parseFloat(e.target.value))}
                style={{ background: speechRateBg }}
                aria-label="Speech Rate slider"
              />
            </div>

            <div>
              <label className="slider-label" style={{ display: 'block', marginBottom: '5px' }}>Voice</label>
              <select 
                value={settings.speechVoice || ''} 
                onChange={(e) => setSetting('speechVoice', e.target.value)}
                style={{
                  width: '100%', padding: '8px', background: '#0f0f1a', color: '#e2e2f0', 
                  border: '1px solid #2a2a4a', borderRadius: '4px', fontFamily: 'inherit'
                }}
              >
                {voices.map(v => (
                  <option key={v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid #2a2a4a', margin: '15px 0' }} />

        {completed && <div style={{ color: '#a78bfa', fontSize: 14, textAlign: 'center', marginBottom: '10px' }}>✓ Complete</div>}

        <div>
          <div style={{ fontSize: 10, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
            <span>Progress</span>
            <span>{Math.max(0, currentIndex + 1)} / {totalValidTokens}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
        </div>

        <div style={{ marginTop: '10px' }}>
          <div className="slider-header">
            <span className="slider-label" style={{ fontSize: '12px' }}>Highlight Style</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
            {['marker', 'underline', 'box'].map(style => (
              <button 
                key={style}
                className={`secondary ${settings.highlightStyle === style ? 'active-style' : ''}`}
                style={{ flex: 1, padding: '4px', fontSize: '12px', textTransform: 'capitalize', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                onClick={() => setSetting('highlightStyle', style)}
              >
                {style}
                {style === 'marker' && <span style={{display: 'inline-block', background: 'linear-gradient(135deg, #ffd166, #f4a261)', color: '#1a1a2e', padding: '0 4px', borderRadius: '2px', fontSize: '10px'}}>word</span>}
                {style === 'underline' && <span style={{display: 'inline-block', borderBottom: '2px solid #ffd166', padding: '0 4px', fontSize: '10px'}}>word</span>}
                {style === 'box' && <span style={{display: 'inline-block', border: '1px solid #ffd166', borderRadius: '2px', padding: '0 4px', fontSize: '10px'}}>word</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}