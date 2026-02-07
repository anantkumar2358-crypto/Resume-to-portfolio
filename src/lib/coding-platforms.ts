export interface LeetCodeStats {
    totalSolved: number;
    ranking: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating?: number;
    contestGlobalRanking?: number;
    totalContest?: number;
}

export async function getLeetCodeStats(username: string): Promise<LeetCodeStats | null> {
    try {
        // Primary API: alfa-leetcode-api
        // This is comprehensive but hosted on Render (cold starts likely)
        const fetchPrimary = async () => {
            const [profileRes, contestRes] = await Promise.all([
                fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`, { signal: AbortSignal.timeout(4000) }),
                fetch(`https://alfa-leetcode-api.onrender.com/${username}/contest`, { signal: AbortSignal.timeout(4000) })
            ]);
            if (!profileRes.ok) throw new Error("Primary API Profile Failed");
            const profileData = await profileRes.json();
            const contestData = contestRes.ok ? await contestRes.json() : {};

            return {
                totalSolved: profileData.solvedProblem || 0,
                ranking: contestData.contestGlobalRanking || 0,
                easySolved: profileData.easySolved || 0,
                mediumSolved: profileData.mediumSolved || 0,
                hardSolved: profileData.hardSolved || 0,
                contestRating: contestData.contestRating || 0,
                contestGlobalRanking: contestData.contestGlobalRanking || 0,
                totalContest: contestData.totalContest || 0
            };
        };

        // Fallback API: leetcode-stats-api (Heroku)
        // Faster but less data (no contest rating usually)
        const fetchFallback = async () => {
            console.log("Attempting fallback LeetCode API...");
            const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (!res.ok) throw new Error("Fallback API Failed");
            const data = await res.json();
            if (data.status === "error") throw new Error("Fallback API Error: " + data.message);

            return {
                totalSolved: data.totalSolved || 0,
                ranking: data.ranking || 0,
                easySolved: data.easySolved || 0,
                mediumSolved: data.mediumSolved || 0,
                hardSolved: data.hardSolved || 0,
                contestRating: 0, // Not available in this API
                contestGlobalRanking: data.ranking || 0,
                totalContest: 0
            };
        };

        // Try primary first, then fallback
        try {
            console.log(`[LeetCode] Attempting stats fetch for: ${username}`);
            return await fetchPrimary();
        } catch (primaryError) {
            console.warn(`[LeetCode] Primary API failed for ${username}:`, primaryError);
            try {
                return await fetchFallback();
            } catch (fallbackError) {
                console.error(`[LeetCode] Fallback API also failed for ${username}:`, fallbackError);
                return null;
            }
        }

    } catch (error) {
        console.error(`[LeetCode] CRITICAL ERROR for ${username}:`, error);
        return null;
    }
}

export interface CodeforcesStats {
    rating: number;
    rank: string;
    maxRating: number;
    maxRank: string;
}

export async function getCodeforcesStats(username: string): Promise<CodeforcesStats | null> {
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        if (!response.ok) return null;

        const data = await response.json();
        if (data.status !== 'OK') return null;

        const user = data.result[0];
        return {
            rating: user.rating,
            rank: user.rank,
            maxRating: user.maxRating,
            maxRank: user.maxRank
        };
    } catch (error) {
        console.error("Error fetching Codeforces stats:", error);
        return null;
    }
}
