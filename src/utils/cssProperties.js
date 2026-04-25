export function applySettings(settings) {
  requestAnimationFrame(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-face', settings.fontFace === 'Georgia' ? 'Georgia, serif' : `'${settings.fontFace || 'OpenDyslexic'}', sans-serif`);
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing ?? 0.05}em`);
    root.style.setProperty('--word-spacing', `${settings.wordSpacing ?? 0.10}em`);
    root.style.setProperty('--line-height', settings.lineHeight ?? 1.8);
    root.style.setProperty('--paragraph-spacing', `${settings.paragraphSpacing ?? 1.5}rem`);
    root.style.setProperty('--column-width', `${settings.columnWidth ?? 65}ch`);
    root.style.setProperty('--bg-tint', settings.bgTint ?? '#fefae0');

    const textColors = {
      '#fefae0': '#1a1a2e',
      '#e8f4f8': '#1a1a2e',
      '#fff9c4': '#1a1a2e',
      '#e8f5e9': '#1a1a2e',
      '#ffffff': '#1a1a2e'
    };
    root.style.setProperty('--text-color', textColors[settings.bgTint] || '#1a1a2e');
  });
}