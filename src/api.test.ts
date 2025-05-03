import { fetchJobs, fetchMembers } from "./api";
import { z } from "zod";

global.fetch = jest.fn();

describe("api module", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockReset();
  });

  it("fetchJobs returns valid jobs", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { title: "Engineer", location: "Remote" },
        { title: "Designer", location: "NYC" },
      ],
    });
    const jobs = await fetchJobs();
    expect(Array.isArray(jobs)).toBe(true);
    expect(jobs.length).toBe(2);
    expect(jobs[0]).toEqual({ title: "Engineer", location: "Remote" });
    expect(jobs[1]).toEqual({ title: "Designer", location: "NYC" });
  });

  it("fetchMembers returns valid members", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { name: "Alice", bio: "Frontend dev" },
        { name: "Bob", bio: "Backend dev" },
      ],
    });
    const members = await fetchMembers();
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBe(2);
    expect(members[0]).toEqual({ name: "Alice", bio: "Frontend dev" });
    expect(members[1]).toEqual({ name: "Bob", bio: "Backend dev" });
  });

  it("fetchJobs throws on network error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchJobs()).rejects.toThrow("Failed to fetch jobs");
  });

  it("fetchMembers throws on network error", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    await expect(fetchMembers()).rejects.toThrow("Failed to fetch members");
  });

  it("fetchJobs throws on invalid data", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ notTitle: "foo" }],
    });
    await expect(fetchJobs()).rejects.toThrow("Failed to parse jobs");
  });

  it("fetchMembers throws on invalid data", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [{ notName: "foo" }],
    });
    await expect(fetchMembers()).rejects.toThrow("Failed to parse members");
  });
});
