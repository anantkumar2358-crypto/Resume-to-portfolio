import { db } from '@/db';
import { users, resumeData, codingStats, projects, githubContributions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

    return user || null;
}

/**
 * Get complete portfolio data for a user
 */
export async function getPortfolioData(username: string) {
    const user = await getUserByUsername(username);

    if (!user) {
        return null;
    }

    // Fetch all related data in parallel
    const [resume, coding, userProjects, contributions] = await Promise.all([
        db.select().from(resumeData).where(eq(resumeData.userId, user.id)).limit(1),
        db.select().from(codingStats).where(eq(codingStats.userId, user.id)).limit(1),
        db.select().from(projects).where(eq(projects.userId, user.id)),
        db.select().from(githubContributions).where(eq(githubContributions.userId, user.id)).limit(1),
    ]);

    return {
        user,
        resumeData: resume[0] || null,
        codingStats: coding[0] || null,
        projects: userProjects,
        contributions: contributions[0] || null,
    };
}

/**
 * Create or update user
 */
export async function upsertUser(data: {
    username: string;
    email?: string;
    githubUrl?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    company?: string;
    twitterUsername?: string;
    websiteUrl?: string;
    publicRepos?: number;
    followers?: number;
    following?: number;
}) {
    const [user] = await db
        .insert(users)
        .values(data)
        .onConflictDoUpdate({
            target: users.username,
            set: {
                ...data,
                updatedAt: new Date(),
            },
        })
        .returning();

    return user;
}

/**
 * Create or update resume data
 */
export async function upsertResumeData(userId: string, data: {
    resumeText?: string;
    professionalSummary?: string;
    skills?: string[];
    experience?: any[];
    education?: any[];
    certifications?: string[];
    aboutMe?: string;
    interests?: any[];
    contactInfo?: string;
}) {
    const [resume] = await db
        .insert(resumeData)
        .values({
            id: createId(),
            userId,
            ...data,
            // Safety defaults to prevent "NOT NULL" errors if DB schema forbids nulls
            professionalSummary: data.professionalSummary ?? "",
            aboutMe: data.aboutMe ?? "",
            contactInfo: data.contactInfo ?? "",
            skills: data.skills ?? [],
            experience: data.experience ?? [],
            education: data.education ?? [],
            certifications: data.certifications ?? [],
            interests: data.interests ?? [],
        })
        .onConflictDoUpdate({
            target: resumeData.userId,
            set: {
                ...data,
                // Update checks as well
                professionalSummary: data.professionalSummary ?? "",
                aboutMe: data.aboutMe ?? "",
                contactInfo: data.contactInfo ?? "",
                skills: data.skills ?? [],
                experience: data.experience ?? [],
                education: data.education ?? [],
                certifications: data.certifications ?? [],
                interests: data.interests ?? [],
                updatedAt: new Date(),
            },
        })
        .returning();

    return resume;
}

/**
 * Create or update coding stats
 */
export async function upsertCodingStats(userId: string, data: {
    leetcodeUsername?: string | null;
    leetcodeStats?: any;
    codeforcesUsername?: string | null;
    codeforcesStats?: any;
}) {
    const [stats] = await db
        .insert(codingStats)
        .values({
            userId,
            ...data,
        })
        .onConflictDoUpdate({
            target: codingStats.userId,
            set: {
                ...data,
                updatedAt: new Date(),
            },
        })
        .returning();

    return stats;
}

/**
 * Bulk insert or update projects
 */
export async function upsertProjects(userId: string, projectsData: Array<{
    name: string;
    description?: string;
    htmlUrl?: string;
    homepageUrl?: string;
    language?: string;
    topics?: string[];
    stars?: number;
    forks?: number;
    watchers?: number;
    isFeatured?: boolean;
    isPrivate?: boolean;
}>) {
    // Delete existing projects for this user
    await db.delete(projects).where(eq(projects.userId, userId));

    // Insert new projects
    if (projectsData.length > 0) {
        return await db
            .insert(projects)
            .values(
                projectsData.map(project => ({
                    userId,
                    ...project,
                }))
            )
            .returning();
    }

    return [];
}

/**
 * Create or update GitHub contributions
 */
export async function upsertGithubContributions(userId: string, data: {
    contributionData?: any;
    totalContributions?: number;
    currentStreak?: number;
    longestStreak?: number;
}) {
    const [contribution] = await db
        .insert(githubContributions)
        .values({
            userId,
            ...data,
        })
        .onConflictDoUpdate({
            target: githubContributions.userId,
            set: {
                ...data,
                updatedAt: new Date(),
            },
        })
        .returning();

    return contribution;
}

/**
 * Get featured projects for a user
 */
export async function getFeaturedProjects(username: string) {
    const user = await getUserByUsername(username);

    if (!user) {
        return [];
    }

    return await db
        .select()
        .from(projects)
        .where(eq(projects.userId, user.id))
        .orderBy(projects.stars);
}
