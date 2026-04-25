import React, { useState } from 'react';

const defaults = {
  letterSpacing: 0.05,
  wordSpacing: 0.1,
  lineHeight: 1.8,
  columnWidth: 65,
  paragraphSpacing: 1.5
};

export default function SliderGroup({ settings, setSetting, setSettings, showToast }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleReset = (key) => setSetting(key, defaults[key]);

  const applySuggestion = (suggestionKey) => {
    if (suggestionKey === 'dyslexia') {
      setSettings(prev => ({
        ...prev,
        letterSpacing: 0.12,
        wordSpacing: 0.25,
        lineHeight: 2.2,
        fontFace: 'OpenDyslexic'
      }));
      showToast('Settings applied for Dyslexia');
    } else if (suggestionKey === 'visual') {
      setSettings(prev => ({
        ...prev,
        bgTint: '#fefae0', // Cream
        lineHeight: 2.0,
        letterSpacing: 0.08,
        fontFace: 'Lexie Readable'
      }));
      showToast('Settings applied for Visual Stress');
    } else if (suggestionKey === 'focus') {
      setSettings(prev => ({
        ...prev,
        autoAdvance: true,
        highlightSpeed: 1500,
        letterSpacing: 0.10,
        lineHeight: 1.9,
        fontFace: 'Georgia'
      }));
      showToast('Settings applied for ADHD/Focus');
    }
  };

  const getProgress = (val, min, max) => ((val - min) / (max - min)) * 100;

  const letterSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.letterSpacing ?? 0.05, 0, 0.3)}%, #2a2a4a ${getProgress(settings.letterSpacing ?? 0.05, 0, 0.3)}%)`;
  const wordSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.wordSpacing ?? 0.1, 0, 0.5)}%, #2a2a4a ${getProgress(settings.wordSpacing ?? 0.1, 0, 0.5)}%)`;
  const lineHeightBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.lineHeight ?? 1.8, 1.2, 3.0)}%, #2a2a4a ${getProgress(settings.lineHeight ?? 1.8, 1.2, 3.0)}%)`;
  const columnWidthBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.columnWidth ?? 65, 40, 90)}%, #2a2a4a ${getProgress(settings.columnWidth ?? 65, 40, 90)}%)`;
  const paragraphSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.paragraphSpacing ?? 1.5, 0.5, 3)}%, #2a2a4a ${getProgress(settings.paragraphSpacing ?? 1.5, 0.5, 3)}%)`;

  return (
    <div className="card" id="typography-controls-card">
      <h3>Typography Controls</h3>
      
      <div style={{ marginBottom: '15px', background: '#0f0f1a', borderRadius: '8px', border: '1px solid #2a2a4a', overflow: 'hidden' }}>
        <button 
          onClick={() => setShowSuggestions(!showSuggestions)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', padding: '10px', color: '#e2e2f0' }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>💡 Recommended Settings</span>
          <span style={{ fontSize: '10px', color: '#a78bfa' }}>{showSuggestions ? '▲ Hide' : '▼ Show suggestions'}</span>
        </button>
        
        {showSuggestions && (
          <div style={{ padding: '10px', borderTop: '1px solid #2a2a4a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
              <div>
                <strong style={{ color: '#a78bfa', display: 'block', marginBottom: '2px' }}>For Dyslexia</strong>
                <span style={{ color: '#888' }}>OpenDyslexic, Letter: 0.12em, Word: 0.25em, Line: 2.2</span>
              </div>
              <button className="secondary" style={{ padding: '2px 8px', fontSize: '10px', flexShrink: 0 }} onClick={() => applySuggestion('dyslexia')}>Apply</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
              <div>
                <strong style={{ color: '#a78bfa', display: 'block', marginBottom: '2px' }}>For Visual Stress</strong>
                <span style={{ color: '#888' }}>Lexie Readable, Cream Bg, Letter: 0.08em, Line: 2.0</span>
              </div>
              <button className="secondary" style={{ padding: '2px 8px', fontSize: '10px', flexShrink: 0 }} onClick={() => applySuggestion('visual')}>Apply</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
              <div>
                <strong style={{ color: '#a78bfa', display: 'block', marginBottom: '2px' }}>For ADHD/Focus</strong>
                <span style={{ color: '#888' }}>Georgia, Auto-advance 1.5s, Letter: 0.10em, Line: 1.9</span>
              </div>
              <button className="secondary" style={{ padding: '2px 8px', fontSize: '10px', flexShrink: 0 }} onClick={() => applySuggestion('focus')}>Apply</button>
            </div>
          </div>
        )}
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="letter-spacing">Letter Spacing</label>
          <div>
            <span className="slider-value">{(settings.letterSpacing ?? 0.05).toFixed(2)}em</span>
            <button className="slider-reset" onClick={() => handleReset('letterSpacing')} aria-label="Reset Letter Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="letter-spacing"
          type="range" min="0" max="0.3" step="0.01" 
          value={settings.letterSpacing ?? 0.05} 
          onChange={(e) => setSetting('letterSpacing', parseFloat(e.target.value))}
          style={{ background: letterSpacingBg }}
          aria-label="Letter Spacing slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="word-spacing">Word Spacing</label>
          <div>
            <span className="slider-value">{(settings.wordSpacing ?? 0.1).toFixed(2)}em</span>
            <button className="slider-reset" onClick={() => handleReset('wordSpacing')} aria-label="Reset Word Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="word-spacing"
          type="range" min="0" max="0.5" step="0.01" 
          value={settings.wordSpacing ?? 0.1} 
          onChange={(e) => setSetting('wordSpacing', parseFloat(e.target.value))}
          style={{ background: wordSpacingBg }}
          aria-label="Word Spacing slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="line-height">Line Height</label>
          <div>
            <span className="slider-value">{(settings.lineHeight ?? 1.8).toFixed(1)}</span>
            <button className="slider-reset" onClick={() => handleReset('lineHeight')} aria-label="Reset Line Height">Reset</button>
          </div>
        </div>
        <input 
          id="line-height"
          type="range" min="1.2" max="3.0" step="0.1" 
          value={settings.lineHeight ?? 1.8} 
          onChange={(e) => setSetting('lineHeight', parseFloat(e.target.value))}
          style={{ background: lineHeightBg }}
          aria-label="Line Height slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="column-width">Column Width</label>
          <div>
            <span className="slider-value">{settings.columnWidth ?? 65}ch</span>
            <button className="slider-reset" onClick={() => handleReset('columnWidth')} aria-label="Reset Column Width">Reset</button>
          </div>
        </div>
        <input 
          id="column-width"
          type="range" min="40" max="90" step="1" 
          value={settings.columnWidth ?? 65} 
          onChange={(e) => setSetting('columnWidth', parseInt(e.target.value))}
          style={{ background: columnWidthBg }}
          aria-label="Column Width slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="paragraph-spacing">Paragraph Spacing</label>
          <div>
            <span className="slider-value">{(settings.paragraphSpacing ?? 1.5).toFixed(1)}rem</span>
            <button className="slider-reset" onClick={() => handleReset('paragraphSpacing')} aria-label="Reset Paragraph Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="paragraph-spacing"
          type="range" min="0.5" max="3" step="0.1" 
          value={settings.paragraphSpacing ?? 1.5} 
          onChange={(e) => setSetting('paragraphSpacing', parseFloat(e.target.value))}
          style={{ background: paragraphSpacingBg }}
          aria-label="Paragraph Spacing slider"
        />
      </div>
    </div>
  );
}