import { SQLiteDatabase } from "expo-sqlite";
import { Track, TrackRow } from "../types";
import { newId } from "../lib/ids";

function rowToTrack(row: TrackRow): Track {
  return {
    id: row.id,
    name: row.name,
    tag: row.tag as Track["tag"],
    topic: row.topic as Track["topic"],
    status: row.status as Track["status"],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createTrack(
  db: SQLiteDatabase,
  params: { name: string; tag: string; topic?: string | null; status?: string },
): Promise<Track> {
  const id = newId();
  const now = new Date().toISOString();
  const topic = params.tag === "shadow" ? (params.topic ?? null) : null;

  await db.runAsync(
    `INSERT INTO track (id, name, tag, topic, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, params.name, params.tag, topic, params.status ?? "active", now, now],
  );

  return {
    id,
    name: params.name,
    tag: params.tag as Track["tag"],
    topic: topic as Track["topic"],
    status: (params.status ?? "active") as Track["status"],
    createdAt: now,
    updatedAt: now,
  };
}

export async function getTrack(
  db: SQLiteDatabase,
  id: string,
): Promise<Track | null> {
  const row = await db.getFirstAsync<TrackRow>(
    "SELECT * FROM track WHERE id = ?",
    [id],
  );
  return row ? rowToTrack(row) : null;
}

export async function getAllTracks(db: SQLiteDatabase): Promise<Track[]> {
  const rows = await db.getAllAsync<TrackRow>("SELECT * FROM track ORDER BY created_at DESC");
  return rows.map(rowToTrack);
}

export async function updateTrack(
  db: SQLiteDatabase,
  id: string,
  params: { name?: string; tag?: string; topic?: string | null; status?: string },
): Promise<void> {
  const now = new Date().toISOString();
  const sets: string[] = ["updated_at = ?"];
  const values: (string | null)[] = [now];

  if (params.name !== undefined) {
    sets.push("name = ?");
    values.push(params.name);
  }
  if (params.tag !== undefined) {
    sets.push("tag = ?");
    values.push(params.tag);
    if (params.tag === "shadow" && params.topic !== undefined) {
      sets.push("topic = ?");
      values.push(params.topic);
    } else if (params.tag !== "shadow") {
      sets.push("topic = NULL");
    }
  } else if (params.topic !== undefined) {
    sets.push("topic = ?");
    values.push(params.topic);
  }
  if (params.status !== undefined) {
    sets.push("status = ?");
    values.push(params.status);
  }

  values.push(id);
  await db.runAsync(
    `UPDATE track SET ${sets.join(", ")} WHERE id = ?`,
    values,
  );
}
