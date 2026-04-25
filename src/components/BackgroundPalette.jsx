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
    <div className="card">
      <h3>Background Tint</h3>
      <div className="swatch-container">
        {colors.map(c => (
          <button
            key={c.hex}
            className={`swatch ${currentBg === c.hex ? 'active' : ''}`}
            style={{ backgroundColor: c.hex }}
            onClick={() => setSetting('bgTint', c.hex)}
            aria-label={`Select ${c.label} background`}
            title={c.label}
          />
        ))}
      </div>
    </div>
  );
}