"use client"

import React, { useState } from 'react'
import Typography from '../ui/Typography'
import Card from '../ui/Card'

const SummaryCards = () => {

    const [isProfit, setIsProfit] = useState<boolean>(true);

    return (
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Total Investment */}
            <Card>
                <Typography variant='caption' className='uppercase not-italic'>Total Investment</Typography>
                <Typography variant='h3' className='text-foreground'>₹3.37L</Typography>
            </Card>

            {/* Present Value */}
            <Card>
                <Typography variant='caption' className='uppercase not-italic'>Total Investment</Typography>
                <Typography variant='h3' className='text-foreground'>₹3.37L</Typography>
            </Card>

            {/* Gain/Loss */}
            <Card>
                <Typography variant='caption' className='uppercase not-italic'>Total Investment</Typography>
                <Typography variant='h3' className={`text-foreground ${isProfit ? "text-gain" : "text-loss"}`}>
                    {isProfit ? "+" : ""}₹3.37L
                </Typography>
            </Card>
        </section>
    )
}

export default SummaryCards