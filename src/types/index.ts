export interface User {
  id: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Venue {
  id: string;
  organizationId: string;
  name: string;
  mapImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Zone {
  id: string;
  venueId: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  maxCapacity: number;
  alertThreshold: number;
}

export interface Camera {
  id: string;
  zoneId: string;
  name: string;
  streamUrl?: string;
  isActive: boolean;
}

export interface DensityLog {
  id: string;
  cameraId: string;
  timestamp: Date;
  count: number;
  density: number;
  zoneId: string;
}

export interface Alert {
  id: string;
  zoneId: string;
  timestamp: Date;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  acknowledged: boolean;
}

export interface CrowdData {
  zoneId: string;
  cameraId: string;
  count: number;
  density: number;
  timestamp: Date;
  riskLevel: 'safe' | 'moderate' | 'high' | 'critical';
}

export interface HeatmapPoint {
  x: number;
  y: number;
  intensity: number;
  zoneId: string;
}

export interface AnalyticsData {
  timestamp: Date;
  totalPeople: number;
  avgDensity: number;
  peakZones: string[];
  alertsCount: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  organizationName: string;
}

export interface WebSocketMessage {
  type: 'crowd_update' | 'alert' | 'camera_status';
  data: any;
  timestamp: Date;
}
