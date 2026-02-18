"use client"

import React, { useState } from 'react'
import Typography from './ui/Typography'
import { RefreshCw } from 'lucide-react'

const Header = () => {

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    return (
        <header className='border-b bg-card/50 border-border'>
            <div className='container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
                <Typography variant='h4' className='font-bold text-foreground'>Portfolio Dashboard</Typography>
                <button
                    className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50'>
                    <RefreshCw className={`w-3.5 h-3.5 ${!isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>
        </header>
    )
}

export default Header