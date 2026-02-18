"use client"

import React, { createContext, useContext } from "react";
import useSWR from "swr";
import axios from "axios";
import { StockHolding } from "@/types/table.types";
import { initialHoldings } from "@/data/portfolioData";

type PortfolioContextType = {
  holdings: StockHolding[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

const PortfolioContext = createContext<PortfolioContextType>({
  holdings: initialHoldings,
  isLoading: false,
  error: null,
  refetch: () => {},
});

// Fetcher using API response structure
const fetcher = async () => {
  const stocks = initialHoldings.map((h) => ({ symbol: h.symbol, exchange: h.exchange }));
  const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL as string, { stocks });

  if (!response.data?.success) {
    throw new Error(response.data?.error || "Failed to fetch portfolio data");
  }
  return response.data.data;
};

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, mutate, isValidating } = useSWR("portfolioData", fetcher, {
    refreshInterval: Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL ?? 15000),
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const holdings = React.useMemo(() => {
    if (!data) return initialHoldings;

    return initialHoldings.map((stock) => {
      const key = `${stock.exchange}_${stock.symbol}`;
      const d = data[key];

      const cmp = d?.cmp ?? stock.cmp;
      const presentValue = cmp !== null ? cmp * stock.quantity : null;
      const investment = stock.purchasePrice * stock.quantity;
      const gainLoss = presentValue !== null ? presentValue - investment : null;

      return {
        ...stock,
        cmp,
        presentValue,
        gainLoss,
        peRatio: d?.peRatio ?? stock.peRatio,
        latestEarnings: d?.latestEarnings ?? stock.latestEarnings,
        errors: d?.errors ?? null,
        isLoading: !data,
      };
    });
  }, [data]);

  return (
    <PortfolioContext.Provider
      value={{
        holdings,
        isLoading: isValidating,
        error: error ? (error as Error).message : null,
        refetch: mutate,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
