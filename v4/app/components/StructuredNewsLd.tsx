import { headers } from "next/headers";
import type { IceNewsItem } from "@/app/types";

export default async function StructuredNewsLd() {
  let items: IceNewsItem[] = [];
  try {
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/ice-news`, { next: { revalidate: 300 } });
    const data = await res.json();
    if (Array.isArray(data.items)) items = data.items.slice(0, 15);
  } catch {
    // omit JSON-LD on error
  }
  if (items.length === 0) return null;
  const itemListElement = items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "NewsArticle",
      headline: item.title,
      url: item.link,
      description: item.description?.slice(0, 200),
      datePublished: item.pubDate,
      ...(item.state && { dateline: item.state, about: { "@type": "Place", name: item.state } }),
    },
  }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest ICE enforcement and ERO news",
    description: "Recent U.S. Immigration and Customs Enforcement news and enforcement activity.",
    numberOfItems: itemListElement.length,
    itemListElement,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
