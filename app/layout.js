import "./globals.css";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata = {
  title: "PrintStarter | AI Product Ideation for Makers",
  description:
    "Generate practical 3D-print product ideas with feasibility and demand signals, then move directly into production.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-P4MT88SW');`}
        </Script>
      </head>
      <body className="min-h-screen bg-[#07070A] text-neutral-100 antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P4MT88SW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <AnalyticsConsent gaId={GA_ID} />
        <Analytics />
      </body>
    </html>
  );
}
