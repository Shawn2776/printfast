"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PromptForm from "@/components/PromptForm";
import IdeaCard from "@/components/IdeaCard";
import { trackEvent } from "@/lib/analytics";

function SkeletonGrid() {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
          <div className="h-5 w-2/3 animate-pulse rounded bg-white/15" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
          <div className="mt-5 grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="h-14 animate-pulse rounded-xl border border-white/10 bg-[#0a1422]" />
            ))}
          </div>
          <div className="mt-4 h-8 w-3/5 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState("");

  async function onGenerate(payload) {
    setError("");
    setLoading(true);
    setIdeas([]);
    trackEvent("generate_request_started", {
      filament: payload?.filament,
      time_limit: payload?.timeLimit,
      skill: payload?.skill,
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Request failed.");
        trackEvent("generate_request_failed", {
          status: res.status,
        });
        return;
      }

      setIdeas(data?.ideas ?? []);
      trackEvent("generate_request_succeeded", {
        idea_count: Array.isArray(data?.ideas) ? data.ideas.length : 0,
      });
    } catch (e) {
      setError(e?.message ?? "Network error.");
      trackEvent("generate_request_failed", {
        status: "network_error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,255,0.22),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(255,126,31,0.18),transparent_38%),linear-gradient(to_bottom,#070A12,#06080F)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-16 pt-8">
        <header className="reveal-on-load">
          <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand/icon.svg" alt="PrintStarter logo" width={32} height={32} className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold">PrintStarter</p>
                <p className="text-[11px] text-white/60">Generator</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-white/70 transition hover:text-white">
                Home
              </Link>
              <a
                href="#results"
                className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Results
              </a>
            </div>
          </div>
        </header>

        <section className="reveal-on-load delay-1 mt-10 rounded-3xl border border-white/15 bg-[linear-gradient(155deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] p-6 backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/85">Idea Generator</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Generate your next print</h1>
              <p className="mt-2 text-sm text-white/65">
                Enter constraints and get practical idea candidates. Always review output before production.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <PromptForm onGenerate={onGenerate} loading={loading} />
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-100">{error}</div>
          ) : null}
        </section>

        <section id="results" className="reveal-on-load delay-2 mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Results</h2>
            {ideas.length ? <span className="text-xs text-white/55">{ideas.length} ideas</span> : null}
          </div>

          {loading && <SkeletonGrid />}

          {!loading && ideas.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/12 bg-white/6 p-6 text-sm text-white/65">
              Run a prompt to generate ideas, then open matching models from each card.
            </div>
          ) : null}

          {!loading && ideas.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ideas.map((idea, idx) => (
                <IdeaCard key={`${idea.title}-${idx}`} idea={idea} />
              ))}
            </div>
          ) : null}
        </section>

        <footer className="mt-16 border-t border-white/12 pt-6 text-xs text-white/40">
          Demo environment. Validate dimensions and tolerances before printing.
        </footer>
      </div>
    </main>
  );
}
