import { Button } from "./ui/button";
import { ArrowRight, Github, Linkedin } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-white -z-10" />
      <div className="absolute top-20 left-10 size-72 bg-purple-300/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 size-96 bg-blue-300/30 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
            <Sparkles className="size-4" />
            <span className="text-sm font-medium">AI-Powered Portfolio Generation</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transform Your Resume
            <br />
            Into a Stunning Portfolio
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            An AI agent that scans GitHub, LinkedIn, and projects to automatically generate 
            a polished portfolio website from your developer's digital footprint.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8"
            >
              Get Started
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Github className="size-5" />
              <span>GitHub Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="size-5" />
              <span>LinkedIn Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L13.5 7.5L18 9L13.5 10.5L12 15L10.5 10.5L6 9L10.5 7.5L12 3Z" fill="currentColor"/>
      <path d="M19 3L19.5 5L21.5 5.5L19.5 6L19 8L18.5 6L16.5 5.5L18.5 5L19 3Z" fill="currentColor"/>
      <path d="M19 16L19.5 18L21.5 18.5L19.5 19L19 21L18.5 19L16.5 18.5L18.5 18L19 16Z" fill="currentColor"/>
    </svg>
  );
}
