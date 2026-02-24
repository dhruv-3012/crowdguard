import type { Venue, Zone, Camera, DensityLog, Alert, AnalyticsData, AuthTokens, LoginCredentials, RegisterData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  }

  async register(data: RegisterData): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    if (!response.ok) throw new Error('Token refresh failed');
    return response.json();
  }

  // Venues
  async getVenues(): Promise<Venue[]> {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch venues');
    return response.json();
  }

  async createVenue(venue: Partial<Venue>): Promise<Venue> {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(venue)
    });
    if (!response.ok) throw new Error('Failed to create venue');
    return response.json();
  }

  // Zones
  async getZones(venueId: string): Promise<Zone[]> {
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/zones`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch zones');
    return response.json();
  }

  async createZone(zone: Partial<Zone>): Promise<Zone> {
    const response = await fetch(`${API_BASE_URL}/zones`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(zone)
    });
    if (!response.ok) throw new Error('Failed to create zone');
    return response.json();
  }

  // Cameras
  async getCameras(zoneId: string): Promise<Camera[]> {
    const response = await fetch(`${API_BASE_URL}/zones/${zoneId}/cameras`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch cameras');
    return response.json();
  }

  async createCamera(camera: Partial<Camera>): Promise<Camera> {
    const response = await fetch(`${API_BASE_URL}/cameras`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(camera)
    });
    if (!response.ok) throw new Error('Failed to create camera');
    return response.json();
  }

  // Analytics
  async getAnalytics(venueId: string, startDate?: Date, endDate?: Date): Promise<AnalyticsData[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/analytics?${params}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  }

  // Alerts
  async getAlerts(venueId?: string): Promise<Alert[]> {
    const url = venueId 
      ? `${API_BASE_URL}/venues/${venueId}/alerts`
      : `${API_BASE_URL}/alerts`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to acknowledge alert');
  }

  // Density Logs
  async getDensityLogs(venueId: string, startDate?: Date, endDate?: Date): Promise<DensityLog[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/density-logs?${params}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch density logs');
    return response.json();
  }

  async exportDensityLogs(venueId: string, startDate?: Date, endDate?: Date): Promise<Blob> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    
    const response = await fetch(`${API_BASE_URL}/venues/${venueId}/density-logs/export?${params}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to export density logs');
    return response.blob();
  }
}

export const apiService = new ApiService();
