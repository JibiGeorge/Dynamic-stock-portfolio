import { getCached, setCache } from "../utils/cache";
import { YahooQuote } from "../types/stock.types";

export async function fetchYahooQuote({
  symbol,
  exchange,
}: {
  symbol: string;
  exchange: "NSE" | "BSE";
}): Promise<YahooQuote> {
  const cacheKey = `yahoo_${exchange}_${symbol}`;
  const cached = getCached<YahooQuote>(cacheKey);
  if (cached) return cached;

  const baseUrl = process.env.YAHOO_BASE_URL;

  const suffix = exchange === "NSE" ? "NS" : "BO";
  const url = `${baseUrl}${symbol}.${suffix}?interval=1d&range=1d`;

  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Yahoo API failed for ${symbol}`);

  const json = await res.json();
  const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice;

  if (price === undefined || price === null) {
    throw new Error(`No price data found for ${symbol}`);
  }

  const result = { cmp: price };
  setCache(cacheKey, result);
  return result;
}