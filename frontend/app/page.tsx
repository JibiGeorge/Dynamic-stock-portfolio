import StockTableData from "@/components/homePage/stockTableData";
import SummaryCards from "@/components/homePage/summaryCards";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Summary Cards (Investment, Present Value, Gain/Loss) */}
      <SummaryCards />

      {/* Stock Table */}
      <StockTableData />
    </>
  );
}
