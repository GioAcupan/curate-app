export type Tag = "academic" | "shadow" | "extracurricular" | "work";
export type Topic = "math" | "software-engineering" | "theoretical-cs";
export type TrackStatus = "active" | "paused" | "completed";

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
