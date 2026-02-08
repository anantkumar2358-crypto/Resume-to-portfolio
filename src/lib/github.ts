import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubProfile {
  username: string;
  name: string;
  avatar_url: string;
  bio: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  email: string | null;
  blog: string | null;
  company: string | null;
  location: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile | null> {
  try {
    const { data } = await octokit.rest.users.getByUsername({
      username,
    });

    return {
      username: data.login,
      name: data.name || data.login,
      avatar_url: data.avatar_url,
      bio: data.bio || "",
      html_url: data.html_url,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      email: data.email,
      blog: data.blog,
      company: data.company,
      location: data.location,
    };
  } catch (error: any) {
    console.error("Error fetching GitHub profile:", error);
    if (error.status === 403 || error.status === 429) {
      console.error("GitHub API Rate Limit Exceeded. Please add a GITHUB_TOKEN to your .env.local file.");
    }
    return null;
  }
}

export async function getGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      sort: "updated",
      per_page: 6, // Top 6 most recently updated repos
      type: "owner",
    });

    return data.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "",
      html_url: repo.html_url,
      language: repo.language || "Unknown",
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at,
      topics: repo.topics || [],
    }));
  } catch (error: any) {
    console.error("Error fetching GitHub repos:", error);
    if (error.status === 403 || error.status === 429) {
      console.error("GitHub API Rate Limit Likely Exceeded.");
    }
    return [];
  }
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number; // 0-4 intensity level
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export async function getGitHubContributions(username: string): Promise<ContributionWeek[] | null> {
  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const response: any = await octokit.graphql(query, { username });

    const weeks = response.user.contributionsCollection.contributionCalendar.weeks;

    return weeks.map((week: any) => ({
      days: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'].indexOf(day.contributionLevel)
      }))
    }));
  } catch (error: any) {
    console.error("Error fetching GitHub contributions:", error);
    if (error.status === 403 || error.status === 429) {
      console.error("GitHub API Rate Limit Exceeded. Contributions graph will not be displayed.");
    }
    return null;
  }
}

export async function getRepoReadme(username: string, repo: string): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner: username,
      repo,
      mediaType: {
        format: "raw"
      }
    });
    return data as any as string;
  } catch (error: any) {
    console.error("Error fetching README:", error);
    return null;
  }
}

export async function getRepoFileTree(username: string, repo: string): Promise<string[]> {
  try {
    const { data } = await octokit.rest.git.getTree({
      owner: username,
      repo,
      tree_sha: "main",
      recursive: "1",
    });

    return data.tree
      .filter((item: any) => item.type === "blob")
      .map((item: any) => item.path)
      .slice(0, 50);
  } catch (error: any) {
    if (error.status === 404) {
      try {
        const { data } = await octokit.rest.git.getTree({
          owner: username,
          repo,
          tree_sha: "master",
          recursive: "1",
        });
        return data.tree
          .filter((item: any) => item.type === "blob")
          .map((item: any) => item.path)
          .slice(0, 50);
      } catch (e) {
        console.error("Error fetching file tree (master):", e);
        return [];
      }
    }
    console.error("Error fetching file tree:", error);
    return [];
  }
}

