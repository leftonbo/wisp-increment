export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "Infinity";
  if (value < 0) return `-${formatNumber(Math.abs(value))}`;
  if (value < 1000) return value.toFixed(0);
  if (value < 1_000_000) return value.toLocaleString("ja-JP", { maximumFractionDigits: 0 });
  return value.toExponential(2).replace("+", "");
}

export function formatRate(value: number): string {
  return `+${formatNumber(value)}🔥/sec`;
}
