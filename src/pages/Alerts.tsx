import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter, Search, Bell } from 'lucide-react';
import { generateMockAlerts } from '../services/mockData';
import type { Alert } from '../types';

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateMockAlerts());
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !alert.acknowledged) ||
      (filter === 'acknowledged' && alert.acknowledged);
    
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = 
      levelFilter === 'all' || alert.level === levelFilter;
    
    return matchesFilter && matchesSearch && matchesLevel;
  });

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'medium':
        return <AlertTriangle size={20} className="text-orange-500" />;
      case 'high':
        return <AlertTriangle size={20} className="text-red-500" />;
      case 'critical':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <AlertTriangle size={20} className="text-slate-500" />;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'border-yellow-500/20 bg-yellow-500/10';
      case 'medium':
        return 'border-orange-500/20 bg-orange-500/10';
      case 'high':
        return 'border-red-500/20 bg-red-500/10';
      case 'critical':
        return 'border-red-600/20 bg-red-600/10';
      default:
        return 'border-slate-500/20 bg-slate-500/10';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'critical':
        return 'bg-red-600/20 text-red-500 border-red-600/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  };

  const handleAcknowledgeAll = () => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, acknowledged: true }))
    );
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const activeAlerts = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert Management</h1>
          <p className="text-slate-400">Monitor and manage safety alerts across all venues</p>
        </div>
        
        {activeAlerts > 0 && (
          <button
            onClick={handleAcknowledgeAll}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <CheckCircle size={20} />
            <span>Acknowledge All ({activeAlerts})</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Alerts</span>
            <Bell size={20} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-white">{alerts.length}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Active</span>
            <Bell size={20} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-white">{activeAlerts}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Acknowledged</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">{alerts.filter(a => a.acknowledged).length}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Critical</span>
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <p className="text-2xl font-bold text-white">
            {alerts.filter(a => a.level === 'critical' && !a.acknowledged).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-slate-400" />
            <div className="flex space-x-2">
              {['all', 'active', 'acknowledged'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option as any)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    filter === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No alerts found</h3>
            <p className="text-slate-400">
              {searchTerm || levelFilter !== 'all' || filter !== 'all'
                ? 'Try adjusting your filters'
                : 'All systems are operating normally'}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${getAlertColor(
                alert.level
              )} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">{getAlertIcon(alert.level)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {alert.message}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelBadgeColor(
                        alert.level
                      )}`}>
                        {alert.level.toUpperCase()}
                      </span>
                      {alert.acknowledged && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Zone ID: {alert.zoneId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle size={16} />
                    <span>Acknowledge</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
