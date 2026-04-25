import React, { useState } from 'react';

const builtInPresets = [
  {
    name: 'Default',
    settings: {
      fontFace: 'OpenDyslexic',
      letterSpacing: 0.05,
      wordSpacing: 0.10,
      lineHeight: 1.8,
      columnWidth: 65,
      bgTint: '#fefae0',
      autoAdvance: false,
      highlightSpeed: 1500,
      showRuler: true,
      paragraphSpacing: 1.5
    },
    createdAt: 'Built-in',
    isBuiltIn: true
  },
  {
    name: 'Dyslexia Comfort',
    settings: {
      fontFace: 'OpenDyslexic',
      letterSpacing: 0.12,
      wordSpacing: 0.25,
      lineHeight: 2.2,
      columnWidth: 65,
      bgTint: '#fefae0',
      autoAdvance: false,
      highlightSpeed: 1500,
      showRuler: true,
      paragraphSpacing: 1.5
    },
    createdAt: 'Built-in',
    isBuiltIn: true
  },
  {
    name: 'Focus Study',
    settings: {
      fontFace: 'Georgia',
      letterSpacing: 0.05,
      wordSpacing: 0.10,
      lineHeight: 2.0,
      columnWidth: 65,
      bgTint: '#fff9c4',
      autoAdvance: true,
      highlightSpeed: 2000,
      showRuler: true,
      paragraphSpacing: 1.5
    },
    createdAt: 'Built-in',
    isBuiltIn: true
  }
];

export default function PresetManager({ settings, onLoadPreset, presets, setPresets }) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!newName.trim()) {
      setError('Please enter a preset name');
      return;
    }
    
    if (builtInPresets.some(p => p.name.toLowerCase() === newName.trim().toLowerCase())) {
      setError('Cannot overwrite built-in preset');
      return;
    }

    const existingIndex = presets.findIndex(p => p.name.toLowerCase() === newName.trim().toLowerCase());
    if (existingIndex >= 0) {
      if (!window.confirm('Preset name already exists. Overwrite?')) return;
      const newPresets = [...presets];
      newPresets[existingIndex] = {
        name: newName.trim(),
        settings: { ...settings },
        createdAt: new Date().toLocaleDateString()
      };
      setPresets(newPresets);
    } else {
      setPresets([...presets, {
        name: newName.trim(),
        settings: { ...settings },
        createdAt: new Date().toLocaleDateString()
      }]);
    }
    setNewName('');
    setError('');
  };

  const handleDelete = (name) => {
    setPresets(presets.filter(p => p.name !== name));
  };

  const allPresets = [...builtInPresets, ...presets];

  return (
    <div className="card">
      <h3>Presets</h3>
      
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        <input 
          type="text" 
          value={newName} 
          onChange={(e) => { setNewName(e.target.value); setError(''); }}
          placeholder="e.g. Study Mode" 
          style={{ flex: 1, padding: '8px', background: '#0f0f1a', color: '#e2e2f0', border: '1px solid #2a2a4a', borderRadius: '4px' }}
        />
        <button onClick={handleSave}>Save</button>
      </div>
      {error && <div style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '10px' }}>{error}</div>}

      <div className="preset-list">
        {allPresets.map(preset => (
          <div key={preset.name} className="preset-card">
            <div className="preset-info">
              <span className="preset-name">{preset.name}</span>
              <span className="preset-date">{preset.createdAt}</span>
            </div>
            <div className="preset-actions">
              <button className="secondary" onClick={() => onLoadPreset(preset.settings)}>Load</button>
              {!preset.isBuiltIn && (
                <button className="secondary" onClick={() => handleDelete(preset.name)} aria-label="Delete preset">🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}