import React, { useState } from 'react';
import { Plus, MapPin, Users, Edit, Trash2, Camera } from 'lucide-react';
import { mockVenues, mockZones, mockCameras } from '../services/mockData';
import type { Venue } from '../types';

const Venues: React.FC = () => {
  const [venues] = useState<Venue[]>(mockVenues);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);


  const getVenueStats = (venueId: string) => {
    const zones = mockZones.filter(z => z.venueId === venueId);
    const cameras = mockCameras.filter(c => zones.some(z => z.id === c.zoneId));
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.maxCapacity, 0);
    
    return {
      zones: zones.length,
      cameras: cameras.length,
      totalCapacity
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Venue Management</h1>
          <p className="text-slate-400">Manage your venues and monitoring zones</p>
        </div>
        
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Venue</span>
        </button>
      </div>

      {/* Venue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => {
          const stats = getVenueStats(venue.id);
          
          return (
            <div
              key={venue.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedVenue(venue)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <MapPin size={24} className="text-white" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit venue
                    }}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete venue
                    }}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{venue.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-400">Zones</span>
                  </div>
                  <span className="text-white font-medium">{stats.zones}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-400">Cameras</span>
                  </div>
                  <span className="text-white font-medium">{stats.cameras}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-400">Capacity</span>
                  </div>
                  <span className="text-white font-medium">{stats.totalCapacity.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Created {venue.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Venue Detail Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedVenue.name}</h2>
              <button
                onClick={() => setSelectedVenue(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Venue Map */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Venue Layout</h3>
                <div className="bg-slate-700 border border-slate-600 rounded-lg h-64 flex items-center justify-center">
                  {selectedVenue.mapImageUrl ? (
                    <img 
                      src={selectedVenue.mapImageUrl} 
                      alt="Venue Map" 
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <MapPin size={48} className="text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-400">No floor plan uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zones List */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Monitoring Zones</h3>
                <div className="space-y-2">
                  {mockZones
                    .filter(zone => zone.venueId === selectedVenue.id)
                    .map(zone => (
                      <div key={zone.id} className="bg-slate-700 border border-slate-600 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{zone.name}</p>
                            <p className="text-sm text-slate-400">
                              Capacity: {zone.maxCapacity} | Alert at: {zone.alertThreshold}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-400">Cameras</p>
                            <p className="text-white font-medium">
                              {mockCameras.filter(c => c.zoneId === zone.id).length}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Venues;
