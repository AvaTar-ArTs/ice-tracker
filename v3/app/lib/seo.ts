/** Site metadata and strings for ICE Activity Tracker (v3). */
export const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
  process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://ice-tracker.app";

export const SITE_NAME = "ICE Activity Tracker";
export const SITE_DESCRIPTION =
  "Track U.S. Immigration and Customs Enforcement (ICE) activity: live feed of enforcement news, ERO field offices, Know Your Rights, rapid response hotlines, and community reports by state.";
export const SITE_DESCRIPTION_SHORT =
  "Live ICE activity tracker: enforcement news, ERO offices, Know Your Rights, hotlines, raids & arrests by state.";

export const SEO_KEYWORDS = [
  "ICE",
  "ICE activity",
  "ICE tracker",
  "ICE activity tracker",
  "ICE news",
  "ICE news today",
  "ICE raids",
  "ICE raids today",
  "ICE enforcement",
  "ICE arrests",
  "ERO",
  "ERO arrests",
  "Enforcement and Removal",
  "immigration enforcement",
  "ICE field offices",
  "ICE by state",
  "ICE California",
  "ICE Texas",
  "ICE Florida",
  "ICE map",
  "ICE activity map",
  "live ICE tracker",
  "Know Your Rights immigration",
  "ICE raids near me",
  "ICE activity by state",
  "what is ICE",
  "what is ERO",
  "how to track ICE activity",
  "rapid response immigration hotline",
  "ICE activity near me",
].join(", ");

export const GEO_REGION = "US";
export const GEO_PLACENAME = "United States";
export const GEO_ICBM = "39.8283,-98.5795";

export const SEO_FAQS = [
  {
    question: "What is the ICE Activity Tracker?",
    answer:
      "ICE Activity Tracker is a live map and news feed for U.S. Immigration and Customs Enforcement (ICE) activity. It shows recent enforcement news, ERO field office locations, in-app Know Your Rights and rapid response hotlines by state, and lets you add community reports by state.",
  },
  {
    question: "What is ERO?",
    answer:
      "ERO is Enforcement and Removal Operations, the ICE division that arrests and removes people who violate immigration laws. The tracker shows ERO field offices and enforcement news across all 25 field offices.",
  },
  {
    question: "Is ICE activity data real-time?",
    answer:
      "The feed pulls from ICE.gov press releases and state RSS feeds. Updates are not real-time; they reflect published news. Use the 1-minute refresh option and community reports for the freshest view.",
  },
  {
    question: "How do I track ICE activity in my state?",
    answer:
      "Use the state filter in the sidebar to show only news and reports for your state. Open Rapid response & hotlines to see state-specific hotline numbers. The map shows ERO offices and recent activity by location.",
  },
  {
    question: "Where does the ICE tracker get its data?",
    answer:
      "Data comes from official ICE.gov RSS feeds (Enforcement & Removal, Breaking News, and state-specific feeds), plus in-app Know Your Rights and hotline directory, and optional community reports stored in your browser.",
  },
];
