import { useState } from "react";
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
import { router } from "expo-router";
import { useCreateTrack } from "../../src/hooks/useTracks";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import type { Tag, Topic } from "../../src/types";

const TAGS: { value: Tag; label: string }[] = [
  { value: "shadow", label: "Shadow" },
  { value: "academic", label: "Academic" },
  { value: "extracurricular", label: "Extracurr." },
  { value: "work", label: "Work" },
];

const TOPICS: { value: Topic; label: string }[] = [
  { value: "math", label: "Math" },
  { value: "software-engineering", label: "Software Eng" },
  { value: "theoretical-cs", label: "Theoretical CS" },
];

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

const chipBase: any = WEB
  ? {
      borderRadius: 100,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderWidth: 1,
      transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  : { borderRadius: 100, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 };

export default function NewTrackScreen() {
  const [name, setName] = useState("");
  const [tag, setTag] = useState<Tag>("shadow");
  const [topic, setTopic] = useState<Topic | null>(null);
  const createTrack = useCreateTrack();

  const canSave = name.trim().length > 0 && (tag !== "shadow" || topic !== null);

  async function handleSave() {
    if (!canSave || createTrack.isPending) return;
    try {
      await createTrack.mutateAsync({
        name: name.trim(),
        tag,
        topic,
        status: "active",
      });
      router.back();
    } catch {
      // mutation error — stay on form so user can retry
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
          <View className="flex-row items-center justify-between mb-10">
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text className="text-text-secondary text-body-md">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-text-primary text-heading-sm">New Track</Text>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!canSave || createTrack.isPending}
              activeOpacity={0.8}
            >
              {createTrack.isPending ? (
                <ActivityIndicator color="#FF6D00" size="small" />
              ) : (
                <Text
                  className={`text-body-md font-bold ${
                    canSave ? "text-brand-500" : "text-text-muted"
                  }`}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-text-secondary text-overline uppercase mb-3">
            Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Linear Algebra mastery"
            placeholderTextColor="rgba(240,239,244,0.35)"
            style={inputStyle}
            autoFocus
            returnKeyType="done"
          />
          <View className="mb-8" />

          {/* Tag */}
          <Text className="text-text-secondary text-overline uppercase mb-3">
            Tag
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-8">
            {TAGS.map((t) => {
              const selected = tag === t.value;
              return (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => {
                    setTag(t.value);
                    if (t.value !== "shadow") setTopic(null);
                  }}
                  style={{
                    ...chipBase,
                    backgroundColor: selected
                      ? "#FF6D00"
                      : "rgba(255,255,255,0.08)",
                    borderColor: selected
                      ? "#FF6D00"
                      : "rgba(255,255,255,0.1)",
                    ...(WEB && selected
                      ? { boxShadow: "0 2px 10px -2px rgba(255,109,0,0.4)" }
                      : {}),
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-body-sm font-semibold ${
                      selected ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Topic (shadow only) */}
          {tag === "shadow" && (
            <>
              <Text className="text-text-secondary text-overline uppercase mb-3">
                Topic
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-8">
                {TOPICS.map((t) => {
                  const selected = topic === t.value;
                  return (
                    <TouchableOpacity
                      key={t.value}
                      onPress={() => setTopic(t.value)}
                      style={{
                        ...chipBase,
                        backgroundColor: selected
                          ? "#FF6D00"
                          : "rgba(255,255,255,0.08)",
                        borderColor: selected
                          ? "#FF6D00"
                          : "rgba(255,255,255,0.1)",
                        ...(WEB && selected
                          ? { boxShadow: "0 2px 10px -2px rgba(255,109,0,0.4)" }
                          : {}),
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-body-sm font-semibold ${
                          selected ? "text-white" : "text-text-secondary"
                        }`}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Validation hints */}
          {name.trim().length === 0 && name.length > 0 && (
            <Text className="text-text-muted text-body-sm mb-4">
              Name is required.
            </Text>
          )}
          {tag === "shadow" && topic === null && (
            <Text className="text-text-muted text-body-sm mb-4">
              Select a topic for this shadow track.
            </Text>
          )}

          {/* Save error */}
          {createTrack.isError && (
            <Text className="text-text-secondary text-body-sm mb-4">
              Something went wrong. Tap Save to retry.
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
