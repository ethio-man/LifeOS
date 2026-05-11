import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useStore } from '../store';
import type { Project } from '../../shared/types';

export default function ProjectsPage() {
  const { projects, fetchProjects, createProject, updateProject, deleteProject } = useStore();
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', status: 'in-progress' as Project['status'], desc: '', startDate: '', endDate: '', skills: '', url: '', progress: 0, notes: '' });

  useEffect(() => { fetchProjects(); }, []);

  const filtered = tab === 'all' ? projects : projects.filter(p => p.status === tab);
  const counts = { all: projects.length, completed: projects.filter(p => p.status === 'completed').length, 'in-progress': projects.filter(p => p.status === 'in-progress').length, planned: projects.filter(p => p.status === 'planned').length };
  const tabs = [{ key: 'all', label: 'All' }, { key: 'completed', label: 'Completed' }, { key: 'in-progress', label: 'In Progress' }, { key: 'planned', label: 'Planned' }];

  const openNew = () => { setEditId(null); setForm({ name: '', status: 'in-progress', desc: '', startDate: '', endDate: '', skills: '', url: '', progress: 0, notes: '' }); setModalOpen(true); };
  const openEdit = (p: Project) => { setEditId(p.id); setForm({ name: p.name, status: p.status, desc: p.desc, startDate: p.startDate || '', endDate: p.endDate || '', skills: p.skills.join(', '), url: p.url, progress: p.progress, notes: p.notes }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) return;
    const data = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean), startDate: form.startDate || null, endDate: form.endDate || null };
    if (editId) await updateProject(editId, data);
    else await createProject(data);
    setModalOpen(false); fetchProjects();
  };

  const statusColor: Record<string, string> = { completed: 'text-green', 'in-progress': 'text-accent-2', planned: 'text-text-3' };

  return (
    <>
      <Topbar title="Projects"><Button onClick={openNew}>+ Add Project</Button></Topbar>
      <div className="p-4 md:p-7 flex-1">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ l: 'Completed', v: counts.completed, c: 'text-green' }, { l: 'In Progress', v: counts['in-progress'], c: 'text-accent-2' }, { l: 'Planned', v: counts.planned, c: 'text-text-3' }].map(s => (
            <div key={s.l} className="bg-bg-3 rounded-r p-3">
              <div className="text-[11px] text-text-3 uppercase tracking-wider mb-1">{s.l}</div>
              <div className={`text-2xl font-bold font-mono ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-0.5 bg-bg-3 rounded-r p-0.5 w-fit mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 md:px-4 py-1.5 rounded-[7px] text-xs md:text-[13px] font-medium transition-all ${tab===t.key ? 'bg-bg-2 text-text shadow-md' : 'text-text-2'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-3"><div className="text-3xl mb-3 opacity-50">🚀</div><p className="text-sm text-text-2">No projects yet</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-bg-3 border border-white/5 rounded-r p-4 hover:border-white/10 transition-colors group cursor-pointer" onClick={() => openEdit(p)}>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-semibold">{p.name}</div>
                  <span className={`text-[11px] font-semibold capitalize ${statusColor[p.status]}`}>{p.status}</span>
                </div>
                {p.desc && <p className="text-xs text-text-2 mb-2.5 line-clamp-2">{p.desc}</p>}
                {p.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.skills.map(s => <span key={s} className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-text-2">{s}</span>)}
                  </div>
                )}
                {p.status === 'in-progress' && (
                  <div className="mt-2">
                    <div className="h-1 bg-bg-2 rounded-full"><div className="h-full bg-accent rounded-full transition-all" style={{ width: `${p.progress}%` }} /></div>
                    <div className="text-[10px] text-text-3 mt-1">{p.progress}%</div>
                  </div>
                )}
                <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteProject(p.id); }}
                  className="text-text-3 hover:text-rose text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-2">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Project' : 'Add Project'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save Project</Button></>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Project['status']})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                <option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="planned">Planned</option></select></div>
          </div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Description</label>
            <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[60px]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          </div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Skills Used <span className="text-text-3">(comma-separated)</span></label>
            <input type="text" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">URL</label>
              <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Progress %</label>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm({...form, progress: +e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          </div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[60px]" /></div>
        </div>
      </Modal>
    </>
  );
}
