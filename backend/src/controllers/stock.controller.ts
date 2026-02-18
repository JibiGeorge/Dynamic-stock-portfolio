import { Request, Response } from "express";
import { fetchYahooQuote } from "../services/yahoo.service";
import { fetchGoogleFinanceData } from "../services/google.service";
import { fetchBatch, stockKey } from "../services/batch.service";
import { StockRequestBody } from "../types/stock.types";

export async function getStockData(
  req: Request<{}, {}, StockRequestBody>,
  res: Response
) {
  try {
    const { stocks } = req.body;

    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        success: false,
        error: "stocks array is required and must not be empty",
      });
    }

    const validExchanges = ["NSE", "BSE"];
    const invalidStocks = stocks.filter(
      (s) => !s.symbol || !validExchanges.includes(s.exchange)
    );
    if (invalidStocks.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid stock entries. Exchange must be one of: ${validExchanges.join(", ")}`,
        invalid: invalidStocks,
      });
    }

    // Fetch Yahoo CMP and Google P/E + earnings in parallel
    const [yahooResults, googleResults] = await Promise.all([
      fetchBatch(stocks, fetchYahooQuote),
      fetchBatch(stocks, fetchGoogleFinanceData, 2),
    ]);

    const data: Record<string, any> = {};
    let hasError = false;

    for (const stock of stocks) {
      const key = stockKey(stock); // e.g., "HDFCBANK:NSE"
      const yahooData: any = yahooResults.get(key);
      const googleData: any = googleResults.get(key);

      const yahooError = yahooData?.error;
      const googleError = googleData?.error;

      if (yahooError || googleError) hasError = true;

      data[key] = {
        symbol: stock.symbol,
        exchange: stock.exchange,
        cmp: yahooData?.cmp ?? null,                   // CMP from Yahoo
        peRatio: googleData?.peRatio ?? null,         // P/E from Google
        latestEarnings: googleData?.latestEarnings ?? null, // Latest Earnings from Google
        ...(yahooError || googleError
          ? { errors: { yahoo: yahooError ?? null, google: googleError ?? null } }
          : {}),
      };
    }

    return res.status(200).json({
      success: true,
      partial: hasError, // true if some stock failed
      data,
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : "External API unavailable",
    });
  }
}
