/** Site metadata and strings for ICE Activity Tracker. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
  process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://ice-tracker.app";

export const SITE_NAME = "ICE Activity Tracker";
export const SITE_DESCRIPTION =
  "Track U.S. Immigration and Customs Enforcement (ICE) activity: live feed of enforcement news, ERO field offices, and community reports by state. Real-time ICE news today, raids, and arrests by state.";
export const SITE_DESCRIPTION_SHORT =
  "Live ICE activity tracker: enforcement news, ERO offices, raids & arrests by state.";

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
  "ICE arrests today",
  "ERO",
  "ERO arrests",
  "Enforcement and Removal",
  "immigration enforcement",
  "immigration enforcement today",
  "ICE field offices",
  "ICE by state",
  "ICE California",
  "ICE Texas",
  "ICE Florida",
  "ICE map",
  "ICE activity map",
  "live ICE tracker",
  "DHS",
  "immigration news",
  "immigration raids",
  "ICE detention",
  "ICE checkpoints",
  "ICE operations",
  "ICE raids near me",
  "ICE activity by state",
  "what is ICE",
  "what is ERO",
  "how to track ICE activity",
  "ICE enforcement by state",
  "ICE news by state",
  "immigration enforcement news",
  "ICE arrests by state",
  "ERO field office locations",
  "ICE activity near me",
].join(", ");

/** Geographic coverage (USA) */
export const GEO_REGION = "US";
export const GEO_PLACENAME = "United States";
export const GEO_ICBM = "39.8283,-98.5795"; // continental US center

/** FAQ (used in layout and FAQ section) */
export const SEO_FAQS = [
  {
    question: "What is the ICE Activity Tracker?",
    answer:
      "ICE Activity Tracker is a live map and news feed for U.S. Immigration and Customs Enforcement (ICE) activity. It shows recent enforcement news, ERO field office locations, and lets you add community reports by state.",
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
      "Use the state filter in the sidebar to show only news and reports for your state. The map shows ERO offices and recent activity by location. You can also add a community report to log what you see.",
  },
  {
    question: "Where does the ICE tracker get its data?",
    answer:
      "Data comes from official ICE.gov RSS feeds (Enforcement and Removal, Breaking News, and state-specific feeds for CA, TX, FL, NY, AZ, and others), plus optional community reports stored in your browser.",
  },
];
