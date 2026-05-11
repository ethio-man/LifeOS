import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import MultiSelect from '../components/ui/MultiSelect';
import { useStore } from '../store';
import { todayStr, nowTime, fmtDate, calcDuration, calcMins, typeColorClass, importanceBadgeClass } from '../utils';
import type { Activity } from '../../shared/types';

export default function ActivityLogPage() {
  const { activities, fetchActivities, createActivity, updateActivity, deleteActivity, config, fetchConfig } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', date: todayStr(), startTime: nowTime(), endTime: '', types: [] as string[], importance: '', notes: '',
  });

  useEffect(() => {
    fetchActivities();
    fetchConfig();
  }, []);

  const today = todayStr();
  const todayActivities = activities.filter((a) => a.date === today);
  const todayMins = todayActivities.reduce((sum, a) => sum + calcMins(a.startTime, a.endTime), 0);
  const todayHours = (todayMins / 60).toFixed(1);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weekActivities = activities.filter((a) => a.date >= weekAgo);
  const weekMins = weekActivities.reduce((sum, a) => sum + calcMins(a.startTime, a.endTime), 0);

  const openNew = () => {
    setEditId(null);
    setForm({ title: '', date: todayStr(), startTime: nowTime(), endTime: '', types: [], importance: config?.importanceLevels[0] || 'Important', notes: '' });
    setModalOpen(true);
  };

  const openEdit = (a: Activity) => {
    setEditId(a.id);
    setForm({ title: a.title, date: a.date, startTime: a.startTime, endTime: a.endTime || '', types: a.types, importance: a.importance, notes: a.notes });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.startTime || !form.importance) return;
    if (editId) {
      await updateActivity(editId, { ...form, endTime: form.endTime || null });
    } else {
      await createActivity({ ...form, endTime: form.endTime || null });
    }
    setModalOpen(false);
    fetchActivities();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this activity?')) {
      await deleteActivity(id);
    }
  };

  const stats = [
    { label: 'Today', value: todayActivities.length, sub: 'activities' },
    { label: 'Hours Today', value: todayHours, sub: 'tracked' },
    { label: 'This Week', value: weekActivities.length, sub: 'activities' },
    { label: 'Week Hours', value: (weekMins / 60).toFixed(1), sub: 'tracked' },
  ];

  return (
    <>
      <Topbar title="Activity Log">
        <Button onClick={openNew}>+ Log Activity</Button>
      </Topbar>

      <div className="p-4 md:p-7 flex-1">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg-3 rounded-r p-3 md:p-4">
              <div className="text-[11px] text-text-3 uppercase tracking-wider mb-1.5">{s.label}</div>
              <div className="text-2xl md:text-[26px] font-bold font-mono tracking-tight">{s.value}</div>
              <div className="text-[11px] text-text-3 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Today's Timeline */}
        <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold">Today's Timeline</h3>
              <p className="text-xs text-text-3 mt-0.5">{fmtDate(today)} · {todayActivities.length} activities · {todayHours}h tracked</p>
            </div>
          </div>

          {todayActivities.length === 0 ? (
            <div className="text-center py-12 text-text-3">
              <div className="text-3xl mb-3 opacity-50">⚡</div>
              <p className="text-sm text-text-2">No activities logged today</p>
              <p className="text-xs">Click "+ Log Activity" to start tracking</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayActivities.map((a) => (
                <div key={a.id} className="bg-bg-3 border border-white/5 rounded-r p-3 flex items-start gap-3 group hover:border-white/10 transition-colors">
                  <div className="font-mono text-[11px] text-text-3 min-w-[80px] pt-0.5">
                    {a.startTime}{a.endTime ? ` – ${a.endTime}` : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium mb-1">{a.title}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${importanceBadgeClass(a.importance)}`}>
                        {a.importance}
                      </span>
                      {a.types.map((t, i) => (
                        <span key={t} className={`px-2 py-0.5 rounded-xl text-[11px] font-medium ${typeColorClass(config?.activityTypes.indexOf(t) ?? i)}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                    {a.notes && <p className="text-xs text-text-2 mt-2 leading-relaxed">{a.notes}</p>}
                  </div>
                  <div className="font-mono text-[11px] text-text-3 min-w-[50px] text-right pt-0.5">
                    {calcDuration(a.startTime, a.endTime) || '—'}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(a)} className="text-text-3 hover:text-text text-xs px-1.5 py-0.5 rounded hover:bg-white/5">✎</button>
                    <button onClick={() => handleDelete(a.id)} className="text-text-3 hover:text-rose text-xs px-1.5 py-0.5 rounded hover:bg-rose/10">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Activity' : 'Log Activity'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Activity</Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-text-2 mb-1">Title</label>
            <input
              type="text" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What did you do?"
              className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-2 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-2 mb-1">Importance</label>
              <select value={form.importance} onChange={(e) => setForm({ ...form, importance: e.target.value })}
                className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                {config?.importanceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-2 mb-1">Start Time</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-2 mb-1">End Time</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-2 mb-1">Activity Types <span className="text-text-3 font-normal">(select multiple)</span></label>
            <MultiSelect options={config?.activityTypes || []} selected={form.types} onChange={(types) => setForm({ ...form, types })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-2 mb-1">Notes <span className="text-text-3 font-normal">(optional)</span></label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any context, reflections, or outcomes..."
              className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[72px]" />
          </div>
        </div>
      </Modal>
    </>
  );
}
