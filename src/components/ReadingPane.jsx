import React, { useRef, useState, useEffect } from 'react';

export default function ReadingPane({ tokens, highlighter, showRuler }) {
  const containerRef = useRef(null);
  const [rulerY, setRulerY] = useState(-100);
  const [isHovering, setIsHovering] = useState(false);

  const { currentIndex, jumpTo } = highlighter;

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

  // Find actual valid token index for click jump
  const handleWordClick = (validIndex) => {
    jumpTo(validIndex);
  };

  let validTokenCount = 0;

  return (
    <div 
      className="reading-pane-wrapper" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {showRuler && isHovering && (
        <div className="text-ruler" style={{ top: `${rulerY}px` }}></div>
      )}
      
      <div className="reading-content">
        {tokens.map((token, i) => {
          if (token.isParagraph) {
            return <p key={token.id}></p>;
          } else {
            const thisValidIndex = validTokenCount++;
            const isHighlighted = thisValidIndex === currentIndex;
            return (
              <span key={token.id}>
                <span 
                  className={`word ${isHighlighted ? 'highlighted' : ''}`}
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
    </div>
  );
}