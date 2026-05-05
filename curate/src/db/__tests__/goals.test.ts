import { createGoal, getGoal, getAllGoals, getActiveGoals, updateGoal, archiveGoal } from "../goals";

const mockRunAsync = jest.fn();
const mockGetFirstAsync = jest.fn();
const mockGetAllAsync = jest.fn();

const mockDb = {
  runAsync: mockRunAsync,
  getFirstAsync: mockGetFirstAsync,
  getAllAsync: mockGetAllAsync,
} as any;

jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

beforeEach(() => {
  jest.clearAllMocks();
  let callCount = 0;
  (require("expo-crypto").randomUUID as jest.Mock).mockImplementation(() => {
    callCount++;
    return `00000000-0000-4000-8000-${String(callCount).padStart(12, "0")}`;
  });
});

describe("goals CRUD", () => {
  describe("createGoal", () => {
    it("creates a shadow goal linked to a track", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const goal = await createGoal(mockDb, {
        title: "Practice problems",
        tag: "shadow",
        trackId: "track-1",
        isRecurring: true,
        frequencyTarget: 5,
      });

      expect(goal.trackId).toBe("track-1");
      expect(goal.isRecurring).toBe(true);
      expect(goal.frequencyTarget).toBe(5);
      expect(goal.status).toBe("active");
      expect(goal.archivedAt).toBeNull();

      const params = mockRunAsync.mock.calls[0][1];
      // is_recurring should be 1 (integer)
      expect(params[4]).toBe(1);
    });

    it("creates a non-shadow goal without track", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const goal = await createGoal(mockDb, {
        title: "Submit report",
        tag: "work",
        isRecurring: false,
      });

      expect(goal.trackId).toBeNull();
      expect(goal.isRecurring).toBe(false);
      expect(goal.frequencyTarget).toBe(1);
    });

    it("accepts optional reminderTime and scheduledEventId", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const goal = await createGoal(mockDb, {
        title: "Morning review",
        tag: "shadow",
        trackId: "track-1",
        isRecurring: true,
        frequencyTarget: 3,
        reminderTime: "08:00",
        scheduledEventId: "evt-123",
      });

      expect(goal.reminderTime).toBe("08:00");
      expect(goal.scheduledEventId).toBe("evt-123");
    });
  });

  describe("getGoal", () => {
    it("converts isRecurring from integer to boolean", async () => {
      mockGetFirstAsync.mockResolvedValueOnce({
        id: "goal-1",
        title: "Test",
        tag: "work",
        track_id: null,
        is_recurring: 1,
        frequency_target: 1,
        reminder_time: null,
        scheduled_event_id: null,
        status: "active",
        created_at: "2026-05-01T00:00:00.000Z",
        archived_at: null,
      });

      const goal = await getGoal(mockDb, "goal-1");

      expect(goal).not.toBeNull();
      expect(goal!.isRecurring).toBe(true);
    });

    it("returns null for missing goal", async () => {
      mockGetFirstAsync.mockResolvedValueOnce(null);
      const goal = await getGoal(mockDb, "nonexistent");
      expect(goal).toBeNull();
    });
  });

  describe("getActiveGoals", () => {
    it("filters to active status only", async () => {
      mockGetAllAsync.mockResolvedValueOnce([]);
      await getActiveGoals(mockDb);

      const sql = mockGetAllAsync.mock.calls[0][0];
      expect(sql).toContain("status = 'active'");
    });
  });

  describe("archiveGoal", () => {
    it("sets status to archived and fills archived_at", async () => {
      mockRunAsync.mockResolvedValueOnce({ changes: 1 });

      await archiveGoal(mockDb, "goal-1");

      const sql: string = mockRunAsync.mock.calls[0][0];
      const params: unknown[] = mockRunAsync.mock.calls[0][1];
      expect(sql).toContain("status = 'archived'");
      expect(sql).toContain("archived_at = ?");
      expect(params[params.length - 1]).toBe("goal-1");
    });
  });

  describe("updateGoal", () => {
    it("updates title and frequency", async () => {
      mockRunAsync.mockResolvedValueOnce({ changes: 1 });

      await updateGoal(mockDb, "goal-1", { title: "New title", frequencyTarget: 3 });

      const sql: string = mockRunAsync.mock.calls[0][0];
      expect(sql).toContain("title = ?");
      expect(sql).toContain("frequency_target = ?");
    });

    it("no-ops when no params provided", async () => {
      await updateGoal(mockDb, "goal-1", {});
      expect(mockRunAsync).not.toHaveBeenCalled();
    });
  });
});
