import React, { useRef, useEffect } from 'react';
import type { CrowdData, Zone } from '../../types';

interface CrowdHeatmapProps {
  zones: Zone[];
  crowdData: CrowdData[];
  venueImage?: string;
}

const CrowdHeatmap: React.FC<CrowdHeatmapProps> = ({ zones, crowdData, venueImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'safe':
        return 'rgba(34, 197, 94, 0.6)'; // green
      case 'moderate':
        return 'rgba(250, 204, 21, 0.6)'; // yellow
      case 'high':
        return 'rgba(251, 146, 60, 0.6)'; // orange
      case 'critical':
        return 'rgba(239, 68, 68, 0.6)'; // red
      default:
        return 'rgba(156, 163, 175, 0.6)'; // gray
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function drawZones() {
      if (!ctx || !canvas) return;
      
      zones.forEach(zone => {
        const data = crowdData.find(d => d.zoneId === zone.id);
        if (!data) return;

        // Scale coordinates to canvas size
        const scaleX = canvas.width / 800; // Assuming original width is 800
        const scaleY = canvas.height / 600; // Assuming original height is 600
        
        const x = zone.coordinates.x * scaleX;
        const y = zone.coordinates.y * scaleY;
        const width = zone.coordinates.width * scaleX;
        const height = zone.coordinates.height * scaleY;

        // Draw zone with risk color
        ctx.fillStyle = getRiskColor(data.riskLevel);
        ctx.fillRect(x, y, width, height);

        // Draw zone border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw zone label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const label = `${zone.name}\n${data.count} people\n${data.density}/m²`;
        const lines = label.split('\n');
        lines.forEach((line, index) => {
          ctx.fillText(line, x + width / 2, y + height / 2 + (index - 1) * 20);
        });
      });
    }

    // Draw venue background if available
    if (venueImage) {
      const img = new Image();
      img.onload = () => {
        if (ctx && canvas) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          drawZones();
        }
      };
      img.src = venueImage;
    } else {
      // Draw placeholder background
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawZones();
    }
  }, [zones, crowdData, venueImage]);

  const legend = [
    { level: 'Safe', color: 'bg-green-500' },
    { level: 'Moderate', color: 'bg-yellow-500' },
    { level: 'High', color: 'bg-orange-500' },
    { level: 'Critical', color: 'bg-red-500' }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Live Crowd Heatmap</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-slate-400">Live</span>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full h-auto border border-slate-600 rounded-lg bg-slate-900"
        />
        
        <div className="absolute top-4 right-4 bg-slate-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 border border-slate-600">
          <p className="text-xs font-medium text-slate-400 mb-2">Risk Level</p>
          <div className="space-y-1">
            {legend.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${item.color} rounded-sm`}></div>
                <span className="text-xs text-slate-300">{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdHeatmap;
