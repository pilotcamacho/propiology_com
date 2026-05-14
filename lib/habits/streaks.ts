export interface HabitLogEntry {
  logDate: string; // YYYY-MM-DD
  completed: boolean;
}

export function currentStreak(logs: HabitLogEntry[]): number {
  const completed = new Set(logs.filter((l) => l.completed).map((l) => l.logDate));
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]!;

  // If today isn't logged yet, allow streak to start from yesterday
  const cur = new Date(today);
  if (!completed.has(todayStr)) {
    cur.setDate(cur.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const d = cur.toISOString().split('T')[0]!;
    if (completed.has(d)) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function bestStreak(logs: HabitLogEntry[]): number {
  const dates = [...new Set(logs.filter((l) => l.completed).map((l) => l.logDate))].sort();
  if (dates.length === 0) return 0;

  let best = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff =
      (new Date(dates[i]!).getTime() - new Date(dates[i - 1]!).getTime()) / 86_400_000;
    if (Math.round(diff) === 1) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }
  return best;
}

export function todayStr(): string {
  return new Date().toISOString().split('T')[0]!;
}
