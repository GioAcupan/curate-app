import { SQLiteDatabase } from "expo-sqlite";
import { Source, SourceRow } from "../types";
import { newId } from "../lib/ids";

function rowToSource(row: SourceRow): Source {
  return {
    id: row.id,
    type: row.type as Source["type"],
    externalId: row.external_id,
    title: row.title,
    channelName: row.channel_name,
    addedAt: row.added_at,
    lastSyncedAt: row.last_synced_at,
  };
}

export async function createSource(
  db: SQLiteDatabase,
  params: {
    type: string;
    externalId: string;
    title: string;
    channelName?: string | null;
  },
): Promise<Source> {
  const id = newId();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO source (id, type, external_id, title, channel_name, added_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, params.type, params.externalId, params.title, params.channelName ?? null, now],
  );

  return {
    id,
    type: params.type as Source["type"],
    externalId: params.externalId,
    title: params.title,
    channelName: params.channelName ?? null,
    addedAt: now,
    lastSyncedAt: null,
  };
}

export async function getSource(
  db: SQLiteDatabase,
  id: string,
): Promise<Source | null> {
  const row = await db.getFirstAsync<SourceRow>(
    "SELECT * FROM source WHERE id = ?",
    [id],
  );
  return row ? rowToSource(row) : null;
}

export async function getSourcesForTrack(
  db: SQLiteDatabase,
  trackId: string,
): Promise<Source[]> {
  const rows = await db.getAllAsync<SourceRow>(
    `SELECT s.* FROM source s
     JOIN track_source ts ON ts.source_id = s.id
     WHERE ts.track_id = ?
     ORDER BY s.added_at DESC`,
    [trackId],
  );
  return rows.map(rowToSource);
}

export async function attachSourceToTrack(
  db: SQLiteDatabase,
  trackId: string,
  sourceId: string,
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    "INSERT OR IGNORE INTO track_source (track_id, source_id, added_at) VALUES (?, ?, ?)",
    [trackId, sourceId, now],
  );
}

export async function detachSourceFromTrack(
  db: SQLiteDatabase,
  trackId: string,
  sourceId: string,
): Promise<void> {
  await db.runAsync(
    "DELETE FROM track_source WHERE track_id = ? AND source_id = ?",
    [trackId, sourceId],
  );
}

export async function updateSourceSyncTime(
  db: SQLiteDatabase,
  sourceId: string,
): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    "UPDATE source SET last_synced_at = ? WHERE id = ?",
    [now, sourceId],
  );
}
