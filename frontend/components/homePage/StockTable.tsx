"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Typography from '../ui/Typography'
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { StockHolding } from '@/types/table.types';
import { initialHoldings } from '@/data/portfolioData';
import axios from 'axios';
import { usePortfolioData } from '@/hooks/useUserPortfolioData';
import { getInvestment, getPresentValue } from './summaryCards';

export function getGainLoss(stock: StockHolding): number | null {
    const pv = getPresentValue(stock);
    if (pv === null) return null;
    return pv - getInvestment(stock);
}

export function getGainLossPercent(stock: StockHolding): number | null {
    const gl = getGainLoss(stock);
    if (gl === null) return null;
    const inv = getInvestment(stock);
    if (inv === 0) return 0;
    return (gl / inv) * 100;
}

function formatCurrency(val: number | null): string {
    if (val === null) return "—";
    return "₹" + val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercent(val: number | null): string {
    if (val === null) return "—";
    return val.toFixed(2) + "%";
}


const StockTable = () => {

    const columnHelper = createColumnHelper<StockHolding>();

    const { holdings } = usePortfolioData();

    const totalInvestment = useMemo(
        () => holdings.reduce((sum, h) => sum + getInvestment(h), 0),
        [holdings]
    );

    const columns = useMemo<ColumnDef<StockHolding, any>[]>(
        () => [
            columnHelper.accessor("name", {
                header: "Particulars (Stock Name)",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{info.getValue()}</Typography>
            }),

            columnHelper.accessor("purchasePrice", {
                header: "Purchase Price",
            }),

            columnHelper.accessor("quantity", {
                header: "Quantity (Qty)",
            }),

            columnHelper.accessor("investment", {
                header: "Investment",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{formatCurrency(getInvestment(info.row.original))}</Typography>
            }),

            columnHelper.accessor("portfolio", {
                header: "Portfolio %",
                cell: (info) => {
                    const pct = totalInvestment > 0 ? (getInvestment(info.row.original) / totalInvestment) * 100 : 0;
                    return <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{pct.toFixed(1)}%</Typography>
                },
            }),

            columnHelper.accessor("exchange", {
                header: "NSE/BSE",
            }),

            columnHelper.accessor("cmp", {
                header: "CMP",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{info.getValue() ? `₹ ${info.getValue()}` : "Loading..."}</Typography>
            }),

            columnHelper.accessor("presentValue", {
                header: "Present Value",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{info.getValue() ? `₹ ${info.getValue()}` : "-"}</Typography>
            }),

            columnHelper.accessor("gainLoss", {
                header: "Gain/Loss",
                cell: (info) => {
                    if (info.row.original.isLoading) return <span className="ticker-pulse text-muted-foreground text-sm">Loading…</span>;
                    const gl = getGainLoss(info.row.original);
                    const glPct = getGainLossPercent(info.row.original);
                    if (gl === null) return <span className="text-muted-foreground">—</span>;
                    const isProfit = gl >= 0;
                    return <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground ${isProfit ? "text-gain" : "text-loss"}`}>{isProfit ? "+" : ""}{formatCurrency(gl)}</Typography>
                },
            }),

            columnHelper.accessor("peRatio", {
                header: "PE Ratio",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{info.getValue() ?? "-"}</Typography>
            }),

            columnHelper.accessor("latestEarnings", {
                header: "Latest Earnings",
                cell: (info) => <Typography variant='bodySmall' className={`whitespace-nowrap text-foreground `}>{info.getValue() ?? "-"}</Typography>
            }),
        ],
        []
    );

    const table = useReactTable({
        data: holdings,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className='overflow-x-auto rounded-lg border border-border'>
            <table className='w-full text-left'>
                <thead>
                    {table.getHeaderGroups().map((hg) => (
                        <tr className="border-b border-border bg-secondary/50" key={hg.id}>
                            {hg.headers.map((header) => (
                                <th className="px-4 py-3" key={header.id}>
                                    <Typography className='whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-foreground text-center'>{flexRender(header.column.columnDef.header, header.getContext())}</Typography>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-3">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

export default StockTable