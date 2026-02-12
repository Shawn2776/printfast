// components/IdeaCard.jsx
export default function IdeaCard({ idea }) {
  const raw = String(idea?.title ?? "").trim();

  // Short, search-friendly query (avoid long AI titles)
  const searchBase = raw
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 5)
    .join(" ");

  const q = encodeURIComponent(searchBase || raw);

  const links = [
    { name: "Printables", href: `https://www.printables.com/search/models?q=${q}` },
    { name: "MakerWorld", href: `https://makerworld.com/en/search/models?keyword=${q}` },
    { name: "Thingiverse", href: `https://www.thingiverse.com/search?q=${q}&type=things` },
  ];

  return (
    <div className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-white/30">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold leading-tight text-white">{idea.title}</h3>
        <span className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-xs text-white/75">
          {idea.difficulty}
        </span>
      </div>

      <p className="mt-3 text-sm text-white/70">{idea.description}</p>

      {/* stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-white/10 bg-[#0a1422] px-3 py-2">
          <div className="text-xs text-white/55">Time</div>
          <div className="text-sm text-white/90">{idea.estimated_print_time_hours} hrs</div>
        </div>

        <div className="rounded-md border border-white/10 bg-[#0a1422] px-3 py-2">
          <div className="text-xs text-white/55">Material</div>
          <div className="text-sm text-white/90">{idea.estimated_material_grams} g</div>
        </div>

        <div className="rounded-md border border-white/10 bg-[#0a1422] px-3 py-2">
          <div className="text-xs text-white/55">Monetization</div>
          <div className="text-sm text-white/90">{idea.monetization_score}/5</div>
        </div>

        <div className="rounded-md border border-white/10 bg-[#0a1422] px-3 py-2">
          <div className="text-xs text-white/55">Fit</div>
          <div className="text-sm text-white/90">Constraints</div>
        </div>
      </div>

      {/* links */}
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
          >
            Search {l.name}
          </a>
        ))}
      </div>
    </div>
  );
}
