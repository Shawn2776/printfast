// components/Navbar.jsx
import Link from "next/link";

export default function Navbar({
  variant = "landing", // "landing" | "app"
  rightSlot = null,
}) {
  return (
    <header className="mx-auto max-w-6xl px-6 pt-10">
      <div className="flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-fuchsia-400 to-cyan-300" />
          <div>
            <div className="text-sm font-semibold leading-none">PrintStarter</div>
            <div className="text-xs text-white/50">
              {variant === "landing" ? "Generate buildable ideas. Find real models fast." : "Generator"}
            </div>
          </div>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {rightSlot}

          {variant === "landing" ? (
            <Link
              href="/generate"
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200"
            >
              Open App
            </Link>
          ) : (
            <Link href="/" className="text-sm text-white/60 hover:text-white">
              Landing
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
