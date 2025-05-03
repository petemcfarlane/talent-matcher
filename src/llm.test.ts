// Dynamic mock implementation holder
let openAIMockImplementation: any;

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => openAIMockImplementation);
});

jest.mock('openai/helpers/zod', () => ({
  zodTextFormat: jest.fn(),
}));

const mockResponse = {
  output_parsed: {
    memberMatches: [
      {
        name: "Alice",
        bio: "Engineer",
        matches: [
          {
            title: "Backend Developer",
            location: "Remote",
            reason: "Relevant to engineering skills",
          },
        ],
      },
    ],
  },
};

describe('getLLMMatches', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('returns parsed matches from the mocked OpenAI API', async () => {
    openAIMockImplementation = {
      responses: {
        parse: jest.fn().mockResolvedValue(mockResponse),
      },
    };
    jest.resetModules();
    const { getLLMMatches } = await import('./llm');
    const members = [{ name: "Alice", bio: "Engineer" }];
    const jobs = [
      { title: "Backend Developer", location: "Remote" },
      { title: "Frontend Developer", location: "London" },
    ];
    const result = await getLLMMatches(members, jobs);
    expect(result).toEqual(mockResponse.output_parsed);
  });

  it('throws an error if the OpenAI API response does not match the expected schema', async () => {
    openAIMockImplementation = {
      responses: {
        parse: jest.fn().mockResolvedValue({ output_parsed: { wrong: "format" } }),
      },
    };
    jest.resetModules();
    const { getLLMMatches } = await import('./llm');
    const members = [{ name: "Alice", bio: "Engineer" }];
    const jobs = [
      { title: "Backend Developer", location: "Remote" },
      { title: "Frontend Developer", location: "London" },
    ];
    await expect(getLLMMatches(members, jobs)).rejects.toThrow("Failed to parse response");
  });
});
