import React, { useState, useEffect } from 'react';

export default function HighlightControls({ highlighter, settings, setSetting }) {
  const {
    currentIndex, currentWord, isAutoPlaying, completed,
    next, prev, toggleAutoPlay, totalValidTokens
  } = highlighter;

  const [speechOn, setSpeechOn] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);

  const speak = (word) => {
    try {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(word);
      msg.rate = speechRate;
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    } catch(e) {}
  };

  useEffect(() => {
    if (speechOn && currentWord) speak(currentWord);
  }, [currentIndex, speechOn]);

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

        <div style={{marginTop:'16px', borderTop:'1px solid #2a2a4a', paddingTop:'16px'}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px'}}>
            <span style={{color:'#e2e2f0', fontSize:'14px'}}>🔊 Speak Words Aloud</span>
            <label style={{position:'relative', display:'inline-block', width:'44px', height:'24px'}}>
              <input
                type="checkbox"
                checked={speechOn}
                onChange={(e) => {
                  window.speechSynthesis.cancel();
                  setSpeechOn(e.target.checked);
                }}
                style={{opacity:0, width:0, height:0}}
              />
              <span style={{
                position:'absolute', cursor:'pointer', top:0, left:0, right:0, bottom:0,
                backgroundColor: speechOn ? '#7c6af7' : '#2a2a4a',
                borderRadius:'24px', transition:'0.3s'
              }}>
                <span style={{
                  position:'absolute', height:'18px', width:'18px', left: speechOn ? '23px' : '3px',
                  bottom:'3px', backgroundColor:'white', borderRadius:'50%', transition:'0.3s'
                }}/>
              </span>
            </label>
          </div>
          {speechOn && (
            <div>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
                <span style={{color:'#a0a0c0', fontSize:'13px'}}>Speech Rate</span>
                <span style={{color:'#e2e2f0', fontSize:'13px'}}>{speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5" max="1.5" step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                style={{width:'100%'}}
              />
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