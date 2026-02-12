// Debug script to understand the extractLocation function behavior
const US_STATE_ABBREV = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  "Puerto Rico": "PR",
};

function extractLocation(text) {
  console.log(`Input: "${text}"`);
  
  const stateRegex = new RegExp(`\\b(${Object.keys(US_STATE_ABBREV).join("|")})\\b`, "i");
  console.log(`State regex: ${stateRegex}`);
  
  const stateMatch = text.match(stateRegex);
  console.log(`State match:`, stateMatch);
  
  const abbrevMatch = text.match(/\b(AZ|CA|CO|CT|DC|FL|GA|IL|IN|LA|MA|MD|MN|NC|NJ|NM|NY|OH|OK|OR|PA|TX|UT|VA|WA|WV)\b/i);
  console.log(`Abbrev match:`, abbrevMatch);
  
  const state = stateMatch ? (US_STATE_ABBREV[stateMatch[1]] ?? stateMatch[1]) : abbrevMatch ? abbrevMatch[1].toUpperCase() : undefined;
  console.log(`Final state:`, state);
  
  const cityPatterns = [
    /(?:in|at|from)\s+([A-Za-z\s]+?),?\s*(?:AZ|CA|CO|CT|DC|FL|GA|IL|IN|LA|MA|MD|MN|NC|NJ|NM|NY|OH|OK|OR|PA|TX|UT|VA|WA|WV)/,
    /(?:arrested|operation in|raids? in)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/,
    /([A-Za-z\s]+?),?\s*(?:California|Texas|Florida|New York|Arizona)/,
  ];
  
  console.log('City patterns:');
  for (let i = 0; i < cityPatterns.length; i++) {
    console.log(`Pattern ${i+1}:`, cityPatterns[i]);
    const m = text.match(cityPatterns[i]);
    console.log(`Pattern ${i+1} match:`, m);
    if (m?.[1]) {
      const city = m[1].trim();
      console.log(`Pattern ${i+1} extracted city: "${city}", length: ${city.length}`);
      if (city.length > 1 && city.length < 40) {
        console.log(`Pattern ${i+1} city passed length check`);
        return { state, city };
      } else {
        console.log(`Pattern ${i+1} city failed length check`);
      }
    }
  }
  
  console.log('No valid city found, returning state only');
  return { state };
}

console.log('=== DEBUGGING extractLocation("Operation in Miami, FL") ===');
console.log('Result:', extractLocation("Operation in Miami, FL"), '\n');

console.log('=== DEBUGGING extractLocation("Arrests in Houston, Texas") ===');
console.log('Result:', extractLocation("Arrests in Houston, Texas"), '\n');

console.log('=== DEBUGGING extractLocation("Activity in California") ===');
console.log('Result:', extractLocation("Activity in California"), '\n');