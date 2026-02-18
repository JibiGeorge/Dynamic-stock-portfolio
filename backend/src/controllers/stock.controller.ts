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
      return res.status(400).json({
        success: false,
        error: "symbols array is required",
      });
    }

    const [yahooResults, googleResults] = await Promise.all([
      fetchBatch(symbols, fetchYahooQuote),
      fetchBatch(symbols, fetchGoogleFinanceData, 2),
    ]);

    const data: Record<string, any> = {};
    let hasError = false;

    for (const symbol of symbols) {
      const yahooData = yahooResults.get(symbol);
      const googleData = googleResults.get(symbol);

      if (
        (yahooData as any)?.error ||
        (googleData as any)?.error
      ) {
        hasError = true;
      }

      data[symbol] = {
        ...(yahooData ?? {}),
        ...(googleData ?? {}),
      };
    }

    if (hasError) {
      return res.status(207).json({
        success: false,
        message: "Partial data retrieved",
        data,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    return res.status(503).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "External API service unavailable",
    });
  }
}
