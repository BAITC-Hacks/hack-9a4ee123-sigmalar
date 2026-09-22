"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Code2,
  Terminal,
  Cpu,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AgentResponse {
  success: boolean;
  output?: string;
  error?: string;
  executionTimeMs?: number;
  model?: string;
  isMock?: boolean;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

const PRESET_PROMPTS = [
  {
    title: "💡 Hackathon Idea Generator",
    prompt: "Generate 3 innovative, high-impact AI hackathon project ideas using multimodal agents and vector search. Format as bullet points with target tech stack.",
  },
  {
    title: "⚡ Architecture Planner",
    prompt: "Design a scalable system architecture for a real-time voice-activated AI assistant. List components, APIs, and data flow.",
  },
  {
    title: "🛠️ Quick Pitch Script",
    prompt: "Write a compelling 60-second hackathon pitch script for an AI agent that automates developer code reviews.",
  },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");

  const handleRunAgent = async (promptToRun?: string) => {
    const activePrompt = promptToRun || prompt;
    if (!activePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setStatus("running");
    setResponse(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt }),
      });

      const data: AgentResponse = await res.json();

      if (res.ok && data.success) {
        setResponse(data);
        setStatus("success");
      } else {
        setResponse({
          success: false,
          error: data.error || "Failed to execute AI agent",
        });
        setStatus("error");
      }
    } catch (err: any) {
      setResponse({
        success: false,
        error: err.message || "Network error occurred while connecting to agent API.",
      });
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (response?.output) {
      navigator.clipboard.writeText(response.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Dynamic Background Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-pink-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-indigo-600/10 blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  AI Hackathon <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Boilerplate</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/60 font-mono">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Agent Status Badge */}
            {status === "idle" && (
              <Badge variant="outline" className="py-1">
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse mr-1.5" />
                Agent Ready
              </Badge>
            )}
            {status === "running" && (
              <Badge variant="warning" className="py-1">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping mr-1.5" />
                Agent Working...
              </Badge>
            )}
            {status === "success" && (
              <Badge variant="success" className="py-1">
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Executed Successfully
              </Badge>
            )}
            {status === "error" && (
              <Badge variant="destructive" className="py-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                Execution Error
              </Badge>
            )}

            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
            >
              <span>Deploy to Vercel</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Hero Tagline & Stats */}
        <section className="text-center space-y-3 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Next.js App Router • TypeScript • Tailwind CSS • Shadcn UI • OpenAI API</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Rapid AI Prototype <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Starter Kit</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Instant production-ready setup for hackathons. Connect your prompt, trigger OpenAI agents, and build high-performance AI features in minutes.
          </p>
        </section>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Input Card & Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-slate-800/80 bg-slate-900/60 shadow-2xl relative">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-indigo-400" />
                    Agent Input Console
                  </span>
                  <span className="text-xs text-slate-500 font-mono">POST /api/agent</span>
                </CardTitle>
                <CardDescription>
                  Enter instructions for your AI Agent below.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Ask the AI agent anything... (e.g. Build an API schema for user auth, write a pitch, or summarize a dataset)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[160px] text-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleRunAgent();
                    }
                  }}
                />

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">Ctrl+Enter</kbd> to execute</span>
                  <span>{prompt.length} chars</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex gap-2">
                <Button
                  onClick={() => handleRunAgent()}
                  isLoading={isLoading}
                  disabled={!prompt.trim()}
                  className="w-full h-11 text-sm font-semibold"
                >
                  {isLoading ? (
                    "Running Agent..."
                  ) : (
                    <>
                      <span>Запустить агента</span>
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Presets Card */}
            <Card className="border-slate-800/60 bg-slate-900/40">
              <CardHeader className="py-4">
                <CardTitle className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Quick Presets for Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {PRESET_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPrompt(item.prompt);
                      handleRunAgent(item.prompt);
                    }}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-lg border border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all text-xs group flex items-center justify-between"
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-slate-400 line-clamp-1">
                        {item.prompt}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Output & Dashboard Results (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="border-slate-800/80 bg-slate-900/60 shadow-2xl min-h-[460px] flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-800/60 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-400" />
                    Agent Response & Results
                  </CardTitle>
                  <CardDescription>
                    Structured Markdown response from OpenAI agent.
                  </CardDescription>
                </div>

                {response?.output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs gap-1.5 border-slate-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </Button>
                )}
              </CardHeader>

              <CardContent className="flex-1 p-6 space-y-4">
                {/* Loading Skeleton Loader */}
                {isLoading && (
                  <div className="space-y-4 py-2">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-indigo-900/40" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-1/3 bg-slate-800" />
                        <Skeleton className="h-3 w-1/4 bg-slate-800/60" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full bg-slate-800/80" />
                    <Skeleton className="h-4 w-11/12 bg-slate-800/80" />
                    <Skeleton className="h-20 w-full rounded-lg bg-slate-800/50" />
                    <Skeleton className="h-4 w-4/5 bg-slate-800/80" />
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !response && (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400">
                      <Code2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-300">
                        No Output Generated Yet
                      </h4>
                      <p className="text-xs text-slate-500 max-w-sm">
                        Enter a prompt on the left or select a quick preset to launch the AI agent.
                      </p>
                    </div>
                  </div>
                )}

                {/* Response Display with Markdown */}
                {!isLoading && response?.success && response.output && (
                  <div className="space-y-4">
                    {response.isMock && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Demo Mode Active:</strong> Using simulated response because <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-200">OPENAI_API_KEY</code> is set to placeholder. Add your API key in <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-200">.env.local</code> to connect to live OpenAI models.
                        </div>
                      </div>
                    )}

                    <div className="markdown-body p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {response.output}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {!isLoading && response && !response.success && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-300 text-sm space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-rose-200">
                      <AlertCircle className="h-4 w-4 text-rose-400" />
                      Execution Error
                    </div>
                    <p className="text-xs text-rose-300/90 font-mono">
                      {response.error}
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Response Footer Metadata */}
              {response?.success && (
                <CardFooter className="py-3 px-6 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-4">
                    <span>Model: <strong className="text-slate-200">{response.model}</strong></span>
                    {response.executionTimeMs && (
                      <span>Time: <strong className="text-slate-200">{response.executionTimeMs}ms</strong></span>
                    )}
                  </div>
                  {response.usage?.total_tokens && (
                    <div>
                      Tokens: <strong className="text-slate-200">{response.usage.total_tokens}</strong>
                    </div>
                  )}
                </CardFooter>
              )}
            </Card>
          </div>
        </div>

        {/* Feature Cards Footer Banner */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-200">Zero Configuration Setup</h4>
              <p className="text-xs text-slate-400">Pre-configured TypeScript, Tailwind, Lucide icons & Shadcn components.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-200">Vercel & Next.js App Router</h4>
              <p className="text-xs text-slate-400">Optimized for serverless deployment with edge & node API routes.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Bot className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-200">OpenAI SDK Integrated</h4>
              <p className="text-xs text-slate-400">Pre-built route for streaming, structured outputs & agent system prompts.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/60 py-4 text-center text-xs text-slate-500">
        AI Hackathon Boilerplate • Designed for Instant Prototyping
      </footer>
    </div>
  );
}
