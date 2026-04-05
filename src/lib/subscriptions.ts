export function parseCompactCount(value: string): number {
  if (!value) return 0;

  const cleaned = value.replace(/,/g, '').trim().toLowerCase().replace(/\+$/, '');
  const match = cleaned.match(/^([\d.]+)\s*([kmb])?/);

  if (!match) return 0;

  let count = Number.parseFloat(match[1]);
  if (Number.isNaN(count)) return 0;

  if (match[2] === 'k') count *= 1_000;
  if (match[2] === 'm') count *= 1_000_000;
  if (match[2] === 'b') count *= 1_000_000_000;

  return Math.round(count);
}

export function formatCompactCount(value: number): string {
  if (value >= 1_000_000_000) {
    return `${trimTrailingZeroes((value / 1_000_000_000).toFixed(1))}B`;
  }

  if (value >= 1_000_000) {
    return `${trimTrailingZeroes((value / 1_000_000).toFixed(1))}M`;
  }

  if (value >= 1_000) {
    return `${trimTrailingZeroes((value / 1_000).toFixed(1))}K`;
  }

  return new Intl.NumberFormat('en-US').format(value);
}

export function incrementCompactCount(value: string, amount = 1): string {
  return formatCompactCount(parseCompactCount(value) + amount);
}

function trimTrailingZeroes(value: string): string {
  return value.replace(/\.0$/, '');
}
