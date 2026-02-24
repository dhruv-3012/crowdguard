import React, { useState, useEffect } from 'react';
import OverviewCards from '../components/dashboard/OverviewCards';
import CrowdHeatmap from '../components/dashboard/CrowdHeatmap';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import ZoneAnalytics from '../components/analytics/ZoneAnalytics';
import { mockVenues, mockZones, generateMockCrowdData, generateMockAlerts, mockAnalytics } from '../services/mockData';
import type { CrowdData, Alert, AnalyticsData } from '../types';

const Dashboard: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [crowdData, setCrowdData] = useState<CrowdData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [analyticsData] = useState<AnalyticsData[]>(mockAnalytics);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const zones = mockZones.filter(zone => zone.venueId === selectedVenue.id);

  // Simulate real-time updates
  useEffect(() => {
    const updateData = () => {
      setCrowdData(generateMockCrowdData());
      setAlerts(generateMockAlerts());
      setLastUpdate(new Date());
    };

    // Initial data
    updateData();

    // Update every 2 seconds
    const interval = setInterval(updateData, 2000);

    return () => clearInterval(interval);
  }, [selectedVenue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Crowd Monitoring Dashboard</h1>
          <p className="text-slate-400">
            Real-time monitoring for {selectedVenue.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedVenue.id}
            onChange={(e) => {
              const venue = mockVenues.find(v => v.id === e.target.value);
              if (venue) setSelectedVenue(venue);
            }}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            {mockVenues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
          
          <div className="text-right">
            <p className="text-sm text-slate-400">Last Updated</p>
            <p className="text-white font-medium">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards crowdData={crowdData} alerts={alerts} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap - Takes 2 columns on large screens */}
        <div className="xl:col-span-2">
          <CrowdHeatmap 
            zones={zones} 
            crowdData={crowdData}
            venueImage={selectedVenue.mapImageUrl}
          />
        </div>
        
        {/* Alerts Panel */}
        <div>
          <AlertsPanel 
            alerts={alerts} 
            onAlertUpdate={() => {
              setAlerts(generateMockAlerts());
            }}
          />
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={analyticsData} metric="people" />
        <AnalyticsChart data={analyticsData} metric="density" type="area" />
      </div>

      {/* Zone Analytics */}
      <ZoneAnalytics zones={zones} crowdData={crowdData} />
    </div>
  );
};

export default Dashboard;
