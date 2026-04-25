import React from 'react';

export default function HighlightControls({ highlighter, settings, setSetting }) {
  const {
    currentIndex, isAutoPlaying, completed,
    next, prev, toggleAutoPlay, totalValidTokens
  } = highlighter;

  const progress = totalValidTokens > 0 ? ((currentIndex + 1) / totalValidTokens) * 100 : 0;

  const speedProgress = ((settings.highlightSpeed - 500) / (4000 - 500)) * 100;
  const highlightSpeedBg = `linear-gradient(to right, #a78bfa ${speedProgress}%, #2a2a4a ${speedProgress}%)`;

  return (
    <div className="card">
      <h3>Word Highlighter</h3>
      
      <div className="highlight-controls">
        <div className="highlight-row">
          <button className="secondary" onClick={prev}>&larr; Prev</button>
          <button className="secondary" onClick={next}>Next &rarr;</button>
        </div>

        <div className="toggle-container">
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
                <label className="slider-label" htmlFor="speed">Interval: {settings.highlightSpeed / 1000}s</label>
              </div>
              <input 
                id="speed"
                type="range" min="500" max="4000" step="100" 
                value={settings.highlightSpeed} 
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

        {completed && <div style={{ color: '#a78bfa', fontSize: 14, textAlign: 'center' }}>✓ Complete</div>}

        <div>
          <div style={{ fontSize: 10, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
            <span>Progress</span>
            <span>{Math.max(0, currentIndex + 1)} / {totalValidTokens}</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}