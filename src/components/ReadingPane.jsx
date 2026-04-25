import React, { useRef, useState, useEffect } from 'react';

export default function ReadingPane({ tokens, highlighter, showRuler, highlightStyle, setSetting, showToast }) {
  const containerRef = useRef(null);
  const [rulerY, setRulerY] = useState(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExitingHero, setIsExitingHero] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const { currentIndex, jumpTo, setIsAutoPlaying } = highlighter;

  useEffect(() => {
    if (tokens.length > 0) {
      if (!showTokens) {
        setIsExitingHero(true);
        const timer = setTimeout(() => {
          setShowTokens(true);
          setIsExitingHero(false);
        }, 300); // 300ms fade out duration
        return () => clearTimeout(timer);
      }
    } else {
      setShowTokens(false);
      setIsExitingHero(false);
    }
  }, [tokens.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); highlighter.next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); highlighter.prev(); }
      if (e.key === ' ') { e.preventDefault(); highlighter.next(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [highlighter]);

  const handleMouseMove = (e) => {
    if (!showRuler || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setRulerY(e.clientY - rect.top + containerRef.current.scrollTop);
  };

  const handleWordClick = (validIndex) => {
    jumpTo(validIndex);
  };

  let validTokenCount = 0;

  const handlePill1Click = () => {
    document.getElementById('font-selector-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSetting('fontFace', 'OpenDyslexic');
    showToast('OpenDyslexic font applied — notice how letters become easier to distinguish');
  };

  const handlePill2Click = () => {
    document.getElementById('typography-controls-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let currentVal = 0.05; 
    const rootVal = parseFloat(document.documentElement.style.getPropertyValue('--letter-spacing'));
    if (!isNaN(rootVal)) currentVal = rootVal;
    
    const target = 0.15;
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = progress * (2 - progress);
      const newVal = currentVal + (target - currentVal) * easeOut;
      setSetting('letterSpacing', parseFloat(newVal.toFixed(2)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    
    showToast('Letter spacing increased — words have more breathing room now');
  };

  const handlePill3Click = () => {
    document.getElementById('highlight-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setSetting('autoAdvance', true);
    if (tokens.length > 0) {
      setIsAutoPlaying(true);
    }
    showToast('Auto-advance started — your eye is now guided word by word');
  };

  return (
    <div 
      className={`reading-pane-wrapper ${isDarkMode ? 'dark-mode' : ''}`} 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {showRuler && isHovering && (
        <div className="text-ruler" style={{ top: `${rulerY}px` }}></div>
      )}
      
      {!showTokens ? (
        <div className="hero-section" style={{ transition: 'opacity 0.3s', opacity: isExitingHero ? 0 : 1 }}>
          <h2>Lumina</h2>
          <p>Adaptive reading for every mind</p>
          <div className="feature-pills">
            <button className="feature-pill" onClick={handlePill1Click} style={{cursor: 'pointer'}}>Dyslexia-friendly fonts</button>
            <button className="feature-pill" onClick={handlePill2Click} style={{cursor: 'pointer'}}>Live typography control</button>
            <button className="feature-pill" onClick={handlePill3Click} style={{cursor: 'pointer'}}>Word-by-word focus mode</button>
          </div>
        </div>
      ) : (
        <div className="reading-content" key={tokens[0]?.id}>
          {tokens.map((token, i) => {
            if (token.isParagraph) {
              return <p key={token.id}></p>;
            } else {
              const thisValidIndex = validTokenCount++;
              const isHighlighted = thisValidIndex === currentIndex;
              return (
                <span key={token.id}>
                  <span 
                    className={`word ${isHighlighted ? `highlighted ${highlightStyle || 'marker'}` : ''}`}
                    onClick={() => handleWordClick(thisValidIndex)}
                    data-index={thisValidIndex}
                    aria-current={isHighlighted ? "true" : undefined}
                  >
                    {token.word}
                  </span>
                  {' '}
                </span>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}