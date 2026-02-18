import React from 'react'
import Typography from '../ui/Typography'

const Disclaimer = () => {
    return (
        <div className='text-center w-full py-6 px-2 max-w-2xl mx-auto'>
            <Typography variant='body' className='leading-5'>
                <strong>Disclaimer:</strong>
                This dashboard uses unofficial financial data sourced from Yahoo Finance and Google Finance. Data may be delayed or inaccurate. This is not investment advice. Always verify information with official sources before making financial decisions.
            </Typography>
        </div>
    )
}

export default Disclaimer