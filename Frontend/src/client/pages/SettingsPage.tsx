import { useCallback, useEffect, useState } from "react";
import PageFrame from "../components/Layout/PageFrame";
import { useStore } from "../store";

export default function SettingsPage() {
  const config = useStore((s) => s.config);
  const fetchConfig = useStore((s) => s.fetchConfig);
  const updateConfig = useStore((s) => s.updateConfig);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newType, setNewType] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fetchConfig();
    } catch {
      setError("Could not load settings. Check API URL and authentication.");
    } finally {
      setLoading(false);
    }
  }, [fetchConfig]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    document.title = "LifeOS | Settings";
  }, []);

  const persist = async (activityTypes: string[], importanceLevels: string[]) => {
    setBusy(true);
    setError(null);
    try {
      await updateConfig({ activityTypes, importanceLevels });
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeType = (t: string) => {
    if (!config) return;
    void persist(
      config.activityTypes.filter((x) => x !== t),
      config.importanceLevels,
    );
  };

  const addType = () => {
    const trimmed = newType.trim();
    if (!trimmed || !config) return;
    if (config.activityTypes.includes(trimmed)) {
      setNewType("");
      return;
    }
    void persist([...config.activityTypes, trimmed], config.importanceLevels);
    setNewType("");
  };

  const removeLevel = (level: string) => {
    if (!config) return;
    void persist(
      config.activityTypes,
      config.importanceLevels.filter((x) => x !== level),
    );
  };

  const addLevel = () => {
    const trimmed = newLevel.trim();
    if (!trimmed || !config) return;
    if (config.importanceLevels.includes(trimmed)) {
      setNewLevel("");
      return;
    }
    void persist(config.activityTypes, [...config.importanceLevels, trimmed]);
    setNewLevel("");
  };

  return (
    <PageFrame
      title="Settings"
      description="Manage activity types and importance labels used when logging activities. Changes apply immediately."
    >
      <div className="flex flex-col gap-10">
        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-slate-400">Loading settings…</p>
        ) : !config ? (
          <p className="text-sm text-slate-400">No configuration loaded.</p>
        ) : (
          <>
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Activity types
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Tags you can attach to each activity on the Activity log page.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {config.activityTypes.length === 0 ? (
                  <p className="text-sm text-slate-500">No types yet.</p>
                ) : (
                  config.activityTypes.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-3 pr-1 text-sm text-slate-200"
                    >
                      {t}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeType(t)}
                        className="rounded-full px-2 py-0.5 text-slate-400 hover:bg-white/10 hover:text-red-300 disabled:opacity-40"
                        aria-label={`Remove ${t}`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addType();
                    }
                  }}
                  placeholder="New activity type"
                  className="min-w-[12rem] flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-white outline-none focus:border-cyan-300/50"
                />
                <button
                  type="button"
                  disabled={busy || !newType.trim()}
                  onClick={addType}
                  className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add type
                </button>
              </div>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-10">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Importance levels
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Used as the importance field when creating activities.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {config.importanceLevels.length === 0 ? (
                  <p className="text-sm text-slate-500">No levels yet.</p>
                ) : (
                  config.importanceLevels.map((level) => (
                    <span
                      key={level}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1 pl-3 pr-1 text-sm text-slate-200"
                    >
                      {level}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => removeLevel(level)}
                        className="rounded-full px-2 py-0.5 text-slate-400 hover:bg-white/10 hover:text-red-300 disabled:opacity-40"
                        aria-label={`Remove ${level}`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <input
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLevel();
                    }
                  }}
                  placeholder="New importance level"
                  className="min-w-[12rem] flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-2.5 text-white outline-none focus:border-cyan-300/50"
                />
                <button
                  type="button"
                  disabled={busy || !newLevel.trim()}
                  onClick={addLevel}
                  className="rounded-2xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add level
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </PageFrame>
  );
}
