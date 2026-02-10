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
    // Check for existing record first to avoid "ON CONFLICT" errors if unique constraint is missing
    const [existing] = await db
        .select()
        .from(resumeData)
        .where(eq(resumeData.userId, userId))
        .limit(1);

    const values = {
        professionalSummary: data.professionalSummary ?? "",
        aboutMe: data.aboutMe ?? "",
        contactInfo: data.contactInfo ?? "",
        skills: data.skills ?? [],
        experience: data.experience ?? [],
        education: data.education ?? [],
        certifications: data.certifications ?? [],
        interests: data.interests ?? [],
    };

    if (existing) {
        const [updated] = await db
            .update(resumeData)
            .set({
                ...data, // Allow overwriting with provided data
                ...values, // Ensure defaults if keys are present but undefined
                updatedAt: new Date(),
            })
            .where(eq(resumeData.userId, userId))
            .returning();
        return updated;
    } else {
        const [inserted] = await db
            .insert(resumeData)
            .values({
                id: createId(),
                userId,
                ...data,
                ...values,
            })
            .returning();
        return inserted;
    }
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
    // Check for existing record
    const [existing] = await db
        .select()
        .from(codingStats)
        .where(eq(codingStats.userId, userId))
        .limit(1);

    if (existing) {
        const [updated] = await db
            .update(codingStats)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(codingStats.userId, userId))
            .returning();
        return updated;
    } else {
        const [inserted] = await db
            .insert(codingStats)
            .values({
                id: createId(),
                userId,
                ...data,
            })
            .returning();
        return inserted;
    }
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
    // Check for existing record
    const [existing] = await db
        .select()
        .from(githubContributions)
        .where(eq(githubContributions.userId, userId))
        .limit(1);

    if (existing) {
        const [updated] = await db
            .update(githubContributions)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(githubContributions.userId, userId))
            .returning();
        return updated;
    } else {
        const [inserted] = await db
            .insert(githubContributions)
            .values({
                id: createId(),
                userId,
                ...data,
            })
            .returning();
        return inserted;
    }
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
