import React from 'react';

export default function HighlightControls({ highlighter, settings, setSetting, speechControls }) {
  const {
    currentIndex, currentWord, isAutoPlaying, completed,
    next, prev, toggleAutoPlay, totalValidTokens
  } = highlighter;

  const {
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
    stopSpeaking
  } = speechControls || {};

  const progress = totalValidTokens > 0 ? ((currentIndex + 1) / totalValidTokens) * 100 : 0;
  const speedProgress = (((settings.highlightSpeed ?? 1500) - 500) / (4000 - 500)) * 100;
  const highlightSpeedBg = `linear-gradient(to right, #a78bfa ${speedProgress}%, #2a2a4a ${speedProgress}%)`;

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

        {/* SPEECH SECTION */}
        <div className="speech-section">
          {/* Toggle Row */}
          <div className="speech-toggle-row">
            <div className="speech-label">
              <span className={`speaker-icon ${isSpeaking ? 'speaking' : ''}`}>
                🔊
              </span>
              <div>
                <span className="speech-title">Speak Words Aloud</span>
                <span className="speech-subtitle">
                  {isSpeechEnabled
                    ? isSpeaking ? 'Speaking...' : 'Ready'
                    : 'Off'}
                </span>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isSpeechEnabled}
                onChange={(e) => toggleSpeech(e.target.checked)}
                aria-label="Toggle speech"
              />
              <span className="toggle-track">
                <span className="toggle-thumb"/>
              </span>
            </label>
          </div>

          {/* Speech Controls - only show when enabled */}
          {isSpeechEnabled && (
            <div className="speech-controls">

              {/* Voice Selector */}
              {availableVoices && availableVoices.length > 0 && (
                <div className="speech-control-row">
                  <label className="speech-control-label">Voice</label>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => {
                      stopSpeaking();
                      setSelectedVoiceName(e.target.value);
                    }}
                    className="voice-select"
                    aria-label="Select voice"
                  >
                    {availableVoices.map(voice => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name.replace('Microsoft ', '').replace(' Online (Natural)', ' ✨')}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speech Rate */}
              <div className="speech-control-row">
                <div className="speech-slider-header">
                  <label className="speech-control-label">Speed</label>
                  <span className="speech-control-value">{speechRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => {
                    stopSpeaking();
                    setSpeechRate(parseFloat(e.target.value));
                  }}
                  className="custom-slider"
                  aria-label="Speech rate"
                />
                <div className="speech-slider-labels">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Pitch */}
              <div className="speech-control-row">
                <div className="speech-slider-header">
                  <label className="speech-control-label">Pitch</label>
                  <span className="speech-control-value">{speechPitch}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={speechPitch}
                  onChange={(e) => {
                    stopSpeaking();
                    setSpeechPitch(parseFloat(e.target.value));
                  }}
                  className="custom-slider"
                  aria-label="Speech pitch"
                />
              </div>

              {/* Volume */}
              <div className="speech-control-row">
                <div className="speech-slider-header">
                  <label className="speech-control-label">Volume</label>
                  <span className="speech-control-value">
                    {Math.round(speechVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  className="custom-slider"
                  aria-label="Speech volume"
                />
              </div>

              {/* Sync Mode Info */}
              <div className="speech-sync-info">
                <span className="sync-icon">⚡</span>
                <span>
                  {isAutoPlaying
                    ? 'Auto-advance synced to speech — next word advances after speaking'
                    : 'Start auto-advance to enable speech sync'}
                </span>
              </div>

            </div>
          )}
        </div>

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