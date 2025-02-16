import React, { useState, useEffect } from 'react';
import { getSpecificRunData } from '../../api/api';
import { CATEGORIES } from '../../utils/DataTypes';

const Home: React.FC = () => {

    async function getAllDataAsync() {
        const result = await getSpecificRunData({
            runTitle: "2025-2-12-coolant-test",
            categories: [CATEGORIES.COOL_TEMP, CATEGORIES.ENG_OIL_PRESSURE]
        })

        console.log(result.data)
        return result

    }

    useEffect(() => {
        getAllDataAsync()
    }, [])

    return (
        <div>
            <h1>Home</h1>
            <p>Check the console to see the first three data items.</p>
        </div>
    );
};

export default Home;
