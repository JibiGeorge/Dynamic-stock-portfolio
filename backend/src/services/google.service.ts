import { getCached, setCache } from "../utils/cache";
import { GoogleFinanceData } from "../types/stock.types";

export async function fetchGoogleFinanceData(
  symbol: string
): Promise<GoogleFinanceData> {
  const cacheKey = `google_${symbol}`;
  const cached = getCached<GoogleFinanceData>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://www.google.com/finance/quote/${symbol}:NSE`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    if (!res.ok) return { peRatio: null, latestEarnings: null };

    const html = await res.text();

    let peRatio: number | null = null;
    const peMatch = html.match(/P\/E ratio[^>]*>[\s\S]*?<div[^>]*>([\d,.]+)/i);
    if (peMatch) peRatio = parseFloat(peMatch[1].replace(/,/g, ""));

    let latestEarnings: string | null = null;
    const earningsMatch = html.match(
      /Earnings[^>]*>[\s\S]*?<div[^>]*>([A-Za-z]{3}\s+\d{1,2},?\s*\d{4})/i
    );
    if (earningsMatch) latestEarnings = earningsMatch[1];

    const result = { peRatio, latestEarnings };
    setCache(cacheKey, result);
    return result;
  } catch {
    return { peRatio: null, latestEarnings: null };
  }
}
