import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CTODashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCTOStats();
  }, []);

  const fetchCTOStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/cto-dashboard/metrics');
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">CTO Dashboard</h1>
      <div>
        <h2 className="font-bold">System Health</h2>
        <p>CPU Usage: {stats?.systemHealth?.cpuUsagePercent || 0}%</p>
        <p>Memory Usage: {stats?.systemHealth?.memoryUsagePercent || 0}%</p>
        <p>Uptime: {stats?.systemHealth?.uptimeMinutes || 0} minutes</p>
      </div>
      <div>
        <h2 className="font-bold">Error Statistics</h2>
        <p>Last 24 Hours: {stats?.errorStats?.errorsLast24Hours || 0}</p>
        <p>Last Week: {stats?.errorStats?.errorsLastWeek || 0}</p>
      </div>
      <div>
        <h2 className="font-bold">API Performance</h2>
        <p>Total Calls: {stats?.apiStats?.totalCallsLast24Hours || 0}</p>
        <p>Success Rate: {stats?.apiStats?.successRatePercent || 0}%</p>
        <p>Avg Response Time: {stats?.apiStats?.averageResponseTimeMs || 0} ms</p>
      </div>
    </div>
  );
}
