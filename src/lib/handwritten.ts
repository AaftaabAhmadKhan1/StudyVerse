export async function renderHandwrittenImage(text: string, opts?: { width?: number; padding?: number; fontSize?: number; lineHeight?: number; bgColor?: string; textColor?: string }): Promise<string> {
  const width = opts?.width || 720;
  const padding = opts?.padding || 24;
  const fontSize = opts?.fontSize || 20;
  const lineHeight = opts?.lineHeight || Math.round(fontSize * 1.6);
  const bgColor = opts?.bgColor || '#fffaf0';
  const textColor = opts?.textColor || '#1b1b1b';

  // Create an offscreen canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Measure and wrap text
  const maxWidth = width - padding * 2;
  ctx.font = `${fontSize}px "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive`;

  const words = text.replace(/\r/gi, '').split('\n');
  const lines: string[] = [];
  for (const paragraph of words) {
    const parts = paragraph.split(' ');
    let line = '';
    for (let i = 0; i < parts.length; i++) {
      const word = parts[i];
      const testLine = line ? `${line} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    // blank line after paragraph
    lines.push('');
  }

  const height = padding * 2 + Math.max(200, lines.length * lineHeight + 10);
  canvas.width = width;
  canvas.height = height;

  // Background (paper texture-like)
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // subtle noise lines
    for (let i = 0; i < 6; i++) {
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = '#000';
      const y = padding + (i + 1) * (height - padding * 2) / 7 + (Math.random() * 6 - 3);
      ctx.fillRect(padding / 2, y, canvas.width - padding, 1);
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px "Segoe Script", "Brush Script MT", "Comic Sans MS", cursive`;

    let y = padding;
    for (const line of lines) {
      // small jitter per line
      const jitterX = (Math.random() - 0.5) * 2;
      const jitterY = (Math.random() - 0.5) * 2;
      if (line === '') {
        y += lineHeight / 2;
        continue;
      }
      // slight rotation
      ctx.save();
      const x = padding + jitterX;
      ctx.translate(x, y + jitterY);
      const angle = (Math.random() - 0.5) * 0.02;
      ctx.rotate(angle);
      // stroke for pen-like look
      ctx.lineWidth = Math.max(1, fontSize / 16);
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.strokeText(line, 0, 0);
      ctx.fillStyle = textColor;
      ctx.fillText(line, 0, 0);
      ctx.restore();
      y += lineHeight;
    }
  }

  return canvas.toDataURL('image/png');
}
