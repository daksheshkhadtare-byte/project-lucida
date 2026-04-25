import React from 'react';
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
  setPresets
}) {
  return (
    <div className={`control-panel ${isImmersion ? 'immersion' : ''}`}>
      <TextInput onTokensUpdate={onTokensUpdate} resetHighlighter={highlighter.resetStats} />
      <FontSelector currentFont={settings.fontFace} setSetting={setSetting} />
      <SliderGroup settings={settings} setSetting={setSetting} />
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