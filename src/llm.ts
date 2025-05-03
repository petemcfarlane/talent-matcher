import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

// Set up OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JobMatch = z.object({
  title: z.string(),
  location: z.string(),
  reason: z.string(),
});

const MemberMatches = z.object({
  name: z.string(),
  bio: z.string(),
  matches: z.array(JobMatch),
});
const MemberMatchesArray = z.object({
  memberMatches: z.array(MemberMatches),
});

export async function getLLMMatches(
  members: { name: string; bio: string }[],
  jobs: { title: string; location: string }[]
) {
  // Build a single prompt for all members
  const jobList = jobs
    .map((job, i) => `${i + 1}. ${job.title}, ${job.location}`)
    .join("\n");
  const membersList = members
    .map((m, i) => `${i + 1}. ${m.name}: ${m.bio}`)
    .join("\n");
  const prompt = `Here is a list of members and their bios:\n${membersList}\n\nHere is a list of jobs:\n${jobList}\n\nFor each member, return a JSON object with their name and an array of the best matching jobs for that member, using the following format:\n[\n  { \"name\": \"...\", \"bio\": \"...\", \"matches\": [ { \"title\": \"...\", \"location\": \"...\", \"reason\": \"...\" } ] }\n]\nOnly include jobs that are a good match. Do not include any explanation outside of the JSON array.`;

  const response = await openai.responses.parse({
    model: "gpt-4o-2024-08-06",
    input: [
      {
        role: "system",
        content:
          "Extract the best matching jobs for each member, as described.",
      },
      { role: "user", content: prompt },
    ],
    text: {
      format: zodTextFormat(MemberMatchesArray, "memberMatches"),
    },
  });

  // Validate the parsed response using Zod
  const parsed = MemberMatchesArray.safeParse(response.output_parsed);
  if (!parsed.success) {
    throw new Error("Failed to parse response: " + parsed.error);
  }

  return parsed.data;
}
