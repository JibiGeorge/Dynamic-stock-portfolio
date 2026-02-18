import React from 'react'
import Typography from '../ui/Typography'
import StockTable from './StockTable'
import { StockHolding } from '@/types/table.types'

const StockTableData = ({ holdings }: { holdings: StockHolding[] }) => {
  return (
    <section>
      <Typography variant='label' className='text-foreground mb-3 uppercase font-semibold'>Holdings</Typography>
      <StockTable holdings={holdings} />
    </section>
  )
}

export default StockTableData