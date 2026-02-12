import crypto from "crypto";
import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { redis } from "@/lib/redis";
import { monitorApiRequest } from "@/lib/monitoring";
import { enforceIpRateLimit, validateLength, validateOneOf } from "@/lib/request-security";

export const runtime = "nodejs";

const TTL_SECONDS = 60 * 30; // 30 minutes
const RATE_LIMIT_WINDOW_SECONDS = 60 * 10; // 10 minutes
const RATE_LIMIT_MAX = 20; // per IP per window

const ALLOWED_FILAMENTS = ["PLA", "PETG", "ABS/ASA", "TPU", "Other"];
const ALLOWED_TIMES = ["1 hour", "2 hours", "4 hours", "8 hours", "Any"];
const ALLOWED_SKILLS = ["beginner", "intermediate", "advanced"];

function safeJsonParse(str) {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch {
    return { ok: false, value: null };
  }
}

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function makeKey({ printer, filament, timeLimit, skill }) {
  const norm = JSON.stringify({
    printer: normalizeText(printer),
    filament: normalizeText(filament),
    timeLimit: normalizeText(timeLimit),
    skill: normalizeText(skill),
  });
  return `prompts:suggestions:${sha256(norm)}`;
}

async function responseWithMonitoring({ req, startMs, status, body, headers = {}, meta = {}, errorMessage = "" }) {
  await monitorApiRequest({
    req,
    route: "api_prompts",
    status,
    durationMs: Date.now() - startMs,
    errorMessage,
    meta,
  });

  return NextResponse.json(body, { status, headers });
}

export async function POST(req) {
  const startMs = Date.now();

  try {
    const rate = await enforceIpRateLimit({
      req,
      scope: "prompts",
      limit: RATE_LIMIT_MAX,
      windowSeconds: RATE_LIMIT_WINDOW_SECONDS,
    });

    if (!rate.allowed) {
      return responseWithMonitoring({
        req,
        startMs,
        status: 429,
        body: { error: "Too many requests. Please try again shortly." },
        headers: rate.headers,
        errorMessage: "rate_limit",
      });
    }

    const body = await req.json();

    const printer = String(body?.printer ?? "Unknown printer").trim();
    const filament = String(body?.filament ?? "Unknown filament").trim();
    const timeLimit = String(body?.timeLimit ?? "Any").trim();
    const skill = String(body?.skill ?? "Any").trim();

    validateLength("printer", printer, 80);
    validateLength("filament", filament, 30);
    validateLength("timeLimit", timeLimit, 20);
    validateLength("skill", skill, 20);
    validateOneOf("filament", filament, ALLOWED_FILAMENTS);
    validateOneOf("timeLimit", timeLimit, ALLOWED_TIMES);
    validateOneOf("skill", skill, ALLOWED_SKILLS);

    const cacheKey = makeKey({ printer, filament, timeLimit, skill });
    const cacheHit = await redis.get(cacheKey);
    if (cacheHit) {
      return responseWithMonitoring({
        req,
        startMs,
        status: 200,
        body: cacheHit,
        meta: { cache: "hit" },
      });
    }

    const client = getOpenAIClient();

    const system = `
You generate short, practical prompt ideas for a 3D print ideation tool.
Return STRICT JSON only. No markdown. No commentary.
Output must be: { "prompts": [ ... ] }
Return exactly 5 prompts.

Each prompt must:
- Be 1 sentence.
- Include practical constraints (material, time, use case, or audience).
- Be safe and legal.
- Be distinct from the others.
`.trim();

    const user = `
Generate prompt suggestions for:
- Printer: ${printer}
- Filament: ${filament}
- Time limit: ${timeLimit}
- Skill: ${skill}
`.trim();

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 1,
    });

    const text = resp.output_text?.trim() ?? "";
    const parsed = safeJsonParse(text);

    if (!parsed.ok || !Array.isArray(parsed.value?.prompts)) {
      return responseWithMonitoring({
        req,
        startMs,
        status: 502,
        body: { error: "Model returned invalid JSON." },
        errorMessage: "invalid_model_json",
      });
    }

    const prompts = parsed.value.prompts
      .map((p) => String(p || "").trim())
      .filter(Boolean)
      .slice(0, 5);

    if (prompts.length === 0) {
      return responseWithMonitoring({
        req,
        startMs,
        status: 502,
        body: { error: "No prompts generated." },
        errorMessage: "empty_prompt_list",
      });
    }

    const payload = { prompts };
    await redis.set(cacheKey, payload, { ex: TTL_SECONDS });

    return responseWithMonitoring({
      req,
      startMs,
      status: 200,
      body: payload,
      meta: { cache: "miss" },
    });
  } catch (err) {
    const message = String(err?.message || "Server error");
    if (message.startsWith("Invalid") || message.includes("exceeds")) {
      return responseWithMonitoring({
        req,
        startMs,
        status: 400,
        body: { error: message },
        errorMessage: "validation_error",
      });
    }

    return responseWithMonitoring({
      req,
      startMs,
      status: 500,
      body: { error: message },
      errorMessage: "server_error",
    });
  }
}
