export function tokenizeText(text) {
  // Replace double newlines with a unique token temporarily before setting innerHTML
  // because HTML parser will eat standard newlines.
  let processedText = text.replace(/\n\s*\n/g, " __PARA__ ");
  
  // Strip HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = processedText;
  let cleanText = tempDiv.innerText || tempDiv.textContent || "";
  
  // Split by whitespace
  const rawWords = cleanText.split(/\s+/);
  const tokens = [];
  let id = 0;
  
  for (let w of rawWords) {
    if (!w) continue;
    if (w === '__PARA__') {
      tokens.push({ id: id++, word: '\n\n', isParagraph: true });
    } else {
      tokens.push({ id: id++, word: w, isParagraph: false });
    }
  }
  
  return tokens;
}