export type StockHolding = {
  stockName: string;
  purchasePrice: string;
  qty: string;
  investment: string;
  portfolio: "NSE" | "BSE";
  nse_bse: number;
  cmp: number;
  present_value: number | null;
  gain_loss: string | null;
  peRatio: number | null;
  latestEarnings: boolean;
}