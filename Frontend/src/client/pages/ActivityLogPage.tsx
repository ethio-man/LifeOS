import PageFrame from "../components/Layout/PageFrame";

export default function ActivityLogPage() {
  return (
    <PageFrame
      title="Activity Log"
      description="Capture what happened today, review your time blocks, and keep the log readable instead of empty placeholder text."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-2 text-2xl font-semibold text-white">Ready</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Entries</p>
          <p className="mt-2 text-2xl font-semibold text-white">0 loaded</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-400">Next step</p>
          <p className="mt-2 text-2xl font-semibold text-white">Connect API</p>
        </div>
      </div>
    </PageFrame>
  );
}
