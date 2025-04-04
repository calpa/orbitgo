export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "0";

  if (value === 0) return "0";

  if (Math.abs(value) < 0.01) {
    return value.toExponential(2);
  }

  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }

  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }

  return value.toFixed(2);
}
