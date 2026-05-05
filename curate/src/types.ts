export type Tag = "academic" | "shadow" | "extracurricular" | "work";
export type Topic = "math" | "software-engineering" | "theoretical-cs";
export type TrackStatus = "active" | "paused" | "completed";
export type GoalStatus = "active" | "archived";
export type SourceType = "youtube_playlist";

export type Track = {
  id: string;
  name: string;
  tag: Tag;
  topic: Topic | null;
  status: TrackStatus;
  createdAt: string;
  updatedAt: string;
};

export type Goal = {
  id: string;
  title: string;
  tag: Tag;
  trackId: string | null;
  isRecurring: boolean;
  frequencyTarget: number;
  reminderTime: string | null;
  scheduledEventId: string | null;
  status: "active" | "archived";
  createdAt: string;
  archivedAt: string | null;
};

export type GoalCompletion = {
  id: string;
  goalId: string;
  completedAt: string;
  description: string;
};

export type Source = {
  id: string;
  type: "youtube_playlist";
  externalId: string;
  title: string;
  channelName: string | null;
  addedAt: string;
  lastSyncedAt: string | null;
};

export type FeedItem = {
  id: string;
  sourceId: string;
  externalId: string;
  title: string;
  channelName: string | null;
  thumbnailUrl: string | null;
  position: number | null;
  publishedAt: string | null;
  fetchedAt: string;
};

export type OneItemHistory = {
  trackId: string;
  lastSurfacedAt: string;
  lastItemId: string | null;
};

// Row types match SQLite column names (snake_case).
// CRUD modules convert between these and the public entity types above.
export type GoalRow = {
  id: string;
  title: string;
  tag: string;
  track_id: string | null;
  is_recurring: number;
  frequency_target: number;
  reminder_time: string | null;
  scheduled_event_id: string | null;
  status: string;
  created_at: string;
  archived_at: string | null;
};

export type GoalCompletionRow = {
  id: string;
  goal_id: string;
  completed_at: string;
  description: string;
};

export type TrackRow = {
  id: string;
  name: string;
  tag: string;
  topic: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SourceRow = {
  id: string;
  type: string;
  external_id: string;
  title: string;
  channel_name: string | null;
  added_at: string;
  last_synced_at: string | null;
};

export type FeedItemRow = {
  id: string;
  source_id: string;
  external_id: string;
  title: string;
  channel_name: string | null;
  thumbnail_url: string | null;
  position: number | null;
  published_at: string | null;
  fetched_at: string;
};

export type OneItemHistoryRow = {
  track_id: string;
  last_surfaced_at: string;
  last_item_id: string | null;
};
