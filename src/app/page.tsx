"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Copy, 
  Check, 
  Coins, 
  Flame, 
  ShieldCheck, 
  Zap,
  Activity,
  Code2,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  description: string;
  rewardSol: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  status: "Open" | "Claimed" | "In Review";
  createdAt: string;
}

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"generator" | "bounties" | "logs">("generator");

  const [bounties, setBounties] = useState<Bounty[]>([
    {
      id: "act_sol99x2",
      title: "Fix Navigation Hydration Bug in Next.js",
      description: "Resolve client-server DOM mismatch on mobile drawer component in repo /solana-dapp.",
      rewardSol: 0.5,
      difficulty: "Intermediate",
      tags: ["Next.js", "React", "TypeScript"],
      status: "Open",
      createdAt: "2m ago",
    },
    {
      id: "act_sol88y1",
      title: "Optimize Anchor Escrow State Validation",
      description: "Audit and patch state check vulnerabilities in Solana escrow smart contract.",
      rewardSol: 2.0,
      difficulty: "Advanced",
      tags: ["Rust", "Anchor", "Security"],
      status: "Open",
      createdAt: "15m ago",
    },
    {
      id: "act_sol77z9",
      title: "Build Wallet Adapter Fallback Handler",
      description: "Ensure clean disconnect states when Phantom wallet extension injects asynchronously.",
      rewardSol: 0.8,
      difficulty: "Beginner",
      tags: ["Solana", "Web3.js"],
      status: "Open",
      createdAt: "1h ago",
    }
  ]);

  const [selectedBounty, setSelectedBounty] = useState<Bounty>(bounties[0]);

  const [agentLogs, setAgentLogs] = useState<string[]>([
    "[11:35:02] INITIALIZED: Solana Action Registry v2.1.3 loaded successfully.",
    "[11:35:40] LISTENER: Connected to Solana Devnet RPC endpoint (https://api.devnet.solana.com).",
    "[11:36:12] AGENT SYNC: Parsed natural language prompt parameters for micro-bounty execution.",
    "[11:40:02] READY: Awaiting autonomous prompt input or webhook PR verification triggers."
  ]);

  const handleGenerateBounty = () => {
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const rewardMatch = promptInput.match(/(\d+(\.\d+)?)\s*(sol|solana)/i);
      const rewardSol = rewardMatch ? parseFloat(rewardMatch[1]) : 1.0;

      const difficulty: "Beginner" | "Intermediate" | "Advanced" = 
        promptInput.toLowerCase().includes("hard") || promptInput.toLowerCase().includes("security") ? "Advanced" :
        promptInput.toLowerCase().includes("easy") || promptInput.toLowerCase().includes("simple") ? "Beginner" : "Intermediate";

      const newId = `act_${Math.random().toString(36).substring(2, 9)}`;
      const newBounty: Bounty = {
        id: newId,
        title: promptInput.length > 45 ? promptInput.slice(0, 42) + "..." : promptInput,
        description: `Autonomous agent execution target: "${promptInput}". Submissions require cryptographic PR verification.`,
        rewardSol,
        difficulty,
        tags: ["Solana", "AI-Agent", difficulty],
        status: "Open",
        createdAt: "Just now",
      };

      setBounties([newBounty, ...bounties]);
      setSelectedBounty(newBounty);
      
      // Add execution log
      setAgentLogs(prev => [
        `[${new Date().toLocaleTimeString()}] SYNTHESIZED: Created new Blink action schema for "${newBounty.title}" with reward ${rewardSol} SOL.`,
        ...prev
      ]);

      setPromptInput("");
      setIsGenerating(false);
    }, 700);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-400 font-sans">
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wider text-sm">BOUNTYAGENT</span>
                <span className="text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/50">AI + BLINKS</span>
              </div>
              <p className="text-[10px] text-zinc-500 tracking-tight">Autonomous Social Micro-Bounties on Solana</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab("generator")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "generator" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"}`}
            >
              <Sparkles className="h-3.5 w-3.5" /> AI Generator
            </button>
            <button 
              onClick={() => setActiveTab("bounties")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "bounties" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"}`}
            >
              <Layers className="h-3.5 w-3.5" /> Active Bounties <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">{bounties.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${activeTab === "logs" ? "bg-emerald-500 text-black font-semibold" : "text-zinc-400 hover:text-white"}`}
            >
              <Activity className="h-3.5 w-3.5" /> Agent Logs
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-900 bg-zinc-950 text-xs font-mono text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Solana Devnet
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-7 space-y-6">
              <div className="border border-zinc-900 bg-zinc-950/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">AI Prompt Task Synthesizer</h2>
                </div>
                <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                  Describe any engineering task in natural language. Our agent will parse parameters & build a Solana Blink.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-zinc-400 mb-2">Task Prompt / Instruction</label>
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="e.g., Fix the responsive layout bug in Next.js navbar repo, reward 0.5 SOL..."
                      rows={3}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none font-mono"
                    />
                  </div>

                  <button
                    onClick={handleGenerateBounty}
                    disabled={isGenerating || !promptInput.trim()}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                  >
                    {isGenerating ? (
                      <>
                        <Terminal className="h-4 w-4 animate-spin" />
                        <span>Synthesizing Agent Spec & Action Payload...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Generate with AI</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Try prompts:</span>
                    <button onClick={() => setPromptInput("Fix Navbar bug in NextJS repo, reward 0.5 SOL")} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-800 text-[11px] cursor-pointer">
                      Fix Navbar bug in NextJS repo
                    </button>
                    <button onClick={() => setPromptInput("Optimize Rust smart contract state checks, reward 1.8 SOL")} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-800 text-[11px] cursor-pointer">
                      Optimize Rust smart contract
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-zinc-900 bg-zinc-950/80 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">Parsed Bounty Schema</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/40">Ready for Blink Export</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">Bounty Title</label>
                    <input type="text" readOnly value={selectedBounty.title} className="w-full bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">Reward (SOL)</label>
                    <input type="text" readOnly value={`${selectedBounty.rewardSol} SOL`} className="w-full bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono font-bold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">Task Specification</label>
                    <input type="text" readOnly value={selectedBounty.description} className="w-full bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">Difficulty</label>
                    <input type="text" readOnly value={selectedBounty.difficulty} className="w-full bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono uppercase" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">Tags (comma separated)</label>
                    <input type="text" readOnly value={selectedBounty.tags.join(", ")} className="w-full bg-black border border-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono" />
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-5 space-y-6">
              <div className="border border-zinc-900 bg-zinc-950/80 rounded-2xl p-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">Social Action Container</span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/30">
                    Live Solana Blink Preview
                  </span>
                </div>

                <div className="border border-zinc-800 bg-black rounded-xl overflow-hidden shadow-2xl">
                  <div className="h-32 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-black p-4 flex flex-col justify-between border-b border-zinc-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-zinc-400 border border-zinc-700/40 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" /> Verified Protocol
                      </span>
                      <Flame className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-xl font-bold text-white tracking-tight font-mono">
                      {selectedBounty.rewardSol} SOL Reward
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                      {selectedBounty.difficulty.toUpperCase()} TIER
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">{selectedBounty.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{selectedBounty.description}</p>

                    <div className="pt-2 space-y-2.5">
                      <button 
                        onClick={() => alert(`Simulated Devnet execution: Accepted & claimed "${selectedBounty.title}"!`)}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                      >
                        <Coins className="h-4 w-4" /> Accept & Claim Task ({selectedBounty.rewardSol} SOL)
                      </button>
                      <button 
                        onClick={() => {
                          const pr = prompt("Enter your GitHub PR URL for validation:");
                          if (pr) alert(`PR verified against repository: ${pr}`);
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        Submit Pull Request
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Action ID: {selectedBounty.id}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-600">Powered by Solana Actions</span>
                      <button onClick={() => copyToClipboard(`https://bountyagent.app/actions/${selectedBounty.id}`, selectedBounty.id)} className="hover:text-white cursor-pointer flex items-center gap-1">
                        {copiedId === selectedBounty.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>Copy Blink</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "bounties" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Active Micro-Bounties Feed</h2>
                <p className="text-xs text-zinc-500">All autonomous action endpoints currently deployed on devnet.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-950 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-900">
                {bounties.length} Total Bounties
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bounties.map((b) => (
                <div key={b.id} className="border border-zinc-900 bg-zinc-950 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                        {b.difficulty}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Coins className="h-3 w-3" /> {b.rewardSol} SOL
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{b.title}</h3>
                    <p className="text-xs text-zinc-400 mb-4 line-clamp-2">{b.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {b.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono bg-black text-zinc-500 px-2 py-0.5 rounded border border-zinc-900">#{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {b.createdAt}
                    </span>
                    <button 
                      onClick={() => { setSelectedBounty(b); setActiveTab("generator"); }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      View Blink <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Autonomous Agent Execution Logs</h2>
                <p className="text-xs text-zinc-500">Real-time system telemetry and Action endpoint activity.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-950 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Streaming Live
              </span>
            </div>

            <div className="border border-zinc-900 bg-zinc-950 rounded-2xl p-6 font-mono text-xs space-y-3">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black border border-zinc-900 text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}