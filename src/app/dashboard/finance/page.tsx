'use client';

import React from 'react';
import { financePaymentAPI } from '@/shared/services';

const FinanceDashboard = () => {
    // Placeholder for finance data fetching and state management
    const [overview, setOverview] = React.useState({});

    React.useEffect(() => {
        async function fetchFinanceOverview() {
            try {
                // Using financePaymentAPI instead of the old getFinanceOverview
                const data = await financePaymentAPI.getPaymentOrders();
                setOverview(data);
            } catch (error) {
                console.error('Failed to fetch finance overview:', error);
            }
        }
        fetchFinanceOverview();
    }, []);

    return (
        <div className="finance-dashboard">
            <h1>Finance Dashboard</h1>
            {/* Render finance-related components */}
            <div>
                <p>Total Revenue: {overview.totalRevenue}</p>
                <p>Monthly Revenue: {overview.monthlyRevenue}</p>
                {/* More financial metrics could go here */}
            </div>
        </div>
    );
};

export default FinanceDashboard;

