import { NextResponse } from "next/server";
import { sendTestAlert } from "@/lib/monitoring";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const expectedToken = process.env.ALERT_TEST_TOKEN;
    if (!expectedToken) {
      return NextResponse.json({ error: "Missing ALERT_TEST_TOKEN on server." }, { status: 500 });
    }

    const headerToken = req.headers.get("x-alert-test-token") || "";
    const body = await req.json().catch(() => ({}));
    const bodyToken = String(body?.token || "");
    const token = headerToken || bodyToken;

    if (!token || token !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await sendTestAlert({ route: "api_test_alert" });
    return NextResponse.json({ ok: true, message: "Test alert dispatched." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
