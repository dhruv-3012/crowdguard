import React from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { Alert } from '../../types';
import { apiService } from '../../services/api';

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertUpdate: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAlertUpdate }) => {
  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-orange-500" />;
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'critical':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertTriangle size={16} className="text-slate-500" />;
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

  const handleAcknowledge = async (alertId: string) => {
    try {
      await apiService.acknowledgeAlert(alertId);
      onAlertUpdate();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
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

  const activeAlerts = alerts.filter(alert => !alert.acknowledged).slice(0, 5);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Recent Alerts</h3>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {activeAlerts.length} Active
        </span>
      </div>
      
      <div className="space-y-3">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <p className="text-slate-400">No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${getAlertColor(
                alert.level
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">{getAlertIcon(alert.level)}</div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {alerts.length > 5 && (
        <button className="w-full mt-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
          View All Alerts ({alerts.length})
        </button>
      )}
    </div>
  );
};

export default AlertsPanel;
