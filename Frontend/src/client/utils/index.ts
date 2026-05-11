export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function fmtDate(s: string): string {
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calcDuration(start: string, end: string | null): string | null {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const mins = eh * 60 + em - (sh * 60 + sm);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
}

export function calcMins(start: string, end: string | null): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Math.max(0, eh * 60 + em - (sh * 60 + sm));
}

export function groupByDate<T extends { date: string }>(
  items: T[],
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }
  return groups;
}

// Type color index (14 colors cycling)
const TYPE_COLORS = [
  "bg-violet-500/15 text-violet-400",
  "bg-teal-500/15 text-teal-400",
  "bg-blue-500/15 text-blue-400",
  "bg-amber-500/15 text-amber-400",
  "bg-rose-500/15 text-rose-400",
  "bg-green-500/15 text-green-400",
  "bg-yellow-500/15 text-yellow-400",
  "bg-purple-500/15 text-purple-400",
];

export function getTypeColor(type: string | undefined): string {
  if (!type) return TYPE_COLORS[0];
  const hash = type.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return TYPE_COLORS[hash % TYPE_COLORS.length];
}

export function getImportanceColor(level: string): string {
  const map: Record<string, string> = {
    "Goal oriented": "bg-rose-500/15 text-rose-400",
    Important: "bg-orange-500/15 text-orange-400",
    Medium: "bg-yellow-500/15 text-yellow-400",
    Less: "bg-blue-500/15 text-blue-400",
    Waste: "bg-gray-500/15 text-gray-400",
  };
  return map[level] || "bg-gray-500/15 text-gray-400";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    "in-progress": "bg-blue-500/15 text-blue-400",
    completed: "bg-green-500/15 text-green-400",
    planned: "bg-purple-500/15 text-purple-400",
    applied: "bg-orange-500/15 text-orange-400",
    interview: "bg-blue-500/15 text-blue-400",
    offer: "bg-green-500/15 text-green-400",
    rejected: "bg-red-500/15 text-red-400",
    ghosted: "bg-gray-500/15 text-gray-400",
    withdrawn: "bg-yellow-500/15 text-yellow-400",
    acquired: "bg-green-500/15 text-green-400",
    heard: "bg-gray-500/15 text-gray-400",
  };
  return map[status] || "bg-gray-500/15 text-gray-400";
}
