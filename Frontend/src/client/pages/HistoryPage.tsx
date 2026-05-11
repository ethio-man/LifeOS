import PageFrame from "../components/Layout/PageFrame";

export default function HistoryPage() {
  return (
    <PageFrame
      title="History"
      description="Review past activity, project updates, and job changes in one place once the backend data is connected."
    >
      <p className="text-sm leading-6 text-slate-300">
        No history items are loaded yet. Once the API is wired, this view can
        list prior entries chronologically.
      </p>
    </PageFrame>
  );
}
