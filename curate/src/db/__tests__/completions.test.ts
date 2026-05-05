import {
  createCompletion,
  getCompletionsForGoal,
  getCompletionsInRange,
  getCompletionCountSince,
} from "../completions";

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

describe("completions CRUD", () => {
  describe("createCompletion", () => {
    it("inserts a completion and returns it", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const completion = await createCompletion(mockDb, {
        goalId: "goal-1",
        description: "Did the thing thoroughly",
      });

      expect(completion.id).toBeTruthy();
      expect(completion.goalId).toBe("goal-1");
      expect(completion.description).toBe("Did the thing thoroughly");
      expect(completion.completedAt).toBeTruthy();

      const params = mockRunAsync.mock.calls[0][1];
      expect(params[1]).toBe("goal-1");
      expect(params[3]).toBe("Did the thing thoroughly");
    });
  });

  describe("getCompletionsForGoal", () => {
    it("fetches completions for a specific goal", async () => {
      mockGetAllAsync.mockResolvedValueOnce([
        { id: "c1", goal_id: "goal-1", completed_at: "", description: "First" },
        { id: "c2", goal_id: "goal-1", completed_at: "", description: "Second" },
      ]);

      const completions = await getCompletionsForGoal(mockDb, "goal-1");

      expect(completions).toHaveLength(2);
      const sql = mockGetAllAsync.mock.calls[0][0];
      expect(sql).toContain("WHERE goal_id = ?");
      const params = mockGetAllAsync.mock.calls[0][1];
      expect(params[0]).toBe("goal-1");
    });
  });

  describe("getCompletionsInRange", () => {
    it("fetches completions within a date range", async () => {
      mockGetAllAsync.mockResolvedValueOnce([]);

      await getCompletionsInRange(
        mockDb,
        "2026-05-01T00:00:00.000Z",
        "2026-05-07T23:59:59.999Z",
      );

      const sql = mockGetAllAsync.mock.calls[0][0];
      expect(sql).toContain("completed_at >= ?");
      expect(sql).toContain("completed_at <= ?");
      const params = mockGetAllAsync.mock.calls[0][1];
      expect(params[0]).toBe("2026-05-01T00:00:00.000Z");
      expect(params[1]).toBe("2026-05-07T23:59:59.999Z");
    });
  });

  describe("getCompletionCountSince", () => {
    it("returns the count from SQL", async () => {
      mockGetFirstAsync.mockResolvedValueOnce({ count: 5 });

      const count = await getCompletionCountSince(mockDb, "2026-04-28T00:00:00.000Z");

      expect(count).toBe(5);
      const sql = mockGetFirstAsync.mock.calls[0][0];
      expect(sql).toContain("COUNT(*)");
    });

    it("returns 0 when no rows match", async () => {
      mockGetFirstAsync.mockResolvedValueOnce(null);

      const count = await getCompletionCountSince(mockDb, "2026-04-28T00:00:00.000Z");

      expect(count).toBe(0);
    });
  });
});
