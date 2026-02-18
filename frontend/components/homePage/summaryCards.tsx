"use client"

import React, { useMemo, useState } from 'react'
import Typography from '../ui/Typography'
import Card from '../ui/Card'
import { StockHolding } from '@/types/table.types';

export function getInvestment(stock: StockHolding): number {
  return stock.purchasePrice * stock.quantity;
}

export function getPresentValue(stock: StockHolding): number | null {
  if (stock.cmp === null) return null;
  return stock.cmp * stock.quantity;
}

export function formatCurrency(val: number): string {
  if (Math.abs(val) >= 100000) {
    return "₹" + (val / 100000).toFixed(2) + "L";
  }
  return "₹" + val.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

const SummaryCards = ({ holdings }: { holdings: StockHolding[] }) => {

  const { totalInvestment, totalPresentValue, totalGainLoss, gainLossPercent } = useMemo(() => {
    let inv = 0, pv = 0;
    for (const h of holdings) {
      inv += getInvestment(h);
      pv += getPresentValue(h) ?? getInvestment(h);
    }
    return {
      totalInvestment: inv,
      totalPresentValue: pv,
      totalGainLoss: pv - inv,
      gainLossPercent: inv > 0 ? ((pv - inv) / inv) * 100 : 0,
    };
  }, [holdings]);

  const isProfit = totalGainLoss >= 0;

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {/* Total Investment */}
      <Card>
        <Typography variant='caption' className='uppercase not-italic'>Total Investment</Typography>
        <Typography variant='h3' className='text-foreground'>{formatCurrency(totalInvestment)}</Typography>
      </Card>

      {/* Present Value */}
      <Card>
        <Typography variant='caption' className='uppercase not-italic'>Present Value</Typography>
        <Typography variant='h3' className='text-foreground'>{formatCurrency(totalPresentValue)}</Typography>
      </Card>

      {/* Gain/Loss */}
      <Card>
        <Typography variant='caption' className='uppercase not-italic'>Total Gain/Loss</Typography>
        <Typography variant='h3' className={`text-foreground ${isProfit ? "text-gain" : "text-loss"}`}>
          {isProfit ? "+" : ""} {formatCurrency(totalGainLoss)}
        </Typography>
      </Card>
    </section>
  )
}

export default SummaryCards