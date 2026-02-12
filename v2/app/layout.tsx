import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SEO_KEYWORDS,
  GEO_REGION,
  GEO_PLACENAME,
  GEO_ICBM,
  SEO_FAQS,
} from "./lib/seo";
import StructuredNewsLd from "./components/StructuredNewsLd";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { WebVitals } from "./components/WebVitals";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0e12",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Live ICE Enforcement & ERO News`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Live ICE Enforcement & ERO News`,
    description: SITE_DESCRIPTION,
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Live ICE Enforcement & ERO News`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "geo.region": GEO_REGION,
    "geo.placename": GEO_PLACENAME,
    "ICBM": GEO_ICBM,
  },
};

function JsonLd() {
  const faqSchema = {
    "@type": "FAQPage",
    mainEntity: SEO_FAQS.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "Place",
        name: "United States",
        description: "Geographic coverage of ICE activity tracking across the United States.",
        geo: {
          "@type": "GeoCoordinates",
          latitude: 39.8283,
          longitude: -98.5795,
        },
        areaServed: { "@type": "Country", name: "United States" },
      },
      faqSchema,
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" />
        <link rel="preconnect" href="https://c.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://www.ice.gov" />
      </head>
      <body className="min-h-screen bg-[#0c0e12] text-[#e2e6ec] antialiased">
        <GoogleAnalytics />
        <WebVitals />
        <JsonLd />
        <StructuredNewsLd />
        {children}
      </body>
    </html>
  );
}
