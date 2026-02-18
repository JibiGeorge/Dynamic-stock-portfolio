"use client"

import Disclaimer from "@/components/homePage/Disclaimer";
import StockTableData from "@/components/homePage/stockTableData";
import SummaryCards from "@/components/homePage/summaryCards";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Home() {

  const { holdings } = usePortfolio();

  return (
    <>
      {/* Summary Cards (Investment, Present Value, Gain/Loss) */}
      <SummaryCards holdings={holdings} />

      {/* Stock Table */}
      <StockTableData holdings={holdings} />

      {/* Disclaimer */}
      <Disclaimer/>
    </>
  );
}
