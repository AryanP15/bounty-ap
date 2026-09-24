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
  Zap 
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
  const [activeTab, setActiveTab] = useState<"preview" | "json">("preview");

  const [bounties, setBounties] = useState<Bounty[]>([
    {
      id: "bounty-101",
      title: "Build Responsive Hero Section for Superteam NP",
      description: "Implement a dark-themed, mobile-first hero section using Tailwind CSS and Next.js.",
      rewardSol: 1.5,
      difficulty: "Intermediate",
      tags: ["Next.js", "Tailwind", "Frontend"],
      status: "Open",
      createdAt: "Just now",
    },
    {
      id: "bounty-102",
      title: "Integrate Solana Wallet Adapter with Auto-Disconnect",
      description: "Hook up Phantom/Solflare adapter with clean state fallback and balance checker.",
      rewardSol: 0.8,
      difficulty: "Beginner",
      tags: ["Solana Web3", "React"],
      status: "Open",
      createdAt: "10 mins ago",
    }
  ]);

  const [selectedBounty, setSelectedBounty] = useState<Bounty>(bounties[0]);

  const handleGenerateBounty = () => {
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const rewardMatch = promptInput.match(/(\d+(\.\d+)?)\s*(sol|solana)/i);
      const rewardSol = rewardMatch ? parseFloat(rewardMatch[1]) : 1.0;

      const difficulty: "Beginner" | "Intermediate" | "Advanced" = 
        promptInput.toLowerCase().includes("hard") || promptInput.toLowerCase().includes("advanced") ? "Advanced" :
        promptInput.toLowerCase().includes("easy") || promptInput.toLowerCase().includes("simple") ? "Beginner" : "Intermediate";

      const newBounty: Bounty = {
        id: `bounty-${Date.now().toString().slice(-4)}`,
        title: promptInput.length > 55 ? promptInput.slice(0, 52) + "..." : promptInput,
        description: `Automated agent bounty: "${promptInput}". Submissions must link a public GitHub repository.`,
        rewardSol,
        difficulty,
        tags: ["Solana", "AI-Agent", difficulty],
        status: "Open",
        createdAt: "Just now",
      };

      setBounties([newBounty, ...bounties]);
      setSelectedBounty(newBounty);
      setPromptInput("");
      setIsGenerating(false);
    }, 600);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateActionJson = (bounty: Bounty) => {
    return JSON.stringify({
      icon: "https://solana.com/src/img/branding/solanaLogoMark.svg",
      title: bounty.title,
      description: bounty.description,
      label: `Claim Bounty (${bounty.rewardSol} SOL)`,
      links: {
        actions: [
          {
            label: "Claim Task",
            href: `/api/actions/claim?bountyId=${bounty.id}`,
          },
          {
            label: "Submit PR",
            href: `/api/actions/submit?bountyId=${bounty.id}&githubUrl={githubUrl}`,
            parameters: [
              {
                name: "githubUrl",
                label: "GitHub Repository or PR URL",
                required: true,
              }
            ]
          }
        ]
      }
    }, null, 2);
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
              <span className="font-bold text-white tracking-tight">BountyAgent</span>
              <span className="ml-2 text-xs uppercase tracking-wider text-emerald-400 font-mono font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">Solana Blinks</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-900 bg-zinc-950 text-xs font-mono text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Devnet Active
            </div>
            <button className="bg-zinc-100 hover:bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-7 space-y-6">
          <div className="border border-zinc-900 bg-zinc-950/80 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">Prompt Agent to Deploy Bounty</h2>
            </div>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Describe what task you want completed and reward amount. The agent compiles it into an interactive Solana Action (Blink).
            </p>

            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g., Fix bug in Solana Anchor staking contract, reward 2.5 SOL..."
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
              />
              <button
                onClick={handleGenerateBounty}
                disabled={isGenerating || !promptInput.trim()}
                className="mt-3 w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Terminal className="h-4 w-4 animate-spin" />
                    <span>Compiling Blink Specification...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Generate & Deploy Blink</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="border border-zinc-900 bg-zinc-950/80 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-300">Live Agent Bounties</h3>
              <span className="text-xs font-mono text-zinc-500">{bounties.length} available</span>
            </div>

            <div className="space-y-3">
              {bounties.map((bounty) => (
                <div 
                  key={bounty.id}
                  onClick={() => setSelectedBounty(bounty)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedBounty.id === bounty.id 
                      ? "border-emerald-500/40 bg-zinc-900/60" 
                      : "border-zinc-900 bg-black hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-200 leading-snug">{bounty.title}</h4>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{bounty.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                        <Coins className="h-3 w-3" />
                        {bounty.rewardSol} SOL
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                      {bounty.difficulty}
                    </span>
                    {bounty.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-zinc-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <div className="border border-zinc-900 bg-zinc-950/80 rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === "preview" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Blink Social View
                </button>
                <button
                  onClick={() => setActiveTab("json")}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === "json" 
                      ? "bg-zinc-800 text-white" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Actions Spec (JSON)
                </button>
              </div>

              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Dialect Spec
              </span>
            </div>

            {activeTab === "preview" ? (
              <div className="border border-zinc-800 bg-black rounded-xl overflow-hidden shadow-2xl">
                <div className="h-32 bg-gradient-to-tr from-emerald-950 via-zinc-900 to-black p-4 flex flex-col justify-between border-b border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-zinc-400 border border-zinc-700/40">
                      solana.action.v1
                    </span>
                    <Flame className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight">
                    {selectedBounty.rewardSol} SOL Reward
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-white">{selectedBounty.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{selectedBounty.description}</p>

                  <div className="pt-2 space-y-2">
                    <button 
                      onClick={() => alert(`Simulated devnet interaction: Claimed "${selectedBounty.title}"!`)}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                    >
                      Claim Bounty ({selectedBounty.rewardSol} SOL)
                    </button>
                    <button 
                      onClick={() => {
                        const pr = prompt("Enter your GitHub PR URL:");
                        if (pr) alert(`PR Submitted for review: ${pr}`);
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium py-2 rounded-lg transition-all cursor-pointer"
                    >
                      Submit Pull Request
                    </button>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>bountyagent.app/actions/{selectedBounty.id}</span>
                  <button 
                    onClick={() => copyToClipboard(`https://bountyagent.app/actions/${selectedBounty.id}`, selectedBounty.id)}
                    className="hover:text-zinc-300 cursor-pointer"
                  >
                    {copiedId === selectedBounty.id ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <pre className="text-[11px] font-mono bg-black p-4 rounded-lg border border-zinc-900 text-emerald-400/90 overflow-x-auto max-h-[360px]">
                  {generateActionJson(selectedBounty)}
                </pre>
                <button
                  onClick={() => copyToClipboard(generateActionJson(selectedBounty), "json-spec")}
                  className="absolute top-3 right-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-1.5 rounded text-zinc-400 hover:text-white cursor-pointer"
                >
                  {copiedId === "json-spec" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}