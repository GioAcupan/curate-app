import { createTrack, getTrack, getAllTracks, updateTrack } from "../tracks";

const mockRunAsync = jest.fn();
const mockGetFirstAsync = jest.fn();
const mockGetAllAsync = jest.fn();
const mockExecAsync = jest.fn();
const mockCloseAsync = jest.fn();

const mockDb = {
  runAsync: mockRunAsync,
  getFirstAsync: mockGetFirstAsync,
  getAllAsync: mockGetAllAsync,
  execAsync: mockExecAsync,
  closeAsync: mockCloseAsync,
} as any;

// Mock expo-crypto to return deterministic UUIDs
jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "00000000-0000-4000-8000-000000000001"),
}));

beforeEach(() => {
  jest.clearAllMocks();
  // Reset the UUID counter
  let callCount = 0;
  (require("expo-crypto").randomUUID as jest.Mock).mockImplementation(() => {
    callCount++;
    return `00000000-0000-4000-8000-${String(callCount).padStart(12, "0")}`;
  });
});

describe("tracks CRUD", () => {
  describe("createTrack", () => {
    it("inserts a track and returns the created row", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const track = await createTrack(mockDb, {
        name: "Linear Algebra",
        tag: "shadow",
        topic: "math",
      });

      expect(mockRunAsync).toHaveBeenCalledTimes(1);
      const sql = mockRunAsync.mock.calls[0][0];
      expect(sql).toContain("INSERT INTO track");
      expect(track.name).toBe("Linear Algebra");
      expect(track.tag).toBe("shadow");
      expect(track.topic).toBe("math");
      expect(track.status).toBe("active");
      expect(track.id).toBeTruthy();
      expect(track.createdAt).toBeTruthy();
      expect(track.updatedAt).toBeTruthy();
    });

    it("sets topic to null for non-shadow tracks", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const track = await createTrack(mockDb, { name: "Work Track", tag: "work" });

      expect(track.topic).toBeNull();
      const params = mockRunAsync.mock.calls[0][1];
      expect(params[3]).toBeNull(); // topic param
    });

    it("defaults status to active", async () => {
      mockRunAsync.mockResolvedValueOnce({ lastInsertRowId: 1, changes: 1 });

      const track = await createTrack(mockDb, { name: "Default Status", tag: "academic" });

      expect(track.status).toBe("active");
    });
  });

  describe("getTrack", () => {
    it("returns a track when found", async () => {
      mockGetFirstAsync.mockResolvedValueOnce({
        id: "track-1",
        name: "Math",
        tag: "shadow",
        topic: "math",
        status: "active",
        created_at: "2026-05-01T00:00:00.000Z",
        updated_at: "2026-05-01T00:00:00.000Z",
      } as any);

      const track = await getTrack(mockDb, "track-1");

      expect(track).not.toBeNull();
      expect(track!.name).toBe("Math");
      expect(mockGetFirstAsync).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM track WHERE id = ?"),
        ["track-1"],
      );
    });

    it("returns null when not found", async () => {
      mockGetFirstAsync.mockResolvedValueOnce(null);

      const track = await getTrack(mockDb, "nonexistent");

      expect(track).toBeNull();
    });
  });

  describe("getAllTracks", () => {
    it("returns all tracks ordered by created_at DESC", async () => {
      mockGetAllAsync.mockResolvedValueOnce([
        { id: "2", name: "B", tag: "academic", topic: null, status: "active", created_at: "", updated_at: "" },
        { id: "1", name: "A", tag: "shadow", topic: "math", status: "active", created_at: "", updated_at: "" },
      ]);

      const tracks = await getAllTracks(mockDb);

      expect(tracks).toHaveLength(2);
      expect(tracks[0].name).toBe("B");
      expect(mockGetAllAsync).toHaveBeenCalledWith(
        expect.stringContaining("ORDER BY created_at DESC"),
      );
    });
  });

  describe("updateTrack", () => {
    it("updates name and status", async () => {
      mockRunAsync.mockResolvedValueOnce({ changes: 1 });

      await updateTrack(mockDb, "track-1", { name: "Updated", status: "paused" });

      const sql: string = mockRunAsync.mock.calls[0][0];
      const params: unknown[] = mockRunAsync.mock.calls[0][1];
      expect(sql).toContain("UPDATE track SET");
      expect(sql).toContain("name = ?");
      expect(sql).toContain("status = ?");
      expect(params).toContain("Updated");
      expect(params).toContain("paused");
      expect(params[params.length - 1]).toBe("track-1"); // last param is id
    });

    it("sets topic to NULL when tag changes to non-shadow", async () => {
      mockRunAsync.mockResolvedValueOnce({ changes: 1 });

      await updateTrack(mockDb, "track-1", { tag: "work" });

      const sql: string = mockRunAsync.mock.calls[0][0];
      expect(sql).toContain("topic = NULL");
    });
  });
});
