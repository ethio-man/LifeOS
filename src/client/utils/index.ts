export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nowTime(): string {
  return new Date().toTimeString().slice(0, 5);
}

export function fmtDate(s: string): string {
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function calcDuration(start: string, end: string | null): string | null {
  if (!start || !end) return null;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`;
}

export function calcMins(start: string, end: string | null): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
}

export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    if (!groups[item.date]) groups[item.date] = [];
    groups[item.date].push(item);
  }
  return groups;
}

// Type color index (14 colors cycling)
const TYPE_COLORS = [
  'bg-violet-500/15 text-violet-400',
  'bg-teal-500/15 text-teal-400',
  'bg-blue-500/15 text-blue-400',
  'bg-amber-500/15 text-amber-400',
  'bg-rose-500/15 text-rose-400',
  'bg-green-500/15 text-green-400',
  'bg-yellow-500/15 text-yellow-400',
  'bg-purple-500/15 text-purple-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-red-500/15 text-red-400',
  'bg-emerald-500/15 text-emerald-400',
  'bg-pink-500/15 text-pink-400',
  'bg-orange-500/15 text-orange-400',
  'bg-indigo-500/15 text-indigo-400',
];

export function typeColorClass(index: number): string {
  return TYPE_COLORS[index % TYPE_COLORS.length];
}

export function importanceBadgeClass(level: string): string {
  const map: Record<string, string> = {
    'Goal oriented': 'bg-green-500/15 text-green-400',
    'Important': 'bg-blue-500/15 text-blue-400',
    'Medium': 'bg-violet-500/15 text-violet-400',
    'Less': 'bg-gray-500/15 text-gray-400',
    'Waste': 'bg-rose-500/15 text-rose-400',
  };
  return map[level] || 'bg-gray-500/15 text-gray-400';
}
