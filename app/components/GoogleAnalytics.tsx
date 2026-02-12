"use client";

import Script from "next/script";

const GA_ID_RAW = process.env.NEXT_PUBLIC_GA_ID;
const GA_ID = GA_ID_RAW && /^G-[A-Z0-9]+$/i.test(GA_ID_RAW) ? GA_ID_RAW : null;

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
