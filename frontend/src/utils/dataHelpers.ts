/** Pure helper functions for data processing and formatting */

// ─── Density visualization ────────────────────────────────────────────────────

/** Maps a population density value (chel/km²) to a hex accent color. */
export function getDensityColor(density: number): string {
  if (density >= 2000) return "#22D3EE"; // cyan  – very high
  if (density >= 500) return "#8B5CF6";  // violet – high
  if (density >= 100) return "#3B82F6";  // blue   – medium
  if (density >= 20) return "#10B981";   // emerald – low
  return "#F59E0B";                       // amber  – very low
}

/** Returns a Russian label for a given population density range. */
export function getDensityLabel(density: number): string {
  if (density >= 2000) return "Очень высокая";
  if (density >= 500) return "Высокая";
  if (density >= 100) return "Средняя";
  if (density >= 20) return "Низкая";
  return "Очень низкая";
}

// ─── Number formatting ────────────────────────────────────────────────────────

/** Formats a large population number as a compact string (e.g. 1 500 000 → "1.5М"). */
export function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}К`;
  return String(n);
}

/** Formats a number with Russian locale separators. */
export const formatRuNumber = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n);

// ─── Chart helpers ────────────────────────────────────────────────────────────

/**
 * Merges historical and forecast data at the junction year so that
 * the two Recharts lines connect visually without a gap.
 *
 * The junction point (year where both `fact` and `forecast` are set)
 * is detected automatically.
 */
export function getJunctionYear(
  data: Array<{ year: number; fact: number | null; forecast: number | null }>
): number | undefined {
  return data.find((d) => d.fact !== null && d.forecast !== null)?.year;
}

// ─── Sparkline data generation ───────────────────────────────────────────────

type SparkPoint = { value: number };

/** Generates a rising sparkline series (used for "positive" KPI cards). */
export function buildRisingSparkline(length = 20): SparkPoint[] {
  return Array.from({ length }, (_, i) => ({
    value: 100 + i * 2 + Math.random() * 10,
  }));
}

/** Generates a slowly declining sparkline series. */
export function buildDecliningSparkline(length = 20): SparkPoint[] {
  return Array.from({ length }, (_, i) => ({
    value: 80 - i * 0.5 - Math.random() * 5,
  }));
}

/** Generates a flat / near-stable sparkline series. */
export function buildFlatSparkline(length = 20): SparkPoint[] {
  return Array.from({ length }, () => ({ value: 60 + Math.random() * 5 }));
}

/** Generates a gently rising sparkline (birth-rate style). */
export function buildGentleRisingSparkline(length = 20): SparkPoint[] {
  return Array.from({ length }, (_, i) => ({
    value: 50 + i + Math.random() * 8,
  }));
}
