import PageFrame from "../components/Layout/PageFrame";

export default function AnalyticsPage() {
  return (
    <PageFrame
      title="Analytics"
      description="Track trends, streaks, and summaries without leaving a raw placeholder screen."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Focus time", "--"],
          ["Activities", "--"],
          ["Projects", "--"],
          ["Jobs", "--"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </PageFrame>
  );
}
