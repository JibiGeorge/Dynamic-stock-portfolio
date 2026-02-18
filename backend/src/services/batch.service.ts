import { StockBody } from "../types/stock.types";

/**
 * Unique key per stock to avoid symbol collisions between NSE and BSE.
 * e.g. "HDFCBANK:NSE", "532174:BSE"
 */
export function stockKey(stock: StockBody): string {
  return `${stock.exchange}_${stock.symbol}`;
}

export async function fetchBatch<T>(
  items: { symbol: string; exchange: "NSE" | "BSE" }[],
  fetcher: (item: { symbol: string; exchange: "NSE" | "BSE" }) => Promise<T>,
  batchSize = 3,
  delayMs = 500
): Promise<Map<string, T | { error: string }>> {

  const results = new Map<string, T | { error: string }>();

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (item) => {
        try {
          const result = await fetcher(item);
          return { item, result };
        } catch (error: any) {
          return { item, result: { error: error.message || "Fetch failed" } };
        }
      })
    );

    for (const { item, result } of batchResults) {
      results.set(`${item.exchange}_${item.symbol}`, result);
    }

    if (i + batchSize < items.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  return results;
}