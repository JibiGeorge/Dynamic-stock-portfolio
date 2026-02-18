"use client"

import StockTableData from "@/components/homePage/stockTableData";
import SummaryCards from "@/components/homePage/summaryCards";
import { usePortfolioData } from "@/hooks/useUserPortfolioData";
import Image from "next/image";

export default function Home() {

  const { holdings, refetch } = usePortfolioData();

  return (
    <>
      {/* Summary Cards (Investment, Present Value, Gain/Loss) */}
      <SummaryCards holdings={holdings} />

      {/* Stock Table */}
      <StockTableData holdings={holdings} />
    </>
  );
}
