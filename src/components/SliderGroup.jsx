import React from 'react';

const defaults = {
  letterSpacing: 0.05,
  wordSpacing: 0.1,
  lineHeight: 1.8,
  columnWidth: 65,
  paragraphSpacing: 1.5
};

export default function SliderGroup({ settings, setSetting }) {
  const handleReset = (key) => setSetting(key, defaults[key]);

  const getProgress = (val, min, max) => ((val - min) / (max - min)) * 100;

  const letterSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.letterSpacing, 0, 0.3)}%, #2a2a4a ${getProgress(settings.letterSpacing, 0, 0.3)}%)`;
  const wordSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.wordSpacing, 0, 0.5)}%, #2a2a4a ${getProgress(settings.wordSpacing, 0, 0.5)}%)`;
  const lineHeightBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.lineHeight, 1.2, 3.0)}%, #2a2a4a ${getProgress(settings.lineHeight, 1.2, 3.0)}%)`;
  const columnWidthBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.columnWidth, 40, 90)}%, #2a2a4a ${getProgress(settings.columnWidth, 40, 90)}%)`;
  const paragraphSpacingBg = `linear-gradient(to right, #a78bfa ${getProgress(settings.paragraphSpacing, 0.5, 3)}%, #2a2a4a ${getProgress(settings.paragraphSpacing, 0.5, 3)}%)`;

  return (
    <div className="card">
      <h3>Typography Controls</h3>
      
      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="letter-spacing">Letter Spacing</label>
          <div>
            <span className="slider-value">{settings.letterSpacing.toFixed(2)}em</span>
            <button className="slider-reset" onClick={() => handleReset('letterSpacing')} aria-label="Reset Letter Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="letter-spacing"
          type="range" min="0" max="0.3" step="0.01" 
          value={settings.letterSpacing} 
          onChange={(e) => setSetting('letterSpacing', parseFloat(e.target.value))}
          style={{ background: letterSpacingBg }}
          aria-label="Letter Spacing slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="word-spacing">Word Spacing</label>
          <div>
            <span className="slider-value">{settings.wordSpacing.toFixed(2)}em</span>
            <button className="slider-reset" onClick={() => handleReset('wordSpacing')} aria-label="Reset Word Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="word-spacing"
          type="range" min="0" max="0.5" step="0.01" 
          value={settings.wordSpacing} 
          onChange={(e) => setSetting('wordSpacing', parseFloat(e.target.value))}
          style={{ background: wordSpacingBg }}
          aria-label="Word Spacing slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="line-height">Line Height</label>
          <div>
            <span className="slider-value">{settings.lineHeight.toFixed(1)}</span>
            <button className="slider-reset" onClick={() => handleReset('lineHeight')} aria-label="Reset Line Height">Reset</button>
          </div>
        </div>
        <input 
          id="line-height"
          type="range" min="1.2" max="3.0" step="0.1" 
          value={settings.lineHeight} 
          onChange={(e) => setSetting('lineHeight', parseFloat(e.target.value))}
          style={{ background: lineHeightBg }}
          aria-label="Line Height slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="column-width">Column Width</label>
          <div>
            <span className="slider-value">{settings.columnWidth}ch</span>
            <button className="slider-reset" onClick={() => handleReset('columnWidth')} aria-label="Reset Column Width">Reset</button>
          </div>
        </div>
        <input 
          id="column-width"
          type="range" min="40" max="90" step="1" 
          value={settings.columnWidth} 
          onChange={(e) => setSetting('columnWidth', parseInt(e.target.value))}
          style={{ background: columnWidthBg }}
          aria-label="Column Width slider"
        />
      </div>

      <div className="slider-group">
        <div className="slider-header">
          <label className="slider-label" htmlFor="paragraph-spacing">Paragraph Spacing</label>
          <div>
            <span className="slider-value">{settings.paragraphSpacing.toFixed(1)}rem</span>
            <button className="slider-reset" onClick={() => handleReset('paragraphSpacing')} aria-label="Reset Paragraph Spacing">Reset</button>
          </div>
        </div>
        <input 
          id="paragraph-spacing"
          type="range" min="0.5" max="3" step="0.1" 
          value={settings.paragraphSpacing} 
          onChange={(e) => setSetting('paragraphSpacing', parseFloat(e.target.value))}
          style={{ background: paragraphSpacingBg }}
          aria-label="Paragraph Spacing slider"
        />
      </div>
    </div>
  );
}