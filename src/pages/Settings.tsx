import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState('80');
  const [retentionDays, setRetentionDays] = useState('30');
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle: React.FC<{ value: boolean; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${value ? 'bg-blue-600' : 'bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );

  const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-white font-semibold text-base">{title}</h2>
        {description && <p className="text-slate-400 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="border-t border-slate-700/50 pt-4 space-y-4">{children}</div>
    </div>
  );

  const Row: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-slate-200 text-sm">{label}</p>
        {hint && <p className="text-slate-500 text-xs mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Configure system preferences and alerts</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Notifications */}
      <Section title="Notifications" description="Choose how you receive system alerts">
        <Row label="Email Notifications" hint="Receive alerts via email">
          <Toggle value={notifEmail} onChange={setNotifEmail} />
        </Row>
        <Row label="SMS Notifications" hint="Receive alerts via SMS">
          <Toggle value={notifSMS} onChange={setNotifSMS} />
        </Row>
        <Row label="Push Notifications" hint="Browser push notifications">
          <Toggle value={notifPush} onChange={setNotifPush} />
        </Row>
      </Section>

      {/* Crowd Monitoring */}
      <Section title="Crowd Monitoring" description="Configure thresholds and intervals">
        <Row label="Alert Threshold (%)" hint="Trigger alert when crowd density exceeds this value">
          <input
            type="number"
            min={1}
            max={100}
            value={alertThreshold}
            onChange={e => setAlertThreshold(e.target.value)}
            className="w-20 bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 text-center focus:outline-none focus:border-blue-500"
          />
        </Row>
        <Row label="Dashboard Refresh (seconds)" hint="How often the dashboard data refreshes">
          <select
            value={refreshInterval}
            onChange={e => setRefreshInterval(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {['5', '10', '30', '60'].map(v => <option key={v} value={v}>{v}s</option>)}
          </select>
        </Row>
      </Section>

      {/* Data Retention */}
      <Section title="Data & Storage" description="Manage how long data is retained">
        <Row label="Log Retention (days)" hint="Automatically delete logs older than this">
          <select
            value={retentionDays}
            onChange={e => setRetentionDays(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {['7', '14', '30', '90', '180', '365'].map(v => <option key={v} value={v}>{v} days</option>)}
          </select>
        </Row>
        <Row label="Export Data" hint="Download a full system data export">
          <button className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-1.5 rounded-lg transition-colors border border-slate-600">
            Export CSV
          </button>
        </Row>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" description="Irreversible actions — proceed with caution">
        <Row label="Clear All Alerts" hint="Permanently delete all alert history">
          <button className="bg-red-900/30 hover:bg-red-800/50 text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-700/40 transition-colors">
            Clear Alerts
          </button>
        </Row>
        <Row label="Reset to Defaults" hint="Restore all settings to factory defaults">
          <button className="bg-red-900/30 hover:bg-red-800/50 text-red-400 text-xs px-3 py-1.5 rounded-lg border border-red-700/40 transition-colors">
            Reset Settings
          </button>
        </Row>
      </Section>
    </div>
  );
};

export default Settings;
