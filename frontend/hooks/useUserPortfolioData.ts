"use client"

import { initialHoldings } from "@/data/portfolioData";
import { StockHolding } from "@/types/table.types";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

const REFRESH_INTERVAL = Number(
    process.env.NEXT_PUBLIC_REFRESH_INTERVAL ?? 15000
);

export function usePortfolioData() {

    const [holdings, setHoldings] = useState<StockHolding[]>(initialHoldings);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchStockData = useCallback(async () => {
        try {
            const symbols = initialHoldings.map((h) => h.symbol);

            const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL as string,
                { symbols }
            );

            const data = response.data;

            if (!data?.success) {
                throw new Error(data?.error || "Failed to fetch");
            }

            // ✅ FIX 2: Update safely
            setHoldings((prev) =>
                prev.map((stock) => {
                    const d = data.data[stock.symbol];
                    if (!d) return stock;

                    const cmp = d.cmp ?? stock.cmp;
                    const presentValue = cmp ? cmp * stock.quantity : null;
                    const gainLoss =
                        presentValue !== null ? presentValue - stock.investment : null;

                    return {
                        ...stock,
                        cmp,
                        presentValue,
                        gainLoss,
                        peRatio: d.peRatio ?? stock.peRatio,
                        latestEarnings: d.latestEarnings ?? stock.latestEarnings,
                        isLoading: false,
                    };
                })
            );
        } catch (err: any) {
            console.error("Failed to fetch stock data:", err);
        }
    }, []);

    useEffect(() => {
        fetchStockData();
        intervalRef.current = setInterval(fetchStockData, REFRESH_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchStockData]);

    return { holdings, refetch: fetchStockData };
}