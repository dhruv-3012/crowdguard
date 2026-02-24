import React, { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Operator' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  venue: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@crowdguard.com', role: 'Admin', status: 'Active', lastLogin: '2025-01-24 20:25', venue: 'All Venues' },
  { id: '2', name: 'John Operator', email: 'john@crowdguard.com', role: 'Operator', status: 'Active', lastLogin: '2025-01-24 18:10', venue: 'Madison Square Garden' },
  { id: '3', name: 'Sara Viewer', email: 'sara@crowdguard.com', role: 'Viewer', status: 'Active', lastLogin: '2025-01-23 14:30', venue: 'Barclays Center' },
  { id: '4', name: 'Mike Johnson', email: 'mike@crowdguard.com', role: 'Operator', status: 'Inactive', lastLogin: '2025-01-20 09:15', venue: 'Madison Square Garden' },
  { id: '5', name: 'Emily Davis', email: 'emily@crowdguard.com', role: 'Viewer', status: 'Active', lastLogin: '2025-01-24 11:45', venue: 'Yankee Stadium' },
];

const roleBadgeColor: Record<string, string> = {
  Admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  Operator: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Viewer: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
};

const Users: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">Manage user access and roles</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: mockUsers.length, color: 'text-white' },
          { label: 'Active', value: mockUsers.filter(u => u.status === 'Active').length, color: 'text-green-400' },
          { label: 'Inactive', value: mockUsers.filter(u => u.status === 'Inactive').length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          {['All', 'Admin', 'Operator', 'Viewer'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              {['Name', 'Role', 'Venue', 'Status', 'Last Login', 'Actions'].map(h => (
                <th key={h} className="text-left text-slate-400 font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <tr key={user.id} className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-slate-400 text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${roleBadgeColor[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs">{user.venue}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${user.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{user.lastLogin}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default Users;
