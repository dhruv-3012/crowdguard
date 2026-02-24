import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import AnalyticsChart from '../components/analytics/AnalyticsChart';
import ZoneAnalytics from '../components/analytics/ZoneAnalytics';
import { mockVenues, mockZones, generateMockCrowdData, mockAnalytics } from '../services/mockData';
import type { AnalyticsData } from '../types';

const Analytics: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [analyticsData] = useState<AnalyticsData[]>(mockAnalytics);
  const [crowdData] = useState(generateMockCrowdData());

  const zones = mockZones.filter(zone => zone.venueId === selectedVenue.id);

  const handleExport = async () => {
    try {
      // Simulate export functionality
      const csvContent = [
        ['Timestamp', 'Total People', 'Avg Density', 'Alerts Count'],
        ...analyticsData.map(data => [
          data.timestamp.toISOString(),
          data.totalPeople,
          data.avgDensity,
          data.alertsCount
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${selectedVenue.name}-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const stats = {
    avgPeople: Math.floor(analyticsData.reduce((sum, d) => sum + d.totalPeople, 0) / analyticsData.length),
    peakPeople: Math.max(...analyticsData.map(d => d.totalPeople)),
    avgDensity: (analyticsData.reduce((sum, d) => sum + d.avgDensity, 0) / analyticsData.length).toFixed(2),
    totalAlerts: analyticsData.reduce((sum, d) => sum + d.alertsCount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Detailed analytics and historical data for {selectedVenue.name}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-slate-400" />
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
              className="bg-transparent text-white text-sm focus:outline-none"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
              className="bg-transparent text-white text-sm focus:outline-none"
            />
          </div>
          
          {/* Venue Selector */}
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
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Average People</span>
            <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgPeople.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Peak Capacity</span>
            <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.peakPeople.toLocaleString()}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Avg Density</span>
            <div className="w-8 h-8 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgDensity}/m²</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Alerts</span>
            <div className="w-8 h-8 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart data={analyticsData} metric="people" />
        <AnalyticsChart data={analyticsData} metric="density" type="area" />
        <AnalyticsChart data={analyticsData} metric="alerts" />
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Peak Hours Analysis</h3>
          <div className="space-y-4">
            {[
              { hour: '8:00 PM', people: 2847, percentage: 95 },
              { hour: '7:30 PM', people: 2654, percentage: 88 },
              { hour: '8:30 PM', people: 2432, percentage: 81 },
              { hour: '7:00 PM', people: 2156, percentage: 72 }
            ].map((peak, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-white font-medium w-20">{peak.hour}</span>
                <div className="flex-1">
                  <div className="bg-slate-700 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${peak.percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {peak.people.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 text-sm w-12">{peak.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Analytics */}
      <ZoneAnalytics zones={zones} crowdData={crowdData} />
    </div>
  );
};

export default Analytics;
