const consoleDirSpy = jest.spyOn(console, "dir").mockImplementation(() => {});
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

import { main } from "./index";

jest.mock("./api", () => ({
  fetchMembers: jest
    .fn()
    .mockResolvedValue([{ name: "Alice", bio: "Engineer" }]),
  fetchJobs: jest
    .fn()
    .mockResolvedValue([{ title: "Backend Developer", location: "Remote" }]),
}));

jest.mock("./llm", () => ({
  getLLMMatches: jest.fn().mockResolvedValue({
    memberMatches: [
      {
        name: "Alice",
        bio: "Engineer",
        matches: [
          {
            title: "Backend Developer",
            location: "Remote",
            reason: "Relevant skills",
          },
        ],
      },
    ],
  }),
}));

describe("index.ts integration", () => {
  it("calls fetchMembers, fetchJobs, and getLLMMatches and logs the result", async () => {
    await main();
    expect(require("./api").fetchMembers).toHaveBeenCalled();
    expect(require("./api").fetchJobs).toHaveBeenCalled();
    expect(require("./llm").getLLMMatches).toHaveBeenCalledWith(
      [{ name: "Alice", bio: "Engineer" }],
      [{ title: "Backend Developer", location: "Remote" }]
    );
    expect(consoleDirSpy).toHaveBeenCalledWith(
      {
        memberMatches: [
          {
            name: "Alice",
            bio: "Engineer",
            matches: [
              {
                title: "Backend Developer",
                location: "Remote",
                reason: "Relevant skills",
              },
            ],
          },
        ],
      },
      { depth: null }
    );
    consoleDirSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });
});
