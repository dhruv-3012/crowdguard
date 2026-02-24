import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type { AnalyticsData } from '../../types';

interface AnalyticsChartProps {
  data: AnalyticsData[];
  type?: 'line' | 'area';
  metric?: 'people' | 'density' | 'alerts';
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, type = 'line', metric = 'people' }) => {
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const chartData = data.map(item => ({
    time: formatTime(item.timestamp),
    people: item.totalPeople,
    density: item.avgDensity * 100, // Convert to percentage for better visualization
    alerts: item.alertsCount,
    timestamp: item.timestamp
  }));

  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'people':
        return {
          dataKey: 'people',
          stroke: '#3b82f6',
          fill: '#3b82f6',
          name: 'Total People',
          unit: 'people'
        };
      case 'density':
        return {
          dataKey: 'density',
          stroke: '#10b981',
          fill: '#10b981',
          name: 'Avg Density',
          unit: '%'
        };
      case 'alerts':
        return {
          dataKey: 'alerts',
          stroke: '#f59e0b',
          fill: '#f59e0b',
          name: 'Alerts',
          unit: 'count'
        };
      default:
        return {
          dataKey: 'people',
          stroke: '#3b82f6',
          fill: '#3b82f6',
          name: 'Total People',
          unit: 'people'
        };
    }
  };

  const config = getMetricConfig(metric);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-slate-300 text-sm">
                {entry.name}: {entry.value} {entry.name === 'Avg Density' ? '%' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          {metric === 'people' ? 'Crowd Density Over Time' : 
           metric === 'density' ? 'Average Density Trend' : 
           'Alert Frequency'}
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#94a3b8' }}
          />
          <DataComponent
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.stroke}
            fill={config.fill}
            fillOpacity={type === 'area' ? 0.3 : 1}
            strokeWidth={2}
            name={config.name}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
