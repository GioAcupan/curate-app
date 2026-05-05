import { weekStart, weekEnd, isThisWeek } from "../week";

describe("weekStart", () => {
  it("returns Monday 00:00:00.000 local for a Wednesday", () => {
    // 2026-05-06 is a Wednesday
    const wednesday = new Date(2026, 4, 6, 14, 30, 0); // May = 4
    const result = weekStart(wednesday);
    // Expected Monday = 2026-05-04 00:00:00.000 local
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(4); // May
    expect(result.getDate()).toBe(4);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getDay()).toBe(1); // Monday
  });

  it("returns same day when given a Monday", () => {
    const monday = new Date(2026, 4, 4, 23, 59, 59); // Monday
    const result = weekStart(monday);
    expect(result.getDate()).toBe(4);
    expect(result.getHours()).toBe(0);
  });

  it("returns previous Monday when given a Sunday", () => {
    const sunday = new Date(2026, 4, 10); // Sunday
    const result = weekStart(sunday);
    expect(result.getDate()).toBe(4); // previous Monday
    expect(result.getDay()).toBe(1);
  });

  it("handles month boundary (Tuesday after Monday in previous month)", () => {
    // 2026-06-02 is Tuesday, Monday is 2026-06-01
    const tuesday = new Date(2026, 5, 2); // June
    const result = weekStart(tuesday);
    expect(result.getDate()).toBe(1);
    expect(result.getMonth()).toBe(5); // June
  });

  it("handles year boundary", () => {
    // 2027-01-01 is Friday, Monday is 2026-12-28
    const friday = new Date(2027, 0, 1);
    const result = weekStart(friday);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(11); // December
    expect(result.getDate()).toBe(28);
  });

  it("defaults to now when no argument", () => {
    const result = weekStart();
    expect(result.getDay()).toBe(1);
    expect(result.getHours()).toBe(0);
    expect(result.getTime()).toBeLessThanOrEqual(Date.now());
  });
});

describe("weekEnd", () => {
  it("returns Sunday 23:59:59.999 for a Wednesday", () => {
    const wednesday = new Date(2026, 4, 6);
    const result = weekEnd(wednesday);
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(999);
  });

  it("weekStart and weekEnd are 7 days apart (inclusive)", () => {
    const wednesday = new Date(2026, 4, 6);
    const start = weekStart(wednesday);
    const end = weekEnd(wednesday);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    // Monday 00:00 to Sunday 23:59:59.999 ≈ 6.999... days
    expect(diffDays).toBeCloseTo(6.999, 2);
  });
});

describe("isThisWeek", () => {
  it("returns true for a date within current week", () => {
    // Wed May 6 2026 as "now"; Wed May 6 at noon local is in the same week
    const now = new Date(2026, 4, 6, 12, 0, 0);
    const wednesdayStr = now.toISOString();
    expect(isThisWeek(wednesdayStr, now)).toBe(true);
  });

  it("returns false for a date before current week", () => {
    // Week is Mon May 4 – Sun May 10. April 30 is unambiguously before.
    const now = new Date(2026, 4, 6, 12, 0, 0);
    const lastWeekDate = new Date(2026, 3, 30, 12, 0, 0).toISOString();
    expect(isThisWeek(lastWeekDate, now)).toBe(false);
  });

  it("returns false for a date after current week", () => {
    const now = new Date(2026, 4, 6, 12, 0, 0);
    const nextWeekDate = new Date(2026, 4, 12, 12, 0, 0).toISOString();
    expect(isThisWeek(nextWeekDate, now)).toBe(false);
  });

  it("returns true for Monday 00:00:00.000 local", () => {
    // May 4 2026 is a Monday. Use a local-date-based construction.
    const now = new Date(2026, 4, 6, 12, 0, 0);
    const mondayStart = new Date(2026, 4, 4, 0, 0, 0).toISOString();
    expect(isThisWeek(mondayStart, now)).toBe(true);
  });

  it("returns true for Sunday 23:59:59.999 local", () => {
    const now = new Date(2026, 4, 6, 12, 0, 0);
    const sundayEnd = new Date(2026, 4, 10, 23, 59, 59, 999).toISOString();
    expect(isThisWeek(sundayEnd, now)).toBe(true);
  });
});
