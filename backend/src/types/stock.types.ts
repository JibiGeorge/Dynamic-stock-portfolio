export interface YahooQuote {
  cmp: number | null;
}

export interface GoogleFinanceData {
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface StockResponse {
  success: boolean;
  data: Record<string, YahooQuote & GoogleFinanceData>;
}

export interface StockRequestBody {
  symbols: string[];
}
