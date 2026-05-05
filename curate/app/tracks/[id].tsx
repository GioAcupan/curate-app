import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTrack, useUpdateTrack } from "../../src/hooks/useTracks";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import type { TrackStatus } from "../../src/types";

const STATUS_OPTIONS: TrackStatus[] = ["active", "paused", "completed"];

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

/* ── Web glass styles ───────────────────────────── */
const WEB = Platform.OS === "web";

const inputStyle: any = WEB
  ? {
      backgroundColor: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderRadius: 100,
      paddingHorizontal: 24,
      paddingVertical: 16,
      color: "#F0EFF4",
      fontSize: 16,
      outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
    }
  : {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      borderRadius: 100,
      paddingHorizontal: 24,
      paddingVertical: 16,
      color: "#F0EFF4",
      fontSize: 16,
    };

const segmentedContainer: any = WEB
  ? {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      borderRadius: 100,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      padding: 4,
    }
  : {
      flexDirection: "row",
      backgroundColor: "rgba(255,255,255,0.08)",
      borderRadius: 100,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
      padding: 4,
    };

export default function TrackDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: track, isLoading, error } = useTrack(id);
  const updateTrack = useUpdateTrack();

  const [name, setName] = useState("");

  useEffect(() => {
    if (track) setName(track.name);
  }, [track?.id]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF6D00" />
        </View>
      </ScreenContainer>
    );
  }

  if (error || !track) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-text-secondary text-body-md text-center mb-4">
            Track not found.
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-brand-500 text-body-md font-bold">
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  async function handleStatusChange(status: TrackStatus) {
    if (status === track!.status || !id) return;
    try {
      await updateTrack.mutateAsync({ id, status });
    } catch {
      // mutation failed — leave UI as-is
    }
  }

  async function handleNameBlur() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === track!.name || !id) return;
    try {
      await updateTrack.mutateAsync({ id, name: trimmed });
    } catch {
      setName(track!.name);
    }
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-5 pt-12"
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center mb-10">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.7}
              className="mr-4"
            >
              <Text className="text-text-secondary text-body-md">Back</Text>
            </TouchableOpacity>
            <Text className="text-text-primary text-heading-sm flex-1">
              Track
            </Text>
          </View>

          {/* Name */}
          <Text className="text-text-secondary text-overline uppercase mb-3">
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={handleNameBlur}
            placeholder="Track name"
            placeholderTextColor="rgba(240,239,244,0.35)"
            style={inputStyle}
            returnKeyType="done"
          />
          <View className="mb-8" />

          {/* Tag + Topic (read-only summary) */}
          <View className="flex-row items-center mb-8">
            <View className="bg-accent-glow rounded-pill px-4 py-2">
              <Text className="text-brand-400 text-caption uppercase">
                {track.tag}
              </Text>
            </View>
            {track.topic && (
              <Text className="text-text-secondary text-body-sm ml-3">
                {TOPIC_LABELS[track.topic] ?? track.topic}
              </Text>
            )}
          </View>

          {/* Status segmented control */}
          <Text className="text-text-secondary text-overline uppercase mb-3">
            Status
          </Text>
          <View style={segmentedContainer}>
            {STATUS_OPTIONS.map((status) => {
              const isCurrent = track.status === status;
              const isPending =
                updateTrack.isPending &&
                updateTrack.variables?.id === id &&
                updateTrack.variables?.status === status;

              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  disabled={isCurrent || isPending}
                  style={{
                    flex: 1,
                    borderRadius: 100,
                    paddingVertical: 12,
                    alignItems: "center",
                    backgroundColor: isCurrent ? "#FF6D00" : "transparent",
                    ...(WEB && isCurrent
                      ? { boxShadow: "0 2px 10px -2px rgba(255,109,0,0.4)" }
                      : {}),
                  } as any}
                  activeOpacity={0.7}
                >
                  {isPending ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text
                      className={`text-body-sm font-semibold ${
                        isCurrent ? "text-white" : "text-text-secondary"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View className="mb-8" />

          {/* Update error */}
          {updateTrack.isError && (
            <Text className="text-text-secondary text-body-sm mb-4">
              Couldn't save changes. Pull down to retry.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
