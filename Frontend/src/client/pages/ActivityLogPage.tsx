import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import PageFrame from "../components/Layout/PageFrame";
import Modal from "../components/ui/Modal";
import type { Activity } from "../../shared/types";
import { resolvedApiBaseUrl } from "../api/client";
import { useStore } from "../store";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm = () => ({
  title: "",
  date: todayISO(),
  startTime: "09:00",
  endTime: "",
  types: [] as string[],
  importance: "",
  notes: "",
});

export default function ActivityLogPage() {
  const config = useStore((s) => s.config);
  const activities = useStore((s) => s.activities);
  const fetchConfig = useStore((s) => s.fetchConfig);
  const fetchActivities = useStore((s) => s.fetchActivities);
  const createActivity = useStore((s) => s.createActivity);
  const updateActivity = useStore((s) => s.updateActivity);
  const deleteActivity = useStore((s) => s.deleteActivity);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoadError(null);
    setLoading(true);
    try {
      await Promise.all([fetchConfig(), fetchActivities()]);
    } catch (e: unknown) {
      let message =
        "Could not load data. Check VITE_API_URL, network, and login.";
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const url = e.config?.baseURL ?? resolvedApiBaseUrl;
        if (status === 404) {
          message =
            "API returned 404. VITE_API_URL must be your Backend URL (e.g. https://your-backend.vercel.app/api), not the frontend site. Redeploy after changing env.";
        } else if (status === 401) {
          message = "Unauthorized — sign out and sign in again (token may be invalid).";
        } else if (status === 500) {
          message =
            "Server error (500). Open your Backend project on Vercel → Logs. Often DATABASE_URL, Prisma migrate, or Postgres SSL.";
        } else if (!e.response) {
          message =
            "Network error — wrong URL, CORS, or API offline. Confirm VITE_API_URL matches your deployed backend.";
        } else {
          message = `Request failed (${status ?? "?"}). API base: ${url}`;
        }
      }
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchConfig, fetchActivities]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    document.title = "LifeOS | Activity log";
  }, []);

  const importanceOptions = config?.importanceLevels ?? [];
  const typeOptions = config?.activityTypes ?? [];

  useEffect(() => {
    if (!form.importance && importanceOptions.length > 0) {
      setForm((f) => ({ ...f, importance: importanceOptions[0] }));
    }
  }, [form.importance, importanceOptions]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm(),
      importance: importanceOptions[0] ?? "",
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEdit = (a: Activity) => {
    setEditing(a);
    setForm({
      title: a.title,
      date: a.date,
      startTime: a.startTime,
      endTime: a.endTime ?? "",
      types: [...a.types],
      importance: a.importance,
      notes: a.notes,
    });
    setSubmitError(null);
    setModalOpen(true);
  };

  const toggleType = (t: string) => {
    setForm((f) => ({
      ...f,
      types: f.types.includes(t)
        ? f.types.filter((x) => x !== t)
        : [...f.types, t],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.title.trim() || !form.date || !form.startTime || !form.importance) {
      setSubmitError("Title, date, start time, and importance are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime.trim() ? form.endTime.trim() : null,
      types: form.types,
      importance: form.importance,
      notes: form.notes.trim(),
    };

    setSubmitting(true);
    try {
      if (editing) {
        await updateActivity(editing.id, payload);
      } else {
        await createActivity(payload);
      }
      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm());
    } catch {
      setSubmitError(
        editing ? "Could not update activity." : "Could not create activity.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await deleteActivity(id);
    } catch {
      alert("Could not delete activity.");
    }
  };

  const stats = useMemo(() => {
    return { count: activities.length };
  }, [activities.length]);

  return (
    <PageFrame
      title="Activity log"
      description="Log what you did with types and importance from Settings. Add entries here or tune labels under Settings → Activity types."
    >
      <div className="flex flex-col gap-6">
        {loadError ? (
          <p className="text-sm text-red-300">{loadError}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Entries
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {loading ? "…" : stats.count}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Types configured
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {loading ? "…" : typeOptions.length}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Status
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-300/90">
                {loading ? "Loading…" : "Ready"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreate}
            disabled={loading || !config}
            className="rounded-2xl bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add activity
          </button>
        </div>

        {!loading && !config ? (
          <p className="text-sm text-amber-200/90">
            Config did not load. Open Settings after login, or verify the API.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-white/10">
          {loading ? (
            <p className="p-6 text-sm text-slate-400">Loading activities…</p>
          ) : activities.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">
              No activities yet. Use{" "}
              <span className="text-cyan-300">Add activity</span> to create one.
            </p>
          ) : (
            <ul className="divide-y divide-white/10">
              {activities.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 p-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">{a.title}</span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                        {a.importance}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">
                      {a.date} · {a.startTime}
                      {a.endTime ? `–${a.endTime}` : ""}
                    </p>
                    {a.types.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {a.types.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-100"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {a.notes ? (
                      <p className="text-sm leading-relaxed text-slate-300">
                        {a.notes}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="rounded-xl border border-white/15 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(a.id)}
                      className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit activity" : "New activity"}
      >
        <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-200">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              placeholder="What did you do?"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">Date</span>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">
                Importance
              </span>
              <select
                required
                value={form.importance}
                onChange={(e) =>
                  setForm((f) => ({ ...f, importance: e.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              >
                {importanceOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">
                Start time
              </span>
              <input
                required
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startTime: e.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-200">
                End time{" "}
                <span className="font-normal text-slate-500">(optional)</span>
              </span>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endTime: e.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              />
            </label>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Activity types
            </span>
            {typeOptions.length === 0 ? (
              <p className="text-sm text-amber-200/90">
                Add types under Settings → Activity types first.
              </p>
            ) : (
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                {typeOptions.map((t) => (
                  <label
                    key={t}
                    className="flex cursor-pointer items-center gap-3 text-sm text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={form.types.includes(t)}
                      onChange={() => toggleType(t)}
                      className="size-4 rounded border-white/20 bg-slate-900 text-cyan-400"
                    />
                    {t}
                  </label>
                ))}
              </div>
            )}
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-slate-200">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              rows={3}
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
              placeholder="Optional details"
            />
          </label>

          {submitError ? (
            <p className="text-sm text-red-300">{submitError}</p>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditing(null);
              }}
              className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-cyan-300 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-cyan-200 disabled:opacity-60"
            >
              {submitting ? "Saving…" : editing ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </PageFrame>
  );
}
