"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navigation() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="size-5 text-white" />
                        </div>
                        <span className="font-semibold text-lg text-slate-900">Portfolio Gen</span>
                    </Link>

                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Features</Button>
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-900">About</Button>

                    <SignedOut>
                        <Link href="/sign-in">
                            <Button variant="outline" className="text-slate-900 border-slate-200">Login</Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                                Get Started
                            </Button>
                        </Link>
                    </SignedOut>

                    <SignedIn>
                        <Link href="/ats-check">
                            <Button variant="ghost" className="text-slate-600 hover:text-slate-900 border border-purple-100 bg-purple-50 hover:bg-purple-100 text-purple-700">
                                <Sparkles className="size-4 mr-2" />
                                ATS Scanner
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Dashboard</Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
