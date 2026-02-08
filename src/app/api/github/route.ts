
import { NextRequest, NextResponse } from "next/server";
import { getGitHubContributions } from "@/lib/github";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const data = await getGitHubContributions(username);
        if (!data) {
            return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
        }
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
