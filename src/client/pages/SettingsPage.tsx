import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import Button from '../components/ui/Button';
import { useStore } from '../store';

export default function SettingsPage() {
  const { config, fetchConfig, updateConfig } = useStore();
  const [newType, setNewType] = useState('');
  const [newLevel, setNewLevel] = useState('');

  useEffect(() => { fetchConfig(); }, []);

  const addType = async () => {
    if (!newType.trim() || !config) return;
    await updateConfig({ activityTypes: [...config.activityTypes, newType.trim()] });
    setNewType('');
  };

  const removeType = async (t: string) => {
    if (!config) return;
    await updateConfig({ activityTypes: config.activityTypes.filter(x => x !== t) });
  };

  const addLevel = async () => {
    if (!newLevel.trim() || !config) return;
    await updateConfig({ importanceLevels: [...config.importanceLevels, newLevel.trim()] });
    setNewLevel('');
  };

  const removeLevel = async (l: string) => {
    if (!config) return;
    await updateConfig({ importanceLevels: config.importanceLevels.filter(x => x !== l) });
  };

  const handleExport = async () => {
    const res = await fetch('/api/activities', { headers: { Authorization: `Bearer ${localStorage.getItem('lifeos_token')}` } });
    const activities = await res.json();
    const blob = new Blob([JSON.stringify({ activities, config }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `lifeos-export-${new Date().toISOString().slice(0,10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('lifeos_token');
    window.location.href = '/login';
  };

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-4 md:p-7 flex-1">
        <div className="max-w-xl">
          {/* Activity Types */}
          <div className="mb-7">
            <h3 className="text-sm font-semibold mb-1">Activity Types</h3>
            <p className="text-xs text-text-3 mb-3">Manage the list of activity types used when logging activities.</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {config?.activityTypes.map(t => (
                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 border border-white/10 rounded-full text-xs font-medium">
                  {t}
                  <button onClick={() => removeType(t)} className="text-text-3 hover:text-rose transition-colors text-sm leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newType} onChange={e => setNewType(e.target.value)} placeholder="Add new type..."
                onKeyDown={e => e.key === 'Enter' && addType()}
                className="flex-1 max-w-[260px] bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
              <Button variant="outline" onClick={addType}>Add</Button>
            </div>
          </div>

          <hr className="border-white/5 my-5" />

          {/* Importance Levels */}
          <div className="mb-7">
            <h3 className="text-sm font-semibold mb-1">Importance Levels</h3>
            <p className="text-xs text-text-3 mb-3">Manage importance levels (order matters — best to worst).</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {config?.importanceLevels.map(l => (
                <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-bg-3 border border-white/10 rounded-full text-xs font-medium">
                  {l}
                  <button onClick={() => removeLevel(l)} className="text-text-3 hover:text-rose transition-colors text-sm leading-none">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={newLevel} onChange={e => setNewLevel(e.target.value)} placeholder="Add new level..."
                onKeyDown={e => e.key === 'Enter' && addLevel()}
                className="flex-1 max-w-[260px] bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
              <Button variant="outline" onClick={addLevel}>Add</Button>
            </div>
          </div>

          <hr className="border-white/5 my-5" />

          {/* Data */}
          <div>
            <h3 className="text-sm font-semibold mb-1">Data</h3>
            <p className="text-xs text-text-3 mb-3">Export your data or sign out.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>Export JSON</Button>
              <Button variant="danger" onClick={handleLogout}>Sign Out</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
