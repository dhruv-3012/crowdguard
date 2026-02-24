import React from 'react';
import { Users, Camera, AlertTriangle, TrendingUp } from 'lucide-react';
import type { CrowdData, Alert } from '../../types';

interface OverviewCardsProps {
  crowdData: CrowdData[];
  alerts: Alert[];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ crowdData, alerts }) => {
  const totalPeople = crowdData.reduce((sum, data) => sum + data.count, 0);
  const activeCameras = crowdData.length;
  const activeAlerts = alerts.filter(alert => !alert.acknowledged).length;
  const criticalZones = crowdData.filter(data => data.riskLevel === 'critical').length;

  const cards = [
    {
      title: 'Total People',
      value: totalPeople.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20'
    },
    {
      title: 'Active Cameras',
      value: activeCameras.toString(),
      change: 'All Online',
      changeType: 'positive' as const,
      icon: Camera,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Active Alerts',
      value: activeAlerts.toString(),
      change: activeAlerts > 0 ? `-${Math.floor(Math.random() * 5)}%` : 'None',
      changeType: activeAlerts > 0 ? 'negative' as const : 'positive' as const,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10',
      borderColor: 'border-orange-500/20'
    },
    {
      title: 'Critical Zones',
      value: criticalZones.toString(),
      change: criticalZones > 0 ? 'Attention Needed' : 'All Safe',
      changeType: criticalZones > 0 ? 'negative' as const : 'positive' as const,
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-gradient-to-br ${card.bgColor} border ${card.borderColor} rounded-xl p-6 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
              <card.icon size={24} className="text-white" />
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-slate-400 text-sm mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
