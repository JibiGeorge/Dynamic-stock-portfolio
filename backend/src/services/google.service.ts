import { getCached, setCache } from "../utils/cache";
import { GoogleFinanceData } from "../types/stock.types";
import dotenv from "dotenv";

dotenv.config();

export async function fetchGoogleFinanceData({
  symbol,
  exchange,
}: {
  symbol: string;
  exchange: "NSE" | "BSE";
}): Promise<GoogleFinanceData> {
  const cacheKey = `google_${exchange}_${symbol}`;
  const cached = getCached<GoogleFinanceData>(cacheKey);
  if (cached) return cached;

  const baseUrl = process.env.GOOGLE_FINANCE_BASE_URL;

  const suffix = exchange === "NSE" ? "NSE" : "BOM";
  const url = `${baseUrl}${symbol}:${suffix}`;

  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Google Finance failed for ${symbol}`);

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
}
