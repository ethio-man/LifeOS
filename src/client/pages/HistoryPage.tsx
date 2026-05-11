import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import { useStore } from '../store';
import { fmtDate, calcDuration, calcMins, typeColorClass, importanceBadgeClass, groupByDate } from '../utils';

export default function HistoryPage() {
  const { activities, fetchActivities, config, fetchConfig } = useStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterImp, setFilterImp] = useState('');

  useEffect(() => { fetchActivities(); fetchConfig(); }, []);

  const filtered = activities.filter((a) => {
    if (search) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.notes.toLowerCase().includes(q)) return false;
    }
    if (filterType && !a.types.includes(filterType)) return false;
    if (filterImp && a.importance !== filterImp) return false;
    return true;
  });

  const groups = groupByDate(filtered);
  const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <Topbar title="Activity History">
        <div className="flex gap-2 items-center flex-wrap">
          <input type="text" placeholder="Search..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-bg-3 border border-white/10 rounded-r px-3 py-1.5 text-sm text-text w-36 md:w-52 focus:outline-none focus:border-accent" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="bg-bg-3 border border-white/10 rounded-r px-3 py-1.5 text-sm text-text w-32 md:w-40 focus:outline-none focus:border-accent">
            <option value="">All types</option>
            {config?.activityTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterImp} onChange={(e) => setFilterImp(e.target.value)}
            className="bg-bg-3 border border-white/10 rounded-r px-3 py-1.5 text-sm text-text w-32 md:w-40 focus:outline-none focus:border-accent hidden md:block">
            <option value="">All levels</option>
            {config?.importanceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </Topbar>
      <div className="p-4 md:p-7 flex-1">
        {sortedDates.length === 0 ? (
          <div className="text-center py-16 text-text-3">
            <div className="text-3xl mb-3 opacity-50">📋</div>
            <p className="text-sm text-text-2">No activities found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div>
        ) : sortedDates.map((date) => {
          const items = groups[date];
          const totalMins = items.reduce((s, a) => s + calcMins(a.startTime, a.endTime), 0);
          return (
            <div key={date} className="mb-6">
              <div className="text-xs font-semibold text-text-3 uppercase tracking-wider mb-2.5 pb-2 border-b border-white/5 flex justify-between">
                <span>{fmtDate(date)} · {items.length} activities</span>
                <span className="font-mono text-[11px]">{(totalMins/60).toFixed(1)}h</span>
              </div>
              <div className="space-y-2">
                {items.map((a) => (
                  <div key={a.id} className="bg-bg-3 border border-white/5 rounded-r p-3 flex items-start gap-3 hover:border-white/10 transition-colors">
                    <div className="font-mono text-[11px] text-text-3 min-w-[80px] pt-0.5 hidden md:block">
                      {a.startTime}{a.endTime ? ` – ${a.endTime}` : ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium mb-1">{a.title}</div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${importanceBadgeClass(a.importance)}`}>{a.importance}</span>
                        {a.types.map((t, i) => (
                          <span key={t} className={`px-2 py-0.5 rounded-xl text-[11px] font-medium ${typeColorClass(config?.activityTypes.indexOf(t) ?? i)}`}>{t}</span>
                        ))}
                      </div>
                      {a.notes && <p className="text-xs text-text-2 mt-1.5">{a.notes}</p>}
                    </div>
                    <div className="font-mono text-[11px] text-text-3 min-w-[50px] text-right pt-0.5 hidden md:block">{calcDuration(a.startTime, a.endTime) || '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
