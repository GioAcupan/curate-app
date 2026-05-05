import { SQLiteDatabase } from "expo-sqlite";
import { OneItemHistory, OneItemHistoryRow } from "../types";

function rowToOneItemHistory(row: OneItemHistoryRow): OneItemHistory {
  return {
    trackId: row.track_id,
    lastSurfacedAt: row.last_surfaced_at,
    lastItemId: row.last_item_id,
  };
}

export async function upsertOneItemHistory(
  db: SQLiteDatabase,
  params: { trackId: string; lastItemId?: string | null },
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO one_item_history (track_id, last_surfaced_at, last_item_id)
     VALUES (?, ?, ?)`,
    [params.trackId, now, params.lastItemId ?? null],
  );
}

export async function getOneItemHistory(
  db: SQLiteDatabase,
): Promise<OneItemHistory[]> {
  const rows = await db.getAllAsync<OneItemHistoryRow>(
    "SELECT * FROM one_item_history",
  );
  return rows.map(rowToOneItemHistory);
}
