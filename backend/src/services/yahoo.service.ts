import { getCached, setCache } from "../utils/cache";
import { YahooQuote } from "../types/stock.types";

export async function fetchYahooQuote(symbol: string): Promise<YahooQuote> {
  const cacheKey = `yahoo_${symbol}`;
  const cached = getCached<YahooQuote>(cacheKey);
  if (cached) return cached;

  const nseSymbol = `${symbol}.NS`;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${nseSymbol}?interval=1d&range=1d`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) {
    throw new Error(`Yahoo API failed for ${symbol}`);
  }

  const json = await res.json();

  const price =
    json?.chart?.result?.[0]?.meta?.regularMarketPrice;

  if (!price) {
    throw new Error(`No price data found for ${symbol}`);
  }

  const result = { cmp: price };
  setCache(cacheKey, result);
  return result;
}