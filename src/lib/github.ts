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
