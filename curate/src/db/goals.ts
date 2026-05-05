import { SQLiteDatabase } from "expo-sqlite";
import { Goal, GoalRow } from "../types";
import { newId } from "../lib/ids";

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    tag: row.tag as Goal["tag"],
    trackId: row.track_id,
    isRecurring: row.is_recurring === 1,
    frequencyTarget: row.frequency_target,
    reminderTime: row.reminder_time,
    scheduledEventId: row.scheduled_event_id,
    status: row.status as Goal["status"],
    createdAt: row.created_at,
    archivedAt: row.archived_at,
  };
}

export async function createGoal(
  db: SQLiteDatabase,
  params: {
    title: string;
    tag: string;
    trackId?: string | null;
    isRecurring: boolean;
    frequencyTarget?: number;
    reminderTime?: string | null;
    scheduledEventId?: string | null;
  },
): Promise<Goal> {
  const id = newId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO goal (id, title, tag, track_id, is_recurring, frequency_target, reminder_time, scheduled_event_id, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)`,
    [
      id,
      params.title,
      params.tag,
      params.trackId ?? null,
      params.isRecurring ? 1 : 0,
      params.frequencyTarget ?? 1,
      params.reminderTime ?? null,
      params.scheduledEventId ?? null,
      now,
    ],
  );

  return {
    id,
    title: params.title,
    tag: params.tag as Goal["tag"],
    trackId: params.trackId ?? null,
    isRecurring: params.isRecurring,
    frequencyTarget: params.frequencyTarget ?? 1,
    reminderTime: params.reminderTime ?? null,
    scheduledEventId: params.scheduledEventId ?? null,
    status: "active",
    createdAt: now,
    archivedAt: null,
  };
}

export async function getGoal(
  db: SQLiteDatabase,
  id: string,
): Promise<Goal | null> {
  const row = await db.getFirstAsync<GoalRow>(
    "SELECT * FROM goal WHERE id = ?",
    [id],
  );
  return row ? rowToGoal(row) : null;
}

export async function getAllGoals(db: SQLiteDatabase): Promise<Goal[]> {
  const rows = await db.getAllAsync<GoalRow>(
    "SELECT * FROM goal ORDER BY created_at DESC",
  );
  return rows.map(rowToGoal);
}

export async function getActiveGoals(db: SQLiteDatabase): Promise<Goal[]> {
  const rows = await db.getAllAsync<GoalRow>(
    "SELECT * FROM goal WHERE status = 'active' ORDER BY created_at DESC",
  );
  return rows.map(rowToGoal);
}

export async function updateGoal(
  db: SQLiteDatabase,
  id: string,
  params: {
    title?: string;
    tag?: string;
    trackId?: string | null;
    isRecurring?: boolean;
    frequencyTarget?: number;
    reminderTime?: string | null;
    scheduledEventId?: string | null;
  },
): Promise<void> {
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    switch (key) {
      case "title":
        sets.push("title = ?");
        values.push(value as string);
        break;
      case "tag":
        sets.push("tag = ?");
        values.push(value as string);
        break;
      case "trackId":
        sets.push("track_id = ?");
        values.push(value as string | null);
        break;
      case "isRecurring":
        sets.push("is_recurring = ?");
        values.push((value as boolean) ? 1 : 0);
        break;
      case "frequencyTarget":
        sets.push("frequency_target = ?");
        values.push(value as number);
        break;
      case "reminderTime":
        sets.push("reminder_time = ?");
        values.push(value as string | null);
        break;
      case "scheduledEventId":
        sets.push("scheduled_event_id = ?");
        values.push(value as string | null);
        break;
    }
  }

  if (sets.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE goal SET ${sets.join(", ")} WHERE id = ?`,
    values,
  );
}

export async function archiveGoal(
  db: SQLiteDatabase,
  id: string,
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    "UPDATE goal SET status = 'archived', archived_at = ? WHERE id = ?",
    [now, id],
  );
}
