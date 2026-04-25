import React from 'react';

export default function ReadingStats({ highlighter }) {
  const { wordsRead, timeElapsed, resetStats } = highlighter;

  const getWPM = () => {
    if (wordsRead < 10 || timeElapsed < 1) return '—';
    const minutes = timeElapsed / 60;
    return Math.round(wordsRead / minutes);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="card">
      <h3>Reading Stats</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{wordsRead}</div>
          <div className="stat-label">Words</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{formatTime(timeElapsed)}</div>
          <div className="stat-label">Time</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{getWPM()}</div>
          <div className="stat-label">WPM</div>
        </div>
      </div>
      <button className="secondary" style={{ width: '100%' }} onClick={resetStats}>Reset Stats</button>
    </div>
  );
}