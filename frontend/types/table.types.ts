export interface StockHolding {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  exchange: string;

  purchasePrice: number;
  quantity: number;

  investment: number;
  portfolio?: number;

  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;

  peRatio: number | null;
  latestEarnings: number | null;

  isLoading: boolean;
}
