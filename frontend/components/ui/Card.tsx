import React from 'react'

const Card = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='rounded-lg border border-border bg-card p-5'>
            {children}
        </div>
    )
}

export default Card