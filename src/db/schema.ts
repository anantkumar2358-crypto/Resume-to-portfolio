import { pgTable, text, timestamp, jsonb, integer, boolean, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Users table - stores basic user information
export const users = pgTable('users', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: text('email'),
    githubUrl: text('github_url'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    location: text('location'),
    company: text('company'),
    twitterUsername: text('twitter_username'),
    websiteUrl: text('website_url'),
    publicRepos: integer('public_repos').default(0),
    followers: integer('followers').default(0),
    following: integer('following').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Resume data table - stores structured resume information
export const resumeData = pgTable('resume_data', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    resumeText: text('resume_text'),
    professionalSummary: text('professional_summary'),
    skills: jsonb('skills').$type<string[]>().default([]),
    experience: jsonb('experience').$type<Array<{
        role: string;
        company: string;
        date: string;
        description: string;
        location?: string;
    }>>().default([]),
    education: jsonb('education').$type<Array<{
        degree: string;
        institution: string;
        date: string;
        description?: string;
    }>>().default([]),
    certifications: jsonb('certifications').$type<string[]>().default([]),
    aboutMe: text('about_me'),
    interests: jsonb('interests').$type<Array<{
        icon: string;
        title: string;
        description: string;
    }>>().default([]),
    contactInfo: text('contact_info'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Coding stats table - stores LeetCode and Codeforces statistics
export const codingStats = pgTable('coding_stats', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    leetcodeUsername: varchar('leetcode_username', { length: 255 }),
    leetcodeStats: jsonb('leetcode_stats').$type<{
        totalSolved: number;
        easySolved: number;
        mediumSolved: number;
        hardSolved: number;
        ranking: number;
        acceptanceRate: number;
    }>(),
    codeforcesUsername: varchar('codeforces_username', { length: 255 }),
    codeforcesStats: jsonb('codeforces_stats').$type<{
        rating: number;
        maxRating: number;
        rank: string;
        maxRank: string;
        contribution: number;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table - stores GitHub repositories and featured projects
export const projects = pgTable('projects', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    htmlUrl: text('html_url'),
    homepageUrl: text('homepage_url'),
    language: varchar('language', { length: 100 }),
    topics: jsonb('topics').$type<string[]>().default([]),
    stars: integer('stars').default(0),
    forks: integer('forks').default(0),
    watchers: integer('watchers').default(0),
    isFeatured: boolean('is_featured').default(false),
    isPrivate: boolean('is_private').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// GitHub contributions table - stores contribution activity data
export const githubContributions = pgTable('github_contributions', {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    contributionData: jsonb('contribution_data').$type<Array<{
        days: Array<{
            date: string;
            count: number;
            level: number;
        }>;
    }>>(),
    totalContributions: integer('total_contributions').default(0),
    currentStreak: integer('current_streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ResumeData = typeof resumeData.$inferSelect;
export type NewResumeData = typeof resumeData.$inferInsert;
export type CodingStats = typeof codingStats.$inferSelect;
export type NewCodingStats = typeof codingStats.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type GithubContributions = typeof githubContributions.$inferSelect;
export type NewGithubContributions = typeof githubContributions.$inferInsert;
