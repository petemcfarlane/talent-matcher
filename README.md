# Talent Matcher

## Challenge
> Implement a very simple recommendations algorithm to match members to their perfect job.
The code needs to fetch the required data from the following APIs:
- https://bn-hiring-challenge.fly.dev/members.json
- https://bn-hiring-challenge.fly.dev/jobs.json

> For each member, please print their name and their recommended job(s).

## How to run

Copy the OpenAI API key into a .env file in the root of the project, e.g.  run `cp .env.example .env` and add your OpenAI API key.

Then run `npm run build & npm run start`, to build and run the app, or `npm run dev` to run the app in development mode.

You should see the output similar to below:
```
> node dist/index.js

Welcome to Talent Matcher!
{
  memberMatches: [
    {
      name: 'Joe',
      bio: "I'm a designer from London, UK",
      matches: [
        {
          title: 'UX Designer',
          location: 'London',
          reason: 'Relevant design role in London'
        }
      ]
    },
    {
      name: 'Marta',
      bio: "I'm looking for an internship in London",
      matches: [
        {
          title: 'Legal Internship',
          location: 'London',
          reason: 'Internship in London'
        },
        {
          title: 'Sales Internship',
          location: 'London',
          reason: 'Internship in London'
        }
      ]
    },
    {
      name: 'Hassan',
      bio: "I'm looking for a design job",
      matches: [
        {
          title: 'UX Designer',
          location: 'London',
          reason: 'Relevant design role'
        }
      ]
    },
    {
      name: 'Grace',
      bio: "I'm looking for a job in marketing outside of London",
      matches: [
        {
          title: 'Marketing Internship',
          location: 'York',
          reason: 'Marketing role outside of London'
        }
      ]
    },
    {
      name: 'Daisy',
      bio: "I'm a software developer currently in Edinburgh but looking to relocate to London",
      matches: [
        {
          title: 'Software Developer',
          location: 'London',
          reason: 'Software development role in desired relocation city'
        }
      ]
    }
  ]
}
```

You can also run `npm run test` to run the test suit.

Note - the instructions didn't specify exactly how the output should be printed so right now we just get a raw JSON format as above.

## My approach:
Fetching the data from the API is bread-and-butter, so I started with the matching algorithm. I thought of three different options:

1. Simple keyword matching: picking up key words like "designer", "London", but this could lead to false positives, e.g. "outside of London" or "anywhere but London" would still match on "London".
(too simplistic, not very accurate)

2. NLP using library e.g. [compromise](https://www.npmjs.com/package/compromise), to parse the members bio into a set of keywords and locations, to then generate logic to match against the job descriptions.
(worth a prototype)

3. Use an AI prompt to generate logic to match the members against the job descriptions.
(This should work well, worth a prototype, but would require an openai api key, so might be harder to demo.)

I spent a bit of time on option 2 first - I could detect locations fairly well using the `compromise` library. I was then going to filter out available jobs matching the title, then score the remaining jobs on location, then rank according ot score. But I was still picking up too many false positives for negative phrases, e.g. "outside of London", or "relocating to Edinburgh". Also by allowing plain text job titles can be a bit diverse, e.g. "UX Designer" vs just "Designer" or a "design job"

I settled on option 3, using an AI prompt to generate logic to match the members against the job descriptions. I chose the OpenAI API client as it is easy to request structured responses (and hopefully the reviewer may have an OpenAI API key they can use for testing!?)


## Fetch jobs/members from API

- Fetching the jobs was fairly straightforward. I just used the native Node `fetch` implementation to avoid another dependency. I then used `zod` to attempt to parse the response into a known format.
To improve the functionality further we could consider adding caching for performance, e.g. storing the data to a database table.

## Todo: future improvements

- Some database caching - for example we could just check for new jobs or new members that have been added.
- Some batching will probably be necessary so we don't send too large a payload to the LLM.
- Could make it event based, rather than API, so it's more reactive to events as we add new jobs or members post their bios.
- Adding retry logic/queuing for the API and LLM calls, for better resilience to transient network errors.
- If we wanted to avoid the LLM we could revisit the keyword approach, and instead of free text we could use select options, or a known list of keywords for jobs, and potentially ask for a postcode & radius to filter jobs by location.
