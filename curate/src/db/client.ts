import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

let db: SQLiteDatabase | null = null;

/**
 * Returns the shared SQLite database instance, opening and migrating
 * if this is the first call. Safe to call multiple times — subsequent
 * calls return the cached instance.
 */
export async function getDb(): Promise<SQLiteDatabase> {
  if (db) return db;

  db = await openDatabaseAsync("curate.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS track (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      tag         TEXT NOT NULL,
      topic       TEXT,
      status      TEXT NOT NULL DEFAULT 'active',
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL,
      CHECK (tag != 'shadow' OR topic IS NOT NULL)
    );

    CREATE TABLE IF NOT EXISTS goal (
      id                 TEXT PRIMARY KEY,
      title              TEXT NOT NULL,
      tag                TEXT NOT NULL,
      track_id           TEXT REFERENCES track(id),
      is_recurring       INTEGER NOT NULL,
      frequency_target   INTEGER NOT NULL DEFAULT 1,
      reminder_time      TEXT,
      scheduled_event_id TEXT,
      status             TEXT NOT NULL DEFAULT 'active',
      created_at         TEXT NOT NULL,
      archived_at        TEXT,
      CHECK (tag != 'shadow' OR track_id IS NOT NULL)
    );

    CREATE TABLE IF NOT EXISTS goal_completion (
      id            TEXT PRIMARY KEY,
      goal_id       TEXT NOT NULL REFERENCES goal(id) ON DELETE CASCADE,
      completed_at  TEXT NOT NULL,
      description   TEXT NOT NULL,
      CHECK (length(trim(description)) > 0)
    );
    CREATE INDEX IF NOT EXISTS idx_completion_goal_time ON goal_completion(goal_id, completed_at);
    CREATE INDEX IF NOT EXISTS idx_completion_time ON goal_completion(completed_at);

    CREATE TABLE IF NOT EXISTS source (
      id              TEXT PRIMARY KEY,
      type            TEXT NOT NULL,
      external_id     TEXT NOT NULL,
      title           TEXT NOT NULL,
      channel_name    TEXT,
      added_at        TEXT NOT NULL,
      last_synced_at  TEXT,
      UNIQUE(type, external_id)
    );

    CREATE TABLE IF NOT EXISTS track_source (
      track_id   TEXT NOT NULL REFERENCES track(id) ON DELETE CASCADE,
      source_id  TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE,
      added_at   TEXT NOT NULL,
      PRIMARY KEY (track_id, source_id)
    );

    CREATE TABLE IF NOT EXISTS feed_item (
      id             TEXT PRIMARY KEY,
      source_id      TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE,
      external_id    TEXT NOT NULL,
      title          TEXT NOT NULL,
      channel_name   TEXT,
      thumbnail_url  TEXT,
      position       INTEGER,
      published_at   TEXT,
      fetched_at     TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_feed_item_source ON feed_item(source_id);

    CREATE TABLE IF NOT EXISTS one_item_history (
      track_id          TEXT PRIMARY KEY REFERENCES track(id) ON DELETE CASCADE,
      last_surfaced_at  TEXT NOT NULL,
      last_item_id      TEXT
    );
  `);

  return db;
}

/**
 * Close and reset the database instance. Useful for testing.
 */
export async function closeDb(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
