export interface YahooQuote {
  cmp: number | null;
  peRatio?: number | null; 
  latestEarnings?: string | null;
}

export interface GoogleFinanceData {
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface StockResponse {
  success: boolean;
  data: Record<string, YahooQuote & GoogleFinanceData>;
}

export interface StockBody {
  symbol: string;
  exchange: "NSE" | "BSE";
}

export interface StockRequestBody {
  stocks: StockBody[];
}
