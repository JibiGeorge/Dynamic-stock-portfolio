"use client"

import React, { useMemo } from 'react'
import Typography from '../ui/Typography'
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { StockHolding } from '@/types/table.types';

const StockTable = () => {

    const columnHelper = createColumnHelper<StockHolding>();

    const columns = useMemo<ColumnDef<StockHolding, any>[]>(() => [
        columnHelper.accessor("stockName", {
            header: "Particulars (Stock Name)",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("purchasePrice", {
            header: "Purchase Price",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("qty", {
            header: "Quantity (Qty)",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("investment", {
            header: "Investment",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("portfolio", {
            header: "Portfolio %",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("nse_bse", {
            header: "NSE/BSE",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("cmp", {
            header: "CMP",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("present_value", {
            header: "Present Value",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("gain_loss", {
            header: "Gain/Loss",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("peRatio", {
            header: "PE Ratio",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        }),
        columnHelper.accessor("latestEarnings", {
            header: "Latest Earnings",
            cell: (info) => (
                <span className="text-sm font-medium text-muted-foreground">{info.getValue()}</span>
            )
        })
    ], [])

    const table = useReactTable({
        data: [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <div>
            <table className='w-full text-left'>
                <thead>
                    {table.getHeaderGroups().map((hg) => (
                        <tr className="border-b border-border bg-secondary/50" key={hg.id}>
                            {hg.headers.map((header) => (
                                <th className="px-4 py-3" key={header.id}>
                                    <Typography className='text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center'>{flexRender(header.column.columnDef.header, header.getContext())}</Typography>
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