import type { Venue, Zone, Camera, User, Alert, CrowdData, AnalyticsData } from '../types';

export const mockUser: User = {
  id: '1',
  email: 'admin@crowdguard.com',
  role: 'admin',
  organizationId: '1',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockVenues: Venue[] = [
  {
    id: '1',
    organizationId: '1',
    name: 'Madison Square Garden',
    mapImageUrl: '/images/msg-floor-plan.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    organizationId: '1',
    name: 'Central Park Arena',
    mapImageUrl: '/images/cpa-floor-plan.jpg',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockZones: Zone[] = [
  {
    id: '1',
    venueId: '1',
    name: 'Main Entrance',
    coordinates: { x: 100, y: 50, width: 200, height: 150 },
    maxCapacity: 500,
    alertThreshold: 400
  },
  {
    id: '2',
    venueId: '1',
    name: 'Concourse Level 1',
    coordinates: { x: 350, y: 100, width: 300, height: 200 },
    maxCapacity: 800,
    alertThreshold: 650
  },
  {
    id: '3',
    venueId: '1',
    name: 'Seating Section A',
    coordinates: { x: 100, y: 250, width: 250, height: 300 },
    maxCapacity: 1200,
    alertThreshold: 1000
  },
  {
    id: '4',
    venueId: '1',
    name: 'Seating Section B',
    coordinates: { x: 400, y: 250, width: 250, height: 300 },
    maxCapacity: 1200,
    alertThreshold: 1000
  }
];

export const mockCameras: Camera[] = [
  { id: '1', zoneId: '1', name: 'Entrance Cam 1', streamUrl: 'rtsp://camera1.local', isActive: true },
  { id: '2', zoneId: '1', name: 'Entrance Cam 2', streamUrl: 'rtsp://camera2.local', isActive: true },
  { id: '3', zoneId: '2', name: 'Concourse Cam 1', streamUrl: 'rtsp://camera3.local', isActive: true },
  { id: '4', zoneId: '3', name: 'Section A Cam', streamUrl: 'rtsp://camera4.local', isActive: false },
  { id: '5', zoneId: '4', name: 'Section B Cam', streamUrl: 'rtsp://camera5.local', isActive: true }
];

export const generateMockCrowdData = (): CrowdData[] => {
  return mockZones.map(zone => {
    const baseCount = Math.floor(Math.random() * zone.maxCapacity);
    const density = baseCount / (zone.coordinates.width * zone.coordinates.height) * 10000;
    const riskLevel = density < 2 ? 'safe' : density < 4 ? 'moderate' : density < 6 ? 'high' : 'critical';
    
    return {
      zoneId: zone.id,
      cameraId: mockCameras.find(c => c.zoneId === zone.id)?.id || '',
      count: baseCount,
      density: parseFloat(density.toFixed(2)),
      timestamp: new Date(),
      riskLevel
    };
  });
};

export const generateMockAlerts = (): Alert[] => {
  const alerts: Alert[] = [];
  const zones = mockZones.filter(() => Math.random() > 0.7);
  
  zones.forEach(zone => {
    const levels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    alerts.push({
      id: Math.random().toString(36).substr(2, 9),
      zoneId: zone.id,
      timestamp: new Date(),
      level,
      message: `${zone.name}: Crowd density ${level === 'critical' ? 'critically' : level} high`,
      acknowledged: false
    });
  });
  
  return alerts;
};

export const generateMockAnalytics = (hours: number = 24): AnalyticsData[] => {
  const data: AnalyticsData[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const totalPeople = Math.floor(Math.random() * 3000) + 500;
    const avgDensity = totalPeople / 4000;
    const peakZones = mockZones.slice(0, Math.floor(Math.random() * 3) + 1).map(z => z.id);
    const alertsCount = Math.floor(Math.random() * 5);
    
    data.push({
      timestamp,
      totalPeople,
      avgDensity: parseFloat(avgDensity.toFixed(2)),
      peakZones,
      alertsCount
    });
  }
  
  return data;
};

export const mockAnalytics = generateMockAnalytics(24);
