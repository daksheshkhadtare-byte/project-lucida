import React, { useState, useEffect } from 'react';
import { tokenizeText } from '../utils/tokenizer';

const defaultText = "The epistemological foundations of empirical inquiry rest upon a fundamental assumption: that the observable world exhibits sufficient regularity to permit generalisation. Without this presupposition, the scientific enterprise collapses into radical scepticism — every event becomes a singular occurrence, untethered from causal antecedents. Hume identified this problem with devastating clarity, noting that no logical necessity compels the future to resemble the past. Yet science proceeds, and largely succeeds, suggesting that the pragmatic utility of inductive reasoning may itself constitute a form of justification, even absent deductive certainty. The philosopher of science must therefore navigate between naive realism — which ignores the theory-laden nature of observation — and antirealism — which risks dissolving the explanatory power that makes scientific knowledge worth pursuing in the first place.";

export default function TextInput({ onTokensUpdate, resetHighlighter }) {
  const [text, setText] = useState(defaultText);

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

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="card">
      <h3>Text Input</h3>
      <label htmlFor="text-input" className="sr-only" aria-label="Paste your text here"></label>
      <textarea
        id="text-input"
        value={text}
        onChange={handleChange}
        placeholder="Paste your text here..."
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="word-count">{wordCount} words</span>
        <button className="secondary text-input-clear" onClick={handleClear}>Clear Text</button>
      </div>
    </div>
  );
}