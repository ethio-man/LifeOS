import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import Topbar from "../components/Layout/Topbar";
import { useStore } from "../store";
import { calcMins, todayStr } from "../utils";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const CHART_COLORS = [
  "#6c63ff",
  "#00d4aa",
  "#60a5fa",
  "#f5a623",
  "#ff6b8a",
  "#4ade80",
  "#fbbf24",
  "#a78bfa",
  "#22d3ee",
  "#f87171",
  "#34d399",
  "#f9a8d4",
  "#d97706",
  "#818cf8",
];

export default function AnalyticsPage() {
  const { activities, fetchActivities, config, fetchConfig } = useStore();
  const [view, setView] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    fetchActivities();
    fetchConfig();
  }, []);

  const today = todayStr();
  const getRange = () => {
    const d = new Date();
    if (view === "daily") return today;
    if (view === "weekly")
      return new Date(d.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    return new Date(d.getTime() - 30 * 86400000).toISOString().slice(0, 10);
  };
  const rangeStart = getRange();
  const filtered = activities.filter((a) =>
    view === "daily" ? a.date === today : a.date >= rangeStart,
  );

  // Doughnut: time per type
  const typeMinutes: Record<string, number> = {};
  filtered.forEach((a) =>
    a.types.forEach((t) => {
      typeMinutes[t] = (typeMinutes[t] || 0) + calcMins(a.startTime, a.endTime);
    }),
  );
  const typeLabels = Object.keys(typeMinutes);
  const pieData = {
    labels: typeLabels,
    datasets: [
      {
        data: typeLabels.map((t) => +(typeMinutes[t] / 60).toFixed(1)),
        backgroundColor: typeLabels.map((_, i) => CHART_COLORS[i % 14]),
        borderWidth: 0,
      },
    ],
  };

  // Bar: importance distribution
  const impCounts: Record<string, number> = {};
  filtered.forEach((a) => {
    impCounts[a.importance] = (impCounts[a.importance] || 0) + 1;
  });
  const impLabels = config?.importanceLevels || [];
  const barData = {
    labels: impLabels,
    datasets: [
      {
        label: "Count",
        data: impLabels.map((l) => impCounts[l] || 0),
        backgroundColor: [
          "#4ade80",
          "#60a5fa",
          "#6c63ff",
          "#9090a8",
          "#ff6b8a",
        ],
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  // Line: daily hours over time
  const dailyHours: Record<string, number> = {};
  activities.forEach((a) => {
    dailyHours[a.date] =
      (dailyHours[a.date] || 0) + calcMins(a.startTime, a.endTime) / 60;
  });
  const lineDates = Object.keys(dailyHours).sort();
  const lineData = {
    labels: lineDates.map((d) => d.slice(5)),
    datasets: [
      {
        label: "Hours",
        data: lineDates.map((d) => +dailyHours[d].toFixed(1)),
        borderColor: "#6c63ff",
        backgroundColor: "rgba(108,99,255,0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: "#5a5a72", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#5a5a72", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.04)" },
      },
    },
  };

  // Heatmap
  const heatmapDays = 112;
  const heatCells = [];
  for (let i = heatmapDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    const hrs = dailyHours[d] || 0;
    let bg = "bg-white/[0.03]";
    if (hrs > 0 && hrs <= 2) bg = "bg-accent/20";
    else if (hrs > 2 && hrs <= 5) bg = "bg-accent/40";
    else if (hrs > 5 && hrs <= 8) bg = "bg-accent/60";
    else if (hrs > 8) bg = "bg-accent/80";
    heatCells.push(
      <div
        key={d}
        className={`w-3 h-3 rounded-sm ${bg}`}
        title={`${d}: ${hrs.toFixed(1)}h`}
      />,
    );
  }

  return (
    <>
      <Topbar title="Analytics">
        <div className="flex gap-0.5 bg-bg-3 rounded-r p-0.5">
          {(["daily", "weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 md:px-4 py-1.5 rounded-[7px] text-xs md:text-[13px] font-medium transition-all capitalize ${view === v ? "bg-bg-2 text-text shadow-md" : "text-text-2 hover:text-text"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </Topbar>
      <div className="p-4 md:p-7 flex-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
            <h3 className="text-sm font-semibold mb-4">Activity Breakdown</h3>
            <div className="h-[220px] md:h-[260px]">
              <Doughnut
                data={pieData}
                options={{ ...chartOpts, scales: undefined } as any}
              />
            </div>
          </div>
          <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
            <h3 className="text-sm font-semibold mb-4">
              Importance Distribution
            </h3>
            <div className="h-[220px] md:h-[260px]">
              <Bar data={barData} options={chartOpts as any} />
            </div>
          </div>
        </div>
        <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
          <h3 className="text-sm font-semibold mb-1">Consistency Tracker</h3>
          <p className="text-xs text-text-3 mb-4">Total logged hours per day</p>
          <div className="h-[180px] md:h-[200px]">
            <Line data={lineData} options={chartOpts as any} />
          </div>
        </div>
        <div className="bg-bg-2 border border-white/5 rounded-r2 p-4 md:p-5">
          <h3 className="text-sm font-semibold mb-1">Activity Heatmap</h3>
          <p className="text-xs text-text-3 mb-4">Last 16 weeks</p>
          <div className="flex flex-wrap gap-[3px] overflow-x-auto">
            {heatCells}
          </div>
        </div>
      </div>
    </>
  );
}
