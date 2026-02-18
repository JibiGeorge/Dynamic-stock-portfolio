"use client"

import { initialHoldings } from "@/data/portfolioData";
import { StockHolding } from "@/types/table.types";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const REFRESH_INTERVAL = Number(
    process.env.NEXT_PUBLIC_REFRESH_INTERVAL ?? 15000
);

export function usePortfolioData() {

    const [holdings, setHoldings] = useState<StockHolding[]>(initialHoldings);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStockData = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const stocks = initialHoldings.map((h) => {
                return {
                    symbol: h.symbol,
                    exchange: h.exchange
                }
            });

            const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL as string,
                { stocks }
            );

            const data = response.data;

            if (!data?.success) {
                throw new Error(data?.error || "Failed to fetch");
            }

            // ✅ FIX 2: Update safely
            setHoldings((prev) =>
                prev.map((stock) => {
                    const key = `${stock.symbol}:${stock.exchange}`;
                    const d = data.data[key];
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
            toast("Network error, Please try again...")
        } finally {
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStockData();
        intervalRef.current = setInterval(fetchStockData, REFRESH_INTERVAL);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [fetchStockData]);

    return { holdings, refetch: fetchStockData, isRefreshing };
}