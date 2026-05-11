import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useStore } from '../store';
import type { Skill } from '../../shared/types';

export default function SkillsPage() {
  const { skills, fetchSkills, createSkill, updateSkill, deleteSkill } = useStore();
  const [tab, setTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', status: 'acquired' as Skill['status'], category: '', level: '' as Skill['level'], tags: '', source: '', notes: '' });

  useEffect(() => { fetchSkills(); }, []);

  const filtered = tab === 'all' ? skills : skills.filter(s => s.status === tab);
  const dotColor: Record<string, string> = { acquired: 'bg-green', planned: 'bg-amber', heard: 'bg-text-3' };
  const tabs = [{ key: 'all', label: 'All' }, { key: 'acquired', label: 'Acquired' }, { key: 'planned', label: 'Planned' }, { key: 'heard', label: 'Heard About' }];

  const openNew = () => { setEditId(null); setForm({ name: '', status: 'acquired', category: '', level: '', tags: '', source: '', notes: '' }); setModalOpen(true); };
  const openEdit = (s: Skill) => { setEditId(s.id); setForm({ name: s.name, status: s.status, category: s.category, level: s.level, tags: s.tags.join(', '), source: s.source, notes: s.notes }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name) return;
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    if (editId) await updateSkill(editId, data);
    else await createSkill(data);
    setModalOpen(false); fetchSkills();
  };

  return (
    <>
      <Topbar title="Skill Store"><Button onClick={openNew}>+ Add Skill</Button></Topbar>
      <div className="p-4 md:p-7 flex-1">
        <div className="flex gap-0.5 bg-bg-3 rounded-r p-0.5 w-fit mb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 md:px-4 py-1.5 rounded-[7px] text-xs md:text-[13px] font-medium transition-all ${tab===t.key ? 'bg-bg-2 text-text shadow-md' : 'text-text-2'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-text-3"><div className="text-3xl mb-3 opacity-50">🧠</div><p className="text-sm text-text-2">No skills yet</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(s => (
              <div key={s.id} className="bg-bg-3 border border-white/5 rounded-r p-3.5 hover:border-white/10 transition-colors group cursor-pointer" onClick={() => openEdit(s)}>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteSkill(s.id); }}
                    className="text-text-3 hover:text-rose text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
                <div className="flex items-center gap-2 text-[11.5px] text-text-3">
                  <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${dotColor[s.status]}`} />{s.status}</span>
                  {s.level && <span>· {s.level}</span>}
                  {s.category && <span>· {s.category}</span>}
                </div>
                {s.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {s.tags.map(t => <span key={t} className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-text-2">{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Skill' : 'Add Skill'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save Skill</Button></>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Skill Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Rust" className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Skill['status']})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                <option value="acquired">Acquired</option><option value="planned">Plan to Explore</option><option value="heard">Heard About</option></select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Category</label>
              <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="e.g. Programming" className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Proficiency</label>
              <select value={form.level} onChange={e => setForm({...form, level: e.target.value as Skill['level']})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                <option value="">—</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option><option value="Expert">Expert</option></select></div>
          </div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Tags <span className="text-text-3 font-normal">(comma-separated)</span></label>
            <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="backend, performance" className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Source</label>
            <input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="YouTube, colleague..." className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Why it's interesting..."
              className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[60px]" /></div>
        </div>
      </Modal>
    </>
  );
}
