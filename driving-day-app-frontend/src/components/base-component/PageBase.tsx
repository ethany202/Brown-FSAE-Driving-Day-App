import React from 'react'

interface PageBaseProps{
    children: React.ReactNode;
}

export default function PageBase({children} : PageBaseProps){
    return (
        <div className='page-content-main'>
            <div className='page-content-body'>
                {children}
            </div>
        </div>
    )
}