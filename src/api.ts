import { z } from "zod";

const JobSchema = z.object({
  title: z.string(),
  location: z.string(),
});

type Job = z.infer<typeof JobSchema>;

export async function fetchJobs(): Promise<Job[]> {
  const response = await fetch("https://bn-hiring-challenge.fly.dev/jobs.json");

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const parsed = z.array(JobSchema).safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Failed to parse jobs");
  }
  return parsed.data;
}

const MemberSchema = z.object({
  name: z.string(),
  bio: z.string(),
});

type Member = z.infer<typeof MemberSchema>;

export async function fetchMembers(): Promise<Member[]> {
  const response = await fetch(
    "https://bn-hiring-challenge.fly.dev/members.json"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch members");
  }

  const parsed = z.array(MemberSchema).safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Failed to parse members");
  }
  return parsed.data;
}
