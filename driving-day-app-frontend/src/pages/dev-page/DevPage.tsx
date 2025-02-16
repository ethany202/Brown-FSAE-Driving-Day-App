import React from 'react';

export default function DevPage(){

    const clearLocalStorage = () => {
        localStorage.clear()
    }

    return (
        <div>
            <button onClick={clearLocalStorage}>Clear All Local Storage</button>
        </div>
    )
}