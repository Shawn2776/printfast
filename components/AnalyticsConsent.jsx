"use client";

import { useState } from "react";
import Script from "next/script";

const CONSENT_KEY = "analytics-consent";

export default function AnalyticsConsent({ gaId }) {
  const [consent, setConsent] = useState(() => {
    if (typeof window === "undefined") return "unknown";
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : "unknown";
  }); // unknown | granted | denied

  function choose(next) {
    window.localStorage.setItem(CONSENT_KEY, next);
    setConsent(next);
  }

  if (!gaId) return null;

  return (
    <>
      {consent === "granted" ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}

      {consent === "unknown" ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-2xl border border-white/15 bg-[#0b1322]/95 p-4 text-sm text-white shadow-xl backdrop-blur">
          <p className="text-white/85">
            We use analytics cookies to understand product usage and improve the experience.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => choose("granted")}
              className="rounded-full bg-[#15b7ff] px-4 py-2 font-semibold text-[#001028] hover:bg-[#4ac8ff]"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("denied")}
              className="rounded-full border border-white/25 bg-white/5 px-4 py-2 font-semibold text-white hover:bg-white/10"
            >
              Decline
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
