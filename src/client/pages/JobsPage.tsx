import { useEffect, useState } from 'react';
import Topbar from '../components/Layout/Topbar';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useStore } from '../store';
import type { Job } from '../../shared/types';

const STATUS_STYLES: Record<string, string> = {
  applied: 'bg-blue/15 text-blue', interview: 'bg-amber/15 text-amber', offer: 'bg-green/15 text-green',
  rejected: 'bg-rose/15 text-rose', ghosted: 'bg-white/5 text-text-3', withdrawn: 'bg-white/5 text-text-3',
};

export default function JobsPage() {
  const { jobs, fetchJobs, createJob, updateJob, deleteJob } = useStore();
  const [filter, setFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ company: '', role: '', status: 'applied' as Job['status'], appliedDate: '', location: '', url: '', rejection: '', notes: '' });

  useEffect(() => { fetchJobs(); }, []);

  const filtered = filter ? jobs.filter(j => j.status === filter) : jobs;
  const stats = [
    { l: 'Total', v: jobs.length }, { l: 'Interviews', v: jobs.filter(j => j.status === 'interview').length },
    { l: 'Offers', v: jobs.filter(j => j.status === 'offer').length }, { l: 'Rejections', v: jobs.filter(j => j.status === 'rejected').length },
  ];

  const openNew = () => { setEditId(null); setForm({ company: '', role: '', status: 'applied', appliedDate: new Date().toISOString().slice(0,10), location: '', url: '', rejection: '', notes: '' }); setModalOpen(true); };
  const openEdit = (j: Job) => { setEditId(j.id); setForm({ company: j.company, role: j.role, status: j.status, appliedDate: j.appliedDate, location: j.location, url: j.url, rejection: j.rejection, notes: j.notes }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.company || !form.role) return;
    if (editId) await updateJob(editId, form);
    else await createJob(form);
    setModalOpen(false); fetchJobs();
  };

  return (
    <>
      <Topbar title="Job Tracker"><Button onClick={openNew}>+ Add Application</Button></Topbar>
      <div className="p-4 md:p-7 flex-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map(s => (
            <div key={s.l} className="bg-bg-3 rounded-r p-3">
              <div className="text-[11px] text-text-3 uppercase tracking-wider mb-1">{s.l}</div>
              <div className="text-2xl font-bold font-mono">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold">Applications</h3>
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="bg-bg-3 border border-white/10 rounded-r px-3 py-1.5 text-sm text-text w-36 focus:outline-none focus:border-accent">
              <option value="">All statuses</option>
              <option value="applied">Applied</option><option value="interview">Interview</option>
              <option value="offer">Offer</option><option value="rejected">Rejected</option>
              <option value="ghosted">Ghosted</option><option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-text-3"><div className="text-3xl mb-3 opacity-50">💼</div><p className="text-sm text-text-2">No applications yet</p></div>
          ) : (
            <div className="space-y-2">
              {filtered.map(j => (
                <div key={j.id} className="bg-bg-3 border border-white/5 rounded-r p-3.5 hover:border-white/10 transition-colors group cursor-pointer" onClick={() => openEdit(j)}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <div>
                      <div className="text-sm font-semibold">{j.company}</div>
                      <div className="text-xs text-text-2">{j.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[j.status]}`}>{j.status}</span>
                      <span className="text-[11px] text-text-3 font-mono">{j.appliedDate}</span>
                    </div>
                  </div>
                  {j.location && <div className="text-[11px] text-text-3 mt-1">{j.location}</div>}
                  {j.rejection && <div className="text-[11px] text-rose/70 mt-1">Rejection: {j.rejection}</div>}
                  <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deleteJob(j.id); }}
                    className="text-text-3 hover:text-rose text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-1">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Application' : 'Add Application'}
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Company</label>
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Role</label>
              <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Job['status']})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                <option value="applied">Applied</option><option value="interview">Interview</option><option value="offer">Offer</option>
                <option value="rejected">Rejected</option><option value="ghosted">Ghosted</option><option value="withdrawn">Withdrawn</option></select></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Applied Date</label>
              <input type="date" value={form.appliedDate} onChange={e => setForm({...form, appliedDate: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-text-2 mb-1">Location</label>
              <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
            <div><label className="block text-xs font-medium text-text-2 mb-1">Job URL</label>
              <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent" /></div>
          </div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Rejection Reasons</label>
            <textarea value={form.rejection} onChange={e => setForm({...form, rejection: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[50px]" /></div>
          <div><label className="block text-xs font-medium text-text-2 mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-bg-3 border border-white/10 rounded-r px-3 py-2 text-sm text-text focus:outline-none focus:border-accent resize-y min-h-[50px]" /></div>
        </div>
      </Modal>
    </>
  );
}
