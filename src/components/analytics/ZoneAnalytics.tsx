import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Zone, CrowdData } from '../../types';

interface ZoneAnalyticsProps {
  zones: Zone[];
  crowdData: CrowdData[];
}

const ZoneAnalytics: React.FC<ZoneAnalyticsProps> = ({ zones, crowdData }) => {
  const zoneData = zones.map(zone => {
    const data = crowdData.find(d => d.zoneId === zone.id);
    return {
      name: zone.name,
      current: data?.count || 0,
      capacity: zone.maxCapacity,
      utilization: data ? ((data.count / zone.maxCapacity) * 100).toFixed(1) : '0',
      riskLevel: data?.riskLevel || 'safe'
    };
  });

  const riskDistribution = zoneData.reduce((acc, zone) => {
    acc[zone.riskLevel] = (acc[zone.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(riskDistribution).map(([level, count]) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: count
  }));

  const COLORS = {
    safe: '#10b981',
    moderate: '#f59e0b',
    high: '#fb923c',
    critical: '#ef4444'
  };

  const getBarColor = (riskLevel: string) => {
    return COLORS[riskLevel as keyof typeof COLORS] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="text-slate-300 text-sm">{entry.name}:</span>
              <span className="text-white font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Zone Utilization</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={zoneData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="current" 
              name="Current People"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="capacity" 
              name="Max Capacity"
              fill="#64748b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          {zoneData.map((zone, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded-lg">
              <span className="text-sm text-slate-300 truncate">{zone.name}</span>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getBarColor(zone.riskLevel) }}
                ></div>
                <span className="text-sm text-white font-medium">{zone.utilization}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Risk Level Distribution</h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomPieLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#6b7280'}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: COLORS[entry.name.toLowerCase() as keyof typeof COLORS] }}
              ></div>
              <span className="text-sm text-slate-300">
                {entry.name}: {entry.value} zones
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZoneAnalytics;
