import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDb } from "../db/client";
import { createTrack, getAllTracks, getTrack, updateTrack } from "../db/tracks";
import type { Track } from "../types";

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: async (): Promise<Track[]> => {
      const db = await getDb();
      return getAllTracks(db);
    },
    staleTime: 30_000,
  });
}

export function useTrack(id: string | undefined) {
  return useQuery({
    queryKey: ["tracks", id],
    queryFn: async (): Promise<Track | null> => {
      if (!id) return null;
      const db = await getDb();
      return getTrack(db, id);
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      tag: string;
      topic?: string | null;
      status?: string;
    }) => {
      const db = await getDb();
      return createTrack(db, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
    },
  });
}

export function useUpdateTrack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...params
    }: {
      id: string;
      name?: string;
      tag?: string;
      topic?: string | null;
      status?: string;
    }) => {
      const db = await getDb();
      await updateTrack(db, id, params);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tracks"] });
      queryClient.invalidateQueries({ queryKey: ["tracks", variables.id] });
    },
  });
}
