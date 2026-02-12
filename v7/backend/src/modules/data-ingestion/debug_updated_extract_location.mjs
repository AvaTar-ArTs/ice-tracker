// Debug script to understand the updated extractLocation function behavior
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

export function extractLocation(text) {
  console.log(`\nInput: "${text}"`);
  
  let state = undefined;
  let city = undefined;

  // 1. Try to find a state abbreviation (more precise)
  const abbrevMatch = text.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|WA|WV|WI|WY|PR)\b/i);
  console.log(`Abbreviation match:`, abbrevMatch);
  if (abbrevMatch && abbrevMatch[1]) {
    state = abbrevMatch[1].toUpperCase();
    console.log(`Found state from abbreviation: ${state}`);
  }

  // 2. If no abbreviation, try to find a full state name
  if (!state) {
    const stateMatch = text.match(new RegExp(`\\b(${Object.keys(US_STATE_ABBREV).join("|")})\\b`, "i"));
    console.log(`Full state name match:`, stateMatch);
    if (stateMatch && stateMatch[1]) {
      // Convert full name to abbreviation if found
      const fullStateName = Object.keys(US_STATE_ABBREV).find(key => key.toLowerCase() === stateMatch[1].toLowerCase());
      if (fullStateName) {
        state = US_STATE_ABBREV[fullStateName];
        console.log(`Found state from full name: ${state}`);
      }
    }
  }

  // 3. Try to find a city
  // Prioritize patterns that explicitly link city to state or common phrases
  const cityPatterns = [
    // Pattern: City, STATE_ABBREV (e.g., Miami, FL)
    /([A-Za-z\s]+?),?\s*(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|WA|WV|WI|WY|PR)\b/,
    // Pattern: City in/at/from STATE_ABBREV (e.g., Miami in FL)
    /(?:in|at|from)\s+([A-Za-z\s]+?)(?:,\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VA|WA|WV|WI|WY|PR)\b|\b|\.)/,
    // Pattern: City in/at/from Full State Name (e.g., Miami in Florida)
    new RegExp(`(?:in|at|from)\\s+([A-Za-z\\s]+?)(?:,\\s*(?:${Object.keys(US_STATE_ABBREV).join("|")})|\\b|\\.)`, "i"),
    // Generic city patterns in relation to events (e.g., arrested in City)
    /(?:arrested|operation in|raids? in)\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/,
  ];

  console.log('Testing city patterns:');
  for (let i = 0; i < cityPatterns.length; i++) {
    console.log(`Pattern ${i+1}:`, cityPatterns[i]);
    const m = text.match(cityPatterns[i]);
    console.log(`Pattern ${i+1} match:`, m);
    if (m?.[1]) {
      const extractedCity = m[1].trim();
      console.log(`Pattern ${i+1} extracted city: "${extractedCity}", length: ${extractedCity.length}`);
      // Basic validation for city length and common noise words
      if (extractedCity.length > 1 && extractedCity.length < 40 && !['in', 'at', 'from', 'operation', 'raids'].includes(extractedCity.toLowerCase())) {
          city = extractedCity;
          console.log(`Pattern ${i+1} city passed validation: "${city}"`);
          break; // Found a city, stop searching
      } else {
        console.log(`Pattern ${i+1} city failed validation`);
      }
    }
  }

  const result = {};
  if (state) result.state = state;
  if (city) result.city = city;
  
  console.log(`Final result:`, result);
  return result;
}

console.log('=== DEBUGGING extractLocation("Operation in Miami, FL") ===');
extractLocation("Operation in Miami, FL");

console.log('\n=== DEBUGGING extractLocation("Arrests in Houston, Texas") ===');
extractLocation("Arrests in Houston, Texas");

console.log('\n=== DEBUGGING extractLocation("Activity in California") ===');
extractLocation("Activity in California");

console.log('\n=== DEBUGGING extractLocation("ICE action in New York City, NY") ===');
extractLocation("ICE action in New York City, NY");

console.log('\n=== DEBUGGING extractLocation("No specific location mentioned") ===');
extractLocation("No specific location mentioned");