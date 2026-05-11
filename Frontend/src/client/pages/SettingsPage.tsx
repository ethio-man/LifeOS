import PageFrame from "../components/Layout/PageFrame";

export default function SettingsPage() {
  return (
    <PageFrame
      title="Settings"
      description="Tune the app config and defaults from a page that now renders as a real screen."
    >
      <p className="text-sm leading-6 text-slate-300">
        Add configuration controls here when the backend settings endpoints are
        ready.
      </p>
    </PageFrame>
  );
}
