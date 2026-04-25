import React, { useState, useEffect } from 'react';
import { tokenizeText } from '../utils/tokenizer';

const defaultText = "The epistemological foundations of empirical inquiry rest upon a fundamental assumption: that the observable world exhibits sufficient regularity to permit generalisation. Without this presupposition, the scientific enterprise collapses into radical scepticism — every event becomes a singular occurrence, untethered from causal antecedents. Hume identified this problem with devastating clarity, noting that no logical necessity compels the future to resemble the past. Yet science proceeds, and largely succeeds, suggesting that the pragmatic utility of inductive reasoning may itself constitute a form of justification, even absent deductive certainty. The philosopher of science must therefore navigate between naive realism — which ignores the theory-laden nature of observation — and antirealism — which risks dissolving the explanatory power that makes scientific knowledge worth pursuing in the first place.";

export default function TextInput({ onTokensUpdate, resetHighlighter }) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const tokens = tokenizeText(text);
    onTokensUpdate(tokens);
  }, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    resetHighlighter();
  };

  const handleClear = () => {
    setText("");
    resetHighlighter();
  };
  
  const handlePasteSample = () => {
    setText(defaultText);
    resetHighlighter();
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  
  const showBlinkingCursor = text === '' && !isFocused;

  return (
    <div className="card" id="text-input-card">
      <h3>Text Input</h3>
      <label htmlFor="text-input" className="sr-only" aria-label="Paste your text here"></label>
      <div style={{ position: 'relative' }}>
        <textarea
          id="text-input"
          value={text}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={showBlinkingCursor ? "" : "Paste your text here..."}
          style={{ position: 'relative', zIndex: 2, background: showBlinkingCursor ? 'transparent' : '#0f0f1a' }}
        />
        {showBlinkingCursor && (
          <div style={{ 
            position: 'absolute', top: 12, left: 12, color: '#888', 
            pointerEvents: 'none', zIndex: 1, fontFamily: 'DM Sans, sans-serif'
          }}>
            <span className="blinking-cursor">Paste your text here...</span>
          </div>
        )}
      </div>
      
      {text === '' && (
        <button className="secondary" style={{ width: '100%', marginTop: '8px', fontSize: '12px', padding: '6px' }} onClick={handlePasteSample}>
          📋 Paste sample text
        </button>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span className="word-count" style={{ marginTop: 0 }}>{wordCount} words</span>
        {text !== '' && (
          <button className="secondary text-input-clear" style={{ marginTop: 0 }} onClick={handleClear}>Clear Text</button>
        )}
      </div>
    </div>
  );
}