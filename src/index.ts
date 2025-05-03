import { fetchJobs, fetchMembers } from "./api";
import { getLLMMatches } from "./llm";

console.log("Welcome to Talent Matcher!");
console.log("Matching the latest jobs with the latest talent...");

export async function main() {
  const members = await fetchMembers();
  const jobs = await fetchJobs();
  const results = await getLLMMatches(members, jobs);

  console.dir(results, { depth: null });
}

if (require.main === module) {
  // Only run main if this file is executed directly (not imported)
  main();
}
