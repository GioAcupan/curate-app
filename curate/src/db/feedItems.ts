import { SQLiteDatabase } from "expo-sqlite";
import { FeedItem, FeedItemRow } from "../types";

function rowToFeedItem(row: FeedItemRow): FeedItem {
  return {
    id: row.id,
    sourceId: row.source_id,
    externalId: row.external_id,
    title: row.title,
    channelName: row.channel_name,
    thumbnailUrl: row.thumbnail_url,
    position: row.position,
    publishedAt: row.published_at,
    fetchedAt: row.fetched_at,
  };
}

export async function upsertFeedItems(
  db: SQLiteDatabase,
  items: {
    id: string;
    sourceId: string;
    externalId: string;
    title: string;
    channelName?: string | null;
    thumbnailUrl?: string | null;
    position?: number | null;
    publishedAt?: string | null;
  }[],
): Promise<void> {
  const now = new Date().toISOString();
  for (const item of items) {
    await db.runAsync(
      `INSERT OR REPLACE INTO feed_item (id, source_id, external_id, title, channel_name, thumbnail_url, position, published_at, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.id,
        item.sourceId,
        item.externalId,
        item.title,
        item.channelName ?? null,
        item.thumbnailUrl ?? null,
        item.position ?? null,
        item.publishedAt ?? null,
        now,
      ],
    );
  }
}

export async function getFeedItemsForTrack(
  db: SQLiteDatabase,
  trackId: string,
  limit = 20,
): Promise<FeedItem[]> {
  const rows = await db.getAllAsync<FeedItemRow>(
    `SELECT fi.* FROM feed_item fi
     JOIN source s ON s.id = fi.source_id
     JOIN track_source ts ON ts.source_id = s.id
     WHERE ts.track_id = ?
     ORDER BY fi.published_at DESC
     LIMIT ?`,
    [trackId, limit],
  );
  return rows.map(rowToFeedItem);
}

export async function getFeedItemsForAllActiveTracks(
  db: SQLiteDatabase,
  limit = 20,
): Promise<FeedItem[]> {
  const rows = await db.getAllAsync<FeedItemRow>(
    `SELECT DISTINCT fi.* FROM feed_item fi
     JOIN source s ON s.id = fi.source_id
     JOIN track_source ts ON ts.source_id = s.id
     JOIN track t ON t.id = ts.track_id
     WHERE t.status = 'active'
     ORDER BY fi.published_at DESC
     LIMIT ?`,
    [limit],
  );
  return rows.map(rowToFeedItem);
}

export async function clearFeedItemsForSource(
  db: SQLiteDatabase,
  sourceId: string,
): Promise<void> {
  await db.runAsync(
    "DELETE FROM feed_item WHERE source_id = ?",
    [sourceId],
  );
}
