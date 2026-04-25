import React, { useState, useEffect } from 'react';

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [pos, setPos] = useState(null);

  const steps = [
    { 
      id: 'text-input-card', 
      title: 'Start Here — Paste Your Text',
      text: 'Paste any article, textbook paragraph, or document here. The app strips all formatting and converts it into a word-by-word readable format optimised for focus.' 
    },
    { 
      id: 'font-selector-card', 
      title: 'Choose Your Reading Font',
      text: 'OpenDyslexic uses weighted letterforms that eliminate character reversals — b, d, p, q become visually distinct. Lexie Readable adds extra spacing between similar letters. Try each and notice the difference instantly.' 
    },
    { 
      id: 'typography-controls-card', 
      title: 'Live Typography Controls',
      text: 'Every slider mutates a CSS custom property in real time — zero lag, zero page reload. Recommended starting point for dyslexic readers: Letter Spacing 0.12em, Word Spacing 0.25em, Line Height 2.2.'
    },
    { 
      id: 'background-tint-card', 
      title: 'Reduce Visual Stress with Background Tint',
      text: 'White backgrounds cause a glare effect for readers with Meares-Irlen Syndrome — text appears to shimmer or wobble. Soft yellow or cream backgrounds eliminate this neurological effect entirely. Click any swatch to see the change.' 
    },
    { 
      id: 'highlight-card', 
      title: 'Word-by-Word Focus Mode',
      text: 'The highlight automaton acts as a digital reading finger — eliminating regression (re-reading the same line without realising it). Use manual mode for your own pace, or auto-advance at 1.5 second intervals for guided reading.' 
    },
    { 
      id: 'reading-stats-card', 
      title: 'Track Your Reading Speed',
      text: 'Your words-per-minute is calculated live as you read. Average adult reads at 200-250 WPM. With practice using the word highlighter, most users improve by 15-30% within a week.' 
    },
    { 
      id: 'presets-card', 
      title: 'Save Your Perfect Configuration',
      text: "Once you find your ideal combination of font, spacing, and background — save it as a named preset. One click restores your exact settings on every visit. Try the built-in 'Dyslexia Comfort' preset to see a pre-optimised configuration." 
    }
  ];

  useEffect(() => {
    if (step === -1) return;
    const current = steps[step];
    
    const updatePos = () => {
      const el = document.getElementById(current.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPos({ 
          top: rect.top + rect.height / 2, 
          left: rect.right + 20,
          targetRect: rect
        });
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    
    updatePos();
    const interval = setInterval(updatePos, 100);
    
    window.addEventListener('resize', updatePos);
    const cp = document.querySelector('.control-panel');
    if (cp) cp.addEventListener('scroll', updatePos);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updatePos);
      if (cp) cp.removeEventListener('scroll', updatePos);
    };
  }, [step]);

  if (step === -1 || !pos) return null;

  const current = steps[step];

  const handleNext = () => {
    if (step >= steps.length - 1) {
      setStep(-1);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    setStep(-1);
  };

  return (
    <>
      {/* Target highlight uses box-shadow for overlay so it doesn't block interactions behind it */}
      <div 
        className="tour-target-highlight"
        style={{
          top: pos.targetRect.top,
          left: pos.targetRect.left,
          width: pos.targetRect.width,
          height: pos.targetRect.height
        }}
      ></div>

      <div className="tour-tooltip" style={{ top: pos.top, left: pos.left, pointerEvents: 'all' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 'bold' }}>Step {step + 1} of {steps.length}</span>
          <button className="secondary" style={{ padding: '2px 6px', fontSize: '11px', border: 'none' }} onClick={handleSkip}>Skip Tour</button>
        </div>
        
        <h4 style={{ margin: '0 0 8px 0', color: '#a78bfa', fontSize: '16px' }}>{current.title}</h4>
        <p style={{ margin: '0 0 20px 0' }}>{current.text}</p>
        
        <button 
          style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 'bold' }} 
          onClick={handleNext}
        >
          {step === steps.length - 1 ? 'Start Reading →' : "I've tried it — Next Step →"}
        </button>
      </div>
    </>
  );
}
