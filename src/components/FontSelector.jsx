import React from 'react';

const fonts = [
  { id: 'OpenDyslexic', name: 'OpenDyslexic', desc: 'Reduces character reversals' },
  { id: 'Lexie Readable', name: 'Lexie Readable', desc: 'High legibility spacing' },
  { id: 'Georgia', name: 'Georgia (Serif)', desc: 'Classic readable serif' }
];

export default function FontSelector({ currentFont, setSetting }) {
  return (
    <div className="card">
      <h3>Font Face</h3>
      <div className="font-cards" role="radiogroup" aria-label="Font Selection">
        {fonts.map(font => (
          <div 
            key={font.id}
            role="radio"
            aria-checked={currentFont === font.id}
            tabIndex={0}
            className={`font-card ${currentFont === font.id ? 'active' : ''}`}
            onClick={() => setSetting('fontFace', font.id)}
            onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setSetting('fontFace', font.id) }}
          >
            <span className="font-name">{font.name}</span>
            <span className="font-desc">{font.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}