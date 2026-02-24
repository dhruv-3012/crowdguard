import React, { useState } from 'react';
import { Camera, Video, VideoOff, Settings, Plus, Eye, EyeOff } from 'lucide-react';
import { mockVenues, mockZones, mockCameras } from '../services/mockData';
import type { Camera as CameraType } from '../types';

const Cameras: React.FC = () => {
  const [cameras] = useState<CameraType[]>(mockCameras);
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [showOfflineOnly, setShowOfflineOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const zones = mockZones.filter(zone => zone.venueId === selectedVenue.id);
  const venueCameras = cameras.filter(camera => 
    zones.some(zone => zone.id === camera.zoneId)
  );
  
  const filteredCameras = showOfflineOnly 
    ? venueCameras.filter(camera => !camera.isActive)
    : venueCameras;

  const getCameraStatus = (camera: CameraType) => {
    if (camera.isActive) {
      return { text: 'Online', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
    } else {
      return { text: 'Offline', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.name || 'Unknown Zone';
  };

  const onlineCount = venueCameras.filter(c => c.isActive).length;
  const offlineCount = venueCameras.filter(c => !c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Camera Management</h1>
          <p className="text-slate-400">Monitor and manage surveillance cameras across venues</p>
        </div>
        
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Camera</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Total Cameras</span>
            <Camera size={20} className="text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-white">{venueCameras.length}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Online</span>
            <Video size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-400">{onlineCount}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Offline</span>
            <VideoOff size={20} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-400">{offlineCount}</p>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Health</span>
            <div className={`w-5 h-5 rounded-full ${
              offlineCount === 0 ? 'bg-green-500' : offlineCount <= 2 ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
          </div>
          <p className="text-2xl font-bold text-white">
            {offlineCount === 0 ? '100%' : Math.round((onlineCount / venueCameras.length) * 100)}%
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Venue Selector */}
            <select
              value={selectedVenue.id}
              onChange={(e) => {
                const venue = mockVenues.find(v => v.id === e.target.value);
                if (venue) setSelectedVenue(venue);
              }}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {mockVenues.map(venue => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </select>
            
            {/* Toggle Offline Only */}
            <button
              onClick={() => setShowOfflineOnly(!showOfflineOnly)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                showOfflineOnly
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {showOfflineOnly ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{showOfflineOnly ? 'Show All' : 'Offline Only'}</span>
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Cameras Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCameras.map((camera) => {
            const status = getCameraStatus(camera);
            
            return (
              <div
                key={camera.id}
                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors"
              >
                {/* Camera Preview */}
                <div className="relative h-48 bg-slate-900">
                  {camera.isActive ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Video size={48} className="text-green-500" />
                      <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoOff size={48} className="text-red-500" />
                      <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Stream URL Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 rounded px-2 py-1">
                    <p className="text-white text-xs truncate">
                      {camera.streamUrl || 'No stream configured'}
                    </p>
                  </div>
                </div>
                
                {/* Camera Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{camera.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Zone:</span>
                      <span className="text-white">{getZoneName(camera.zoneId)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Camera ID:</span>
                      <span className="text-white">{camera.id}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Settings size={16} />
                      <span>Configure</span>
                    </button>
                    {!camera.isActive && (
                      <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                        <Video size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Camera</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Zone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stream URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCameras.map((camera) => {
                const status = getCameraStatus(camera);
                
                return (
                  <tr key={camera.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {camera.isActive ? (
                          <Video size={20} className="text-green-500" />
                        ) : (
                          <VideoOff size={20} className="text-red-500" />
                        )}
                        <span className="text-white font-medium">{camera.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {getZoneName(camera.zoneId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      <span className="text-sm truncate max-w-xs block">
                        {camera.streamUrl || 'Not configured'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-slate-400 hover:text-white transition-colors">
                          <Settings size={16} />
                        </button>
                        {!camera.isActive && (
                          <button className="p-1 text-green-400 hover:text-green-300 transition-colors">
                            <Video size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredCameras.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <Camera size={64} className="text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No cameras found</h3>
          <p className="text-slate-400">
            {showOfflineOnly ? 'All cameras are online' : 'No cameras configured for this venue'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Cameras;
