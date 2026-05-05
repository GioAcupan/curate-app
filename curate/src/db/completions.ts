import { SQLiteDatabase } from "expo-sqlite";
import { GoalCompletion, GoalCompletionRow } from "../types";
import { newId } from "../lib/ids";

function rowToCompletion(row: GoalCompletionRow): GoalCompletion {
  return {
    id: row.id,
    goalId: row.goal_id,
    completedAt: row.completed_at,
    description: row.description,
  };
}

export async function createCompletion(
  db: SQLiteDatabase,
  params: { goalId: string; description: string },
): Promise<GoalCompletion> {
  const id = newId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO goal_completion (id, goal_id, completed_at, description)
     VALUES (?, ?, ?, ?)`,
    [id, params.goalId, now, params.description],
  );

  return { id, goalId: params.goalId, completedAt: now, description: params.description };
}

export async function getCompletionsForGoal(
  db: SQLiteDatabase,
  goalId: string,
): Promise<GoalCompletion[]> {
  const rows = await db.getAllAsync<GoalCompletionRow>(
    "SELECT * FROM goal_completion WHERE goal_id = ? ORDER BY completed_at DESC",
    [goalId],
  );
  return rows.map(rowToCompletion);
}

export async function getCompletionsInRange(
  db: SQLiteDatabase,
  startIso: string,
  endIso: string,
): Promise<GoalCompletion[]> {
  const rows = await db.getAllAsync<GoalCompletionRow>(
    "SELECT * FROM goal_completion WHERE completed_at >= ? AND completed_at <= ? ORDER BY completed_at DESC",
    [startIso, endIso],
  );
  return rows.map(rowToCompletion);
}

export async function getCompletionCountSince(
  db: SQLiteDatabase,
  sinceIso: string,
): Promise<number> {
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM goal_completion WHERE completed_at >= ?",
    [sinceIso],
  );
  return row?.count ?? 0;
}
