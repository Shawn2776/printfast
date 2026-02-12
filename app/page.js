import Link from "next/link";
import Image from "next/image";

const highlights = [
  { title: "Constraint-first prompts", description: "Start with your printer, material, and print window." },
  { title: "Practical idea output", description: "Get concepts designed for buildability and utility." },
  { title: "Fast model discovery", description: "Open matching model searches from each generated idea." },
];

const features = [
  {
    title: "Constraint-aware prompting",
    description: "Tell us your printer, material, and deadline. Get ideas you can actually build this week.",
  },
  {
    title: "Commercial viability scoring",
    description: "See demand, complexity, and margin signals before you commit to a print run.",
  },
  {
    title: "Model source shortcuts",
    description: "Jump directly to matching models on leading repositories from a single idea card.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(17,184,255,0.22),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(255,126,31,0.18),transparent_38%),linear-gradient(to_bottom,#070A12,#06080F)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-8">
        <header className="reveal-on-load">
          <div className="flex items-center justify-between rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-xl">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand/icon.svg" alt="PrintStarter logo" width={32} height={32} className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold">PrintStarter</p>
                <p className="text-[11px] text-white/60">AI Product Ideation</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-white/75 md:flex">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#workflow" className="hover:text-white transition-colors">
                Workflow
              </a>
            </nav>

            <Link
              href="/generate"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0A1222] transition hover:bg-[#dceeff]"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="mt-16 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="reveal-on-load delay-1">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
              3D Print Idea Studio
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-balance md:text-6xl">
              Turn raw ideas into printable products in minutes.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/72 md:text-lg">
              Generate practical print concepts, screen for viability, and find production-ready paths before your
              first slice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/generate"
                className="rounded-full bg-[#15b7ff] px-6 py-3 text-sm font-semibold text-[#001028] shadow-[0_12px_36px_rgba(21,183,255,0.35)] transition hover:bg-[#4ac8ff]"
              >
                Start Generating
              </Link>
              <a
                href="#workflow"
                className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See Workflow
              </a>
            </div>
          </div>

          <div className="reveal-on-load delay-2">
            <div className="rounded-3xl border border-white/15 bg-white/8 p-5 shadow-[0_20px_90px_rgba(0,0,0,0.45)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">Prompt Preview</p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#0a1322] p-4 text-sm text-white/85">
                {`"I have a Bambu A1, matte PLA, and 5 hours. Suggest 10 practical desk products with low failure risk
                and good resale potential."`}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">Top Pick</p>
                  <p className="mt-2 text-sm font-semibold">Cable Dock Set</p>
                  <p className="mt-1 text-xs text-white/60">Demand high, print time 2h 40m</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-white/50">Profit Signal</p>
                  <p className="mt-2 text-sm font-semibold">+38% Margin</p>
                  <p className="mt-1 text-xs text-white/60">Based on estimated material plus labor</p>
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-full w-4/5 rounded-full bg-[linear-gradient(90deg,#15b7ff,#ff8a24)]" />
              </div>
              <p className="mt-2 text-xs text-white/55">Buildability confidence: 82%</p>
            </div>
          </div>
        </section>

        <section className="reveal-on-load delay-3 mt-14">
          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm">
                <p className="text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-white/65">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="features" className="mt-20">
          <div className="reveal-on-load">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Core Features</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Built for fast iteration and real output.</h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className={`reveal-on-load delay-${index + 1} rounded-2xl border border-white/15 bg-[linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] p-6`}
              >
                <div className="h-8 w-8 rounded-lg bg-[linear-gradient(135deg,#15b7ff,#ff8a24)]" />
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mt-20 rounded-3xl border border-white/15 bg-white/6 p-6 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Workflow</p>
          <h2 className="mt-3 text-3xl font-semibold">From prompt to launch in three passes.</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Add constraints: printer, material, print duration, and audience.",
              "Generate and filter: compare usability, complexity, and margin.",
              "Ship faster: move top ideas into your production queue.",
            ].map((item, index) => (
              <article key={item} className="reveal-on-load rounded-2xl border border-white/12 bg-[#0a1422] p-5">
                <p className="text-xs text-cyan-100/80">Step 0{index + 1}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{item}</p>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
