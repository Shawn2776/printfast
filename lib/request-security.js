import { redis } from "@/lib/redis";

function firstNonEmpty(values) {
  for (const v of values) {
    if (v) return v;
  }
  return "";
}

export function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  const cf = req.headers.get("cf-connecting-ip");
  const vercel = req.headers.get("x-vercel-forwarded-for");
  const candidate = firstNonEmpty([forwarded, real, cf, vercel]);
  if (!candidate) return "unknown";
  return candidate.split(",")[0].trim() || "unknown";
}

export function validateLength(name, value, maxChars) {
  if (typeof value !== "string") {
    throw new Error(`${name} must be a string.`);
  }
  if (value.length > maxChars) {
    throw new Error(`${name} exceeds ${maxChars} characters.`);
  }
}

export function validateOneOf(name, value, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new Error(`Invalid ${name}.`);
  }
}

export async function enforceIpRateLimit({
  req,
  scope,
  limit,
  windowSeconds,
}) {
  const ip = getClientIp(req);
  const key = `rate:${scope}:${ip}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: count <= limit,
    headers: {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(Math.max(0, limit - count)),
      "X-RateLimit-Window": String(windowSeconds),
    },
  };
}
