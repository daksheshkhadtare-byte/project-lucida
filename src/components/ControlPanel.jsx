import React, { useState, useEffect } from 'react';
import TextInput from './TextInput';
import FontSelector from './FontSelector';
import SliderGroup from './SliderGroup';
import BackgroundPalette from './BackgroundPalette';
import HighlightControls from './HighlightControls';
import ReadingStats from './ReadingStats';
import PresetManager from './PresetManager';

export default function ControlPanel({ 
  isImmersion, 
  settings, 
  setSetting, 
  setSettings,
  onTokensUpdate,
  highlighter,
  presets,
  setPresets,
  showToast
}) {
  const [showBanner, setShowBanner] = useState(presets.length > 0);

  useEffect(() => {
    if (presets.length > 0) {
      const timer = setTimeout(() => {
        setShowBanner(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [presets.length]);

  return (
    <div className={`control-panel ${isImmersion ? 'immersion' : ''}`}>
      {showBanner && (
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(124, 106, 247, 0.2), rgba(167, 139, 250, 0.1))',
            border: '1px solid #7c6af7',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeIn 0.5s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e2f0', fontSize: '14px', fontWeight: '500' }}>
            <span>💾</span> Welcome back! Your saved presets are ready.
          </div>
          <button 
            className="secondary" 
            style={{ fontSize: '12px', padding: '6px', width: 'fit-content' }}
            onClick={() => {
              document.getElementById('presets-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
          >
            View Presets ↓
          </button>
        </div>
      )}
      
      <TextInput onTokensUpdate={onTokensUpdate} resetHighlighter={highlighter.resetStats} />
      <FontSelector currentFont={settings.fontFace} setSetting={setSetting} />
      <SliderGroup settings={settings} setSetting={setSetting} setSettings={setSettings} showToast={showToast} />
      <BackgroundPalette currentBg={settings.bgTint} setSetting={setSetting} />
      <HighlightControls highlighter={highlighter} settings={settings} setSetting={setSetting} />
      <ReadingStats highlighter={highlighter} />
      
      <div className="card" style={{ marginBottom: '16px' }}>
        <h3>Text Ruler</h3>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.showRuler} 
              onChange={(e) => setSetting('showRuler', e.target.checked)} 
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">Show Text Ruler</span>
        </div>
      </div>

      <PresetManager 
        settings={settings} 
        onLoadPreset={setSettings} 
        presets={presets}
        setPresets={setPresets}
      />
    </div>
  );
}