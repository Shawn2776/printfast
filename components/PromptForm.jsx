"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRINTERS = [
  { label: "Creality K2 Plus", value: "Creality K2 Plus" },
  { label: "Bambu Lab P1S", value: "Bambu Lab P1S" },
  { label: "Qidi Max 4 Pro", value: "Qidi Max 4 Pro" },
  { label: "Other", value: "Other" },
];

const FILAMENTS = ["PLA", "PETG", "ABS/ASA", "TPU", "Other"];
const TIMES = ["1 hour", "2 hours", "4 hours", "8 hours", "Any"];
const SKILLS = ["beginner", "intermediate", "advanced"];

const FALLBACK_PROMPTS = [
  "I have black PLA and 4 hours. Give me practical prints I can sell locally.",
  "I want a small print that reduces multi-color purge waste.",
  "I need useful garage organization prints under 3 hours.",
  "Give me functional desk accessories that look premium in matte black.",
  "A print that improves my 3D printing workflow and saves time.",
];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function PromptForm({ onGenerate, loading }) {
  const [printer, setPrinter] = useState("Creality K2 Plus");
  const [filament, setFilament] = useState("PLA");
  const [timeLimit, setTimeLimit] = useState("4 hours");
  const [skill, setSkill] = useState("intermediate");
  const [prompt, setPrompt] = useState("");
  const [promptLoading, setPromptLoading] = useState(false);

  const placeholder = useMemo(
    () => `Example: "I have black ${filament} and ${timeLimit}. Give me practical prints I can sell locally."`,
    [filament, timeLimit],
  );

  function submit(e) {
    e.preventDefault();
    onGenerate({ printer, filament, timeLimit, skill, prompt });
  }

  async function onRandomPrompt() {
    setPromptLoading(true);
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printer, filament, timeLimit, skill }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data?.prompts) && data.prompts.length > 0) {
        setPrompt(randomFrom(data.prompts));
        return;
      }
    } catch {
      // fall through to local fallback
    } finally {
      setPromptLoading(false);
    }
    setPrompt(randomFrom(FALLBACK_PROMPTS));
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label className="text-white/70">Printer</Label>
          <Select value={printer} onValueChange={setPrinter} disabled={loading}>
            <SelectTrigger className="h-10 border-white/15 bg-[#0a1422]/80 text-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select printer" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a1422] text-white">
              {PRINTERS.map((p) => (
                <SelectItem key={p.value} value={p.value} className="focus:bg-white/10">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Filament</Label>
          <Select value={filament} onValueChange={setFilament} disabled={loading}>
            <SelectTrigger className="h-10 border-white/15 bg-[#0a1422]/80 text-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select filament" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a1422] text-white">
              {FILAMENTS.map((f) => (
                <SelectItem key={f} value={f} className="focus:bg-white/10">
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Time limit</Label>
          <Select value={timeLimit} onValueChange={setTimeLimit} disabled={loading}>
            <SelectTrigger className="h-10 border-white/15 bg-[#0a1422]/80 text-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a1422] text-white">
              {TIMES.map((t) => (
                <SelectItem key={t} value={t} className="focus:bg-white/10">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white/70">Skill</Label>
          <Select value={skill} onValueChange={setSkill} disabled={loading}>
            <SelectTrigger className="h-10 border-white/15 bg-[#0a1422]/80 text-white focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a1422] text-white">
              {SKILLS.map((s) => (
                <SelectItem key={s} value={s} className="focus:bg-white/10">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white/70">Prompt</Label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] border-white/15 bg-[#0a1422]/80 text-white placeholder:text-white/35 focus-visible:ring-0"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-[#15b7ff] text-[#001028] shadow-[0_12px_30px_rgba(21,183,255,0.35)] hover:bg-[#4ac8ff]"
        >
          {loading ? "Generating..." : "Generate 10 ideas"}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={loading || promptLoading}
          onClick={onRandomPrompt}
          className="border-white/20 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          {promptLoading ? "Getting prompt..." : "Random prompt"}
        </Button>
      </div>
    </form>
  );
}
