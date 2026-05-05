/**
 * Week math utilities.
 * Week boundary: Monday 00:00:00.000 local → Sunday 23:59:59.999 local.
 */

/**
 * Returns a Date set to Monday 00:00:00.000 local time
 * for the week containing `date`. Defaults to now.
 */
export function weekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  // Days since Monday: if Sunday (0), we need to go back 6 days
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - daysSinceMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns a Date set to Sunday 23:59:59.999 local time
 * for the week containing `date`. Defaults to now.
 */
export function weekEnd(date: Date = new Date()): Date {
  const start = weekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

/**
 * Returns true if the ISO 8601 date string falls within
 * the current week (Monday 00:00 → Sunday 23:59:59.999).
 */
export function isThisWeek(isoString: string, now: Date = new Date()): boolean {
  const date = new Date(isoString);
  const start = weekStart(now);
  const end = weekEnd(now);
  return date >= start && date <= end;
}
