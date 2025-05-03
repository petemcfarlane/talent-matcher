import { fetchJobs, fetchMembers } from "./api";
import { getLLMMatches } from "./llm";

console.log("Welcome to Talent Matcher!");
(async () => {
  const members = await fetchMembers();
  const jobs = await fetchJobs();
  const results = await getLLMMatches(members, jobs);

  console.dir(results, { depth: null });
})();
