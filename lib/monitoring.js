import { redis } from "@/lib/redis";
import { getClientIp } from "@/lib/request-security";
import nodemailer from "nodemailer";

const TRAFFIC_WINDOW_SECONDS = 60;
const ERROR_WINDOW_SECONDS = 60 * 5;
const ALERT_COOLDOWN_SECONDS = Number(process.env.ALERT_COOLDOWN_SECONDS || 300);
const TRAFFIC_SPIKE_THRESHOLD = Number(process.env.TRAFFIC_SPIKE_THRESHOLD || 120);
const ERROR_BURST_THRESHOLD = Number(process.env.ERROR_BURST_THRESHOLD || 20);
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "true").toLowerCase() !== "false";
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const ALERT_EMAIL_TO = process.env.ALERT_EMAIL_TO;
const ALERT_EMAIL_FROM = process.env.ALERT_EMAIL_FROM || SMTP_USER;
const ALERT_EMAIL_SUBJECT_PREFIX = process.env.ALERT_EMAIL_SUBJECT_PREFIX || "[PrintStarter Alert]";

let transporter = null;

function nowMinuteBucket() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(
    now.getUTCDate(),
  ).padStart(2, "0")}T${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
}

async function sendWebhookAlert(payload) {
  if (!ALERT_WEBHOOK_URL) return;
  await fetch(ALERT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function getTransporter() {
  if (transporter) return transporter;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ALERT_EMAIL_TO || !ALERT_EMAIL_FROM) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
}

function formatAlertEmailText(payload) {
  return [
    `Alert Type: ${payload.type}`,
    `Route: ${payload.route}`,
    `Count: ${payload.count}`,
    `Threshold: ${payload.threshold}`,
    `Timestamp: ${payload.timestamp}`,
    "",
    "Context:",
    JSON.stringify(payload.context || {}, null, 2),
  ].join("\n");
}

async function sendEmailAlert(payload) {
  const smtp = getTransporter();
  if (!smtp) return;

  await smtp.sendMail({
    from: ALERT_EMAIL_FROM,
    to: ALERT_EMAIL_TO,
    subject: `${ALERT_EMAIL_SUBJECT_PREFIX} ${payload.type} on ${payload.route}`,
    text: formatAlertEmailText(payload),
  });
}

async function maybeSendAlert({ type, route, count, threshold, context }) {
  const alertKey = `alerts:cooldown:${type}:${route}`;
  const exists = await redis.get(alertKey);
  if (exists) return;

  const payload = {
    type,
    route,
    count,
    threshold,
    timestamp: new Date().toISOString(),
    context,
  };

  await Promise.allSettled([sendWebhookAlert(payload), sendEmailAlert(payload)]);

  await redis.set(alertKey, "1", { ex: ALERT_COOLDOWN_SECONDS });
}

export async function sendTestAlert({ route = "api_test_alert" } = {}) {
  const payload = {
    type: "manual_test",
    route,
    count: 1,
    threshold: 1,
    timestamp: new Date().toISOString(),
    context: { source: "manual_api_test" },
  };

  await Promise.allSettled([sendWebhookAlert(payload), sendEmailAlert(payload)]);
}

export async function monitorApiRequest({ req, route, status, durationMs, errorMessage = "", meta = {} }) {
  try {
    const ip = getClientIp(req);
    const trafficKey = `metrics:traffic:${route}:${nowMinuteBucket()}`;
    const errorKey = `metrics:error:${route}`;

    const trafficCount = await redis.incr(trafficKey);
    if (trafficCount === 1) {
      await redis.expire(trafficKey, TRAFFIC_WINDOW_SECONDS + 30);
    }

    let errorCount = 0;
    if (status >= 500 || status === 429) {
      errorCount = await redis.incr(errorKey);
      if (errorCount === 1) {
        await redis.expire(errorKey, ERROR_WINDOW_SECONDS);
      }
    }

    console.log(
      JSON.stringify({
        level: status >= 500 || status === 429 ? "warn" : "info",
        event: "api_request",
        route,
        status,
        ip,
        duration_ms: durationMs,
        traffic_count_minute: trafficCount,
        error_count_window: errorCount,
        error_message: errorMessage || undefined,
        meta,
        ts: new Date().toISOString(),
      }),
    );

    if (trafficCount >= TRAFFIC_SPIKE_THRESHOLD) {
      await maybeSendAlert({
        type: "traffic_spike",
        route,
        count: trafficCount,
        threshold: TRAFFIC_SPIKE_THRESHOLD,
        context: { window_seconds: TRAFFIC_WINDOW_SECONDS },
      });
    }

    if (errorCount >= ERROR_BURST_THRESHOLD) {
      await maybeSendAlert({
        type: "error_burst",
        route,
        count: errorCount,
        threshold: ERROR_BURST_THRESHOLD,
        context: { window_seconds: ERROR_WINDOW_SECONDS },
      });
    }
  } catch (err) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "monitoring_failure",
        route,
        message: err?.message || "unknown monitoring error",
        ts: new Date().toISOString(),
      }),
    );
  }
}
