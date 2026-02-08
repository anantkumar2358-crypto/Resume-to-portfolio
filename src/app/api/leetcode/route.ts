
import { NextRequest, NextResponse } from "next/server";
import { getLeetCodeStats } from "@/lib/coding-platforms";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const data = await getLeetCodeStats(username);
        if (!data) {
            // If data is null, it might be a valid user with no data or API error.
            // We'll return 404 or just return 0s.
            return NextResponse.json({ error: "Failed to fetch LeetCode data" }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
