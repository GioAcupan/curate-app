import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useTracks } from "../../src/hooks/useTracks";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { GlassHeader, GLASS_HEADER_HEIGHT } from "../../src/components/GlassHeader";
import { defaultGlass, webGlassStyle } from "../../src/lib/glass-styles";
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

/* ── Web glass styles ───────────────────────────── */
const WEB = Platform.OS === "web";

const glassCard: any = WEB
  ? {
      ...webGlassStyle(defaultGlass),
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
      transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    }
  : {
      backgroundColor: defaultGlass.tint,
      ...defaultGlass.border.native,
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
    };

const glassCardActiveExtra: any = WEB
  ? {
      borderColor: "rgba(255,109,0,0.25)",
      boxShadow:
        "0 0 20px -4px rgba(255,109,0,0.15), inset 0 0 20px -10px rgba(255,109,0,0.08)",
      borderLeftWidth: 3,
      borderLeftColor: "#FF6D00",
    }
  : { borderLeftWidth: 3, borderLeftColor: "#FF6D00" };

const glassEmpty: any = WEB
  ? {
      ...webGlassStyle(defaultGlass),
      borderRadius: 24,
      padding: 48,
      alignItems: "center",
    }
  : {
      backgroundColor: defaultGlass.tint,
      ...defaultGlass.border.native,
      borderRadius: 24,
      padding: 48,
      alignItems: "center",
    };

const btnNewStyle: any = WEB
  ? { boxShadow: "0 2px 10px -2px rgba(255,109,0,0.4)" }
  : {};

/* ── Component ──────────────────────────────────── */

export default function TracksScreen() {
  const { data: tracks, isLoading, error } = useTracks();

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF6D00" />
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-text-secondary text-body-md text-center">
            Couldn't load tracks. Pull down to retry.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const grouped = groupByStatus(tracks ?? []);

  return (
    <ScreenContainer>
      <GlassHeader
        title="Tracks"
        rightElement={
          <TouchableOpacity
            onPress={() => router.push("/tracks/new")}
            className="bg-brand-500 rounded-pill px-4 py-2"
            activeOpacity={0.8}
            style={btnNewStyle}
          >
            <Text className="text-white font-bold text-caption">
              + New
            </Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: GLASS_HEADER_HEIGHT }}
      >
        {/* Empty state */}
        {tracks && tracks.length === 0 && (
          <View style={glassEmpty}>
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
                <View
                  className="bg-accent-glow rounded-pill ml-2"
                  style={{ paddingHorizontal: 8, paddingVertical: 2 }}
                >
                  <Text className="text-brand-400 text-caption">
                    {items.length}
                  </Text>
                </View>
              </View>

              {/* Track cards */}
              {items.map((track) => (
                <TouchableOpacity
                  key={track.id}
                  onPress={() => router.push(`/tracks/${track.id}`)}
                  style={
                    track.status === "active"
                      ? { ...glassCard, ...glassCardActiveExtra }
                      : glassCard
                  }
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
    </ScreenContainer>
  );
}
