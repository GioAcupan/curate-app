import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useTracks } from "../../src/hooks/useTracks";
import type { Track, TrackStatus } from "../../src/types";

const STATUS_LABELS: Record<TrackStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
};

const TOPIC_LABELS: Record<string, string> = {
  math: "Math",
  "software-engineering": "Software Eng",
  "theoretical-cs": "Theoretical CS",
};

const STATUS_ORDER: TrackStatus[] = ["active", "paused", "completed"];

function groupByStatus(
  tracks: Track[],
): Record<TrackStatus, Track[]> {
  return {
    active: tracks.filter((t) => t.status === "active"),
    paused: tracks.filter((t) => t.status === "paused"),
    completed: tracks.filter((t) => t.status === "completed"),
  };
}

export default function TracksScreen() {
  const { data: tracks, isLoading, error } = useTracks();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base">
        <ActivityIndicator color="#FF6D00" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-surface-base px-10">
        <Text className="text-text-secondary text-body-md text-center">
          Couldn't load tracks. Pull down to retry.
        </Text>
      </View>
    );
  }

  const grouped = groupByStatus(tracks ?? []);

  return (
    <View className="flex-1 bg-surface-base">
      <ScrollView
        className="flex-1 px-5 pt-12"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-text-primary text-heading-lg">Tracks</Text>
          <TouchableOpacity
            onPress={() => router.push("/tracks/new")}
            className="bg-brand-500 rounded-pill px-6 py-3"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-body-sm">
              + New
            </Text>
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        {tracks && tracks.length === 0 && (
          <View className="items-center py-16">
            <Text className="text-text-muted text-body-md mb-2">
              No tracks yet
            </Text>
            <Text className="text-text-muted text-body-sm text-center">
              Create a track to start organizing{"\n"}your learning goals.
            </Text>
          </View>
        )}

        {/* Sections */}
        {STATUS_ORDER.map((status) => {
          const items = grouped[status];
          if (items.length === 0) return null;

          return (
            <View key={status} className="mb-8">
              {/* Section header */}
              <View className="flex-row items-center mb-4">
                <Text className="text-text-secondary text-overline uppercase">
                  {STATUS_LABELS[status]}
                </Text>
                <Text className="text-text-muted text-caption ml-2">
                  {items.length}
                </Text>
              </View>

              {/* Track cards */}
              {items.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  onPress={() => router.push(`/tracks/${track.id}`)}
                  className={`bg-glass-default rounded-xl border border-border-subtle p-5 mb-3 ${
                    track.status === "active"
                      ? "border-l-2 border-l-brand-500"
                      : ""
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-4">
                      <Text className="text-text-primary text-body-lg font-bold mb-2">
                        {track.name}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-accent-glow rounded-pill px-3 py-1">
                          <Text className="text-brand-400 text-caption uppercase">
                            {track.tag}
                          </Text>
                        </View>
                        {track.topic && (
                          <Text className="text-text-muted text-body-sm ml-3">
                            {TOPIC_LABELS[track.topic] ?? track.topic}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View>
                      <Text
                        className={`text-caption uppercase ${
                          track.status === "active"
                            ? "text-brand-400"
                            : "text-text-muted"
                        }`}
                      >
                        {STATUS_LABELS[track.status]}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
