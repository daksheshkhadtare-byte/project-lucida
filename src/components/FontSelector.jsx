import React from 'react';

const fonts = [
  { id: 'OpenDyslexic', name: 'OpenDyslexic', desc: 'Reduces character reversals' },
  { id: 'Lexie Readable', name: 'Lexie Readable', desc: 'High legibility spacing' },
  { id: 'Georgia', name: 'Georgia (Serif)', desc: 'Classic readable serif' }
];

export default function FontSelector({ currentFont, setSetting }) {
  return (
    <div className="card" id="font-selector-card">
      <h3>Font Face</h3>
      <div className="font-cards" role="radiogroup" aria-label="Font Selection">
        {fonts.map(font => {
          const isActive = currentFont === font.id;
          return (
            <div 
              key={font.id}
              role="radio"
              aria-checked={isActive}
              tabIndex={0}
              className={`font-card ${isActive ? 'active' : ''}`}
              onClick={() => setSetting('fontFace', font.id)}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSetting('fontFace', font.id) }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-name">{font.name}</span>
                {isActive && <span style={{ color: '#a78bfa' }}>✓</span>}
              </div>
              <span className="font-desc">{font.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}