export const PROMO_CODE = 'MXG1';
export const SERVER_NAME = 'Apple Hack';

export const PLATFORMS = ['1xBet', 'MELBET', 'SpinBetter'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const MULTIPLIERS = [
  'x24.50',
  'x16.33',
  'x10.89',
  'x7.26',
  'x6.71',
  'x4.02',
  'x2.41',
  'x1.93',
  'x1.54',
  'x1.23',
] as const;

// Number of bitten apples per row (top-to-bottom across 10 tiers)
const BITTEN_COUNTS_PER_ROW = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

export function generateSimulationMatrix(rows = 10, cols = 5): Set<number> {
  const safeCells = new Set<number>();

  for (let r = 0; r < rows; r++) {
    const bittenCount = BITTEN_COUNTS_PER_ROW[r] ?? 1;
    const bittenCols = new Set<number>();

    while (bittenCols.size < bittenCount) {
      bittenCols.add(Math.floor(Math.random() * cols));
    }

    for (let c = 0; c < cols; c++) {
      if (!bittenCols.has(c)) {
        safeCells.add(r * cols + c);
      }
    }
  }

  return safeCells;
}
