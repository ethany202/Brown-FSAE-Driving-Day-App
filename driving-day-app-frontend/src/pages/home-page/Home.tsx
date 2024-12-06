import React, { useEffect } from 'react';
import { getAllData } from '../../api/api';

const Home: React.FC = () => {
    console.log("Home.tsx");
    useEffect(() => {
        const fetchAndLogData = async () => {
            try {
                const response = await getAllData(); // Trigger the API call
                const data = response?.data || []; // Correctly access the 'data' property from the response
                if (data.length > 0) {
                    console.log('First three data items:', data.slice(0, 3)); // Log the first three items
                } else {
                    console.log('No data available.');
                }
            } catch (error) {
                console.error('Error fetching data:', error); // Log any errors during the API call
            }
        };

        fetchAndLogData(); // Call the fetch function on component mount
    }, []); // Empty dependency array ensures the effect runs only once when the component mounts

    return (
        <div>
            <h1>Home</h1>
            <p>Check the console to see the first three data items.</p>
        </div>
    );
};

export default Home;
