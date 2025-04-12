import React, { useEffect } from 'react';
import PageBase from '../../components/base-components/PageBase';
import { getCSRFToken } from '../../api/api';

const HomePage: React.FC = () => {
    useEffect(() => {
        // Call getCSRFToken to trigger the CSRF cookie being set.
        getCSRFToken()
            .then(token => {
                console.log("CSRF token fetched:", token);
            })
            .catch(error => {
                console.error("Error fetching CSRF token:", error);
            });
    }, []);

    return (
        <PageBase>
            <h1>Home</h1>
            <p>Check the console to see the first three data items.</p>
        </PageBase>
    );
};

export default HomePage;
