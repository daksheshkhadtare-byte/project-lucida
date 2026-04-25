import React from 'react';

const colors = [
  { hex: '#fefae0', label: 'Cream' },
  { hex: '#e8f4f8', label: 'Sky' },
  { hex: '#fff9c4', label: 'Sun' },
  { hex: '#e8f5e9', label: 'Mint' },
  { hex: '#ffffff', label: 'White' }
];

export default function BackgroundPalette({ currentBg, setSetting }) {
  return (
    <div className="card" id="background-tint-card">
      <h3>Background Tint</h3>
      <div className="swatch-container">
        {colors.map(c => (
          <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <button
              className={`swatch ${currentBg === c.hex ? 'active' : ''}`}
              style={{ backgroundColor: c.hex, border: c.hex === '#ffffff' ? '2px solid #3a3a5a' : undefined }}
              onClick={() => setSetting('bgTint', c.hex)}
              aria-label={`Select ${c.label} background`}
              title={c.label}
            />
            <span style={{ fontSize: '10px', color: '#888' }}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}