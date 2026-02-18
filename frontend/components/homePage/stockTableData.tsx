import React from 'react'
import Typography from '../ui/Typography'
import StockTable from './StockTable'

const StockTableData = () => {
  return (
    <section>
      <Typography variant='label' className='text-foreground mb-3 uppercase font-semibold'>Holdings</Typography>
      <StockTable/>
    </section>
  )
}

export default StockTableData