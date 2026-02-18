import { Request, Response } from "express";
import { fetchYahooQuote } from "../services/yahoo.service";
import { fetchGoogleFinanceData } from "../services/google.service";
import { fetchBatch } from "../services/batch.service";
import { StockRequestBody } from "../types/stock.types";

export async function getStockData(
  req: Request<{}, {}, StockRequestBody>,
  res: Response
) {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ error: "symbols array is required" });
    }

    const [yahooResults, googleResults] = await Promise.all([
      fetchBatch(symbols, fetchYahooQuote),
      fetchBatch(symbols, fetchGoogleFinanceData, 2),
    ]);

    const data: Record<string, any> = {};

    for (const symbol of symbols) {
      data[symbol] = {
        ...(yahooResults.get(symbol) ?? { cmp: null }),
        ...(googleResults.get(symbol) ?? {
          peRatio: null,
          latestEarnings: null,
        }),
      };
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
