import { extractLocation } from './index.js';

// Test the original function
console.log('Testing ORIGINAL extractLocation function:\n');

console.log('1. extractLocation("Operation in Miami, FL")');
console.log('Result:', extractLocation("Operation in Miami, FL"), '\n');

console.log('2. extractLocation("Arrests in Houston, Texas")');
console.log('Result:', extractLocation("Arrests in Houston, Texas"), '\n');

console.log('3. extractLocation("Activity in California")');
console.log('Result:', extractLocation("Activity in California"), '\n');

console.log('4. extractLocation("ICE action in New York City, NY")');
console.log('Result:', extractLocation("ICE action in New York City, NY"), '\n');

console.log('5. extractLocation("No specific location mentioned")');
console.log('Result:', extractLocation("No specific location mentioned"), '\n');

// Define a corrected version of the function for comparison
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

function extractLocationCorrected(text) {
  // Find state first
  const stateMatch = text.match(new RegExp(`\\b(${Object.keys(US_STATE_ABBREV).join("|")})\\b`, "i"));
  const abbrevMatch = text.match(/\b(AZ|CA|CO|CT|DC|FL|GA|IL|IN|LA|MA|MD|MN|NC|NJ|NM|NY|OH|OK|OR|PA|TX|UT|VA|WA|WV)\b/i);
  
  const state = stateMatch ? US_STATE_ABBREV[stateMatch[1]] : 
               abbrevMatch ? abbrevMatch[1].toUpperCase() : 
               undefined;
  
  // Improved city patterns
  let city = undefined;
  
  // Pattern 1: Look for "in [City], [State]" or "in [City] [State]"
  const pattern1 = /(?:in|at|from)\s+([A-Za-z\s]+?),?\s*(?:\b[A-Z]{2}\b|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|Ohio|Oklahoma|Oregon|Pennsylvania|Tennessee|Texas|Utah|Vermont|Virginia|Washington|Wisconsin|Wyoming|California|Texas|Florida|New York|Arizona)/i;
  const match1 = text.match(pattern1);
  if (match1 && match1[1]) {
    city = match1[1].trim();
  }
  
  // Pattern 2: Look for specific phrases followed by city and state
  if (!city) {
    const pattern2 = /(arrests?|operations?|activity|action)\s+in\s+([A-Za-z\s]+?)(?:\s|,|\.|$)/i;
    const match2 = text.match(pattern2);
    if (match2 && match2[2]) {
      city = match2[2].trim();
    }
  }
  
  // Pattern 3: Look for city before state name
  if (!city) {
    const pattern3 = /([A-Za-z\s]+?),?\s+(?:California|Texas|Florida|New York|Arizona|Alabama|Alaska|Arkansas|Colorado|Connecticut|Delaware|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|Ohio|Oklahoma|Oregon|Pennsylvania|Tennessee|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)/i;
    const match3 = text.match(pattern3);
    if (match3 && match3[1]) {
      city = match3[1].trim();
    }
  }
  
  if (city) {
    return { state, city };
  } else {
    return { state };
  }
}

console.log('\n\nTesting CORRECTED extractLocation function:\n');

console.log('1. extractLocationCorrected("Operation in Miami, FL")');
console.log('Result:', extractLocationCorrected("Operation in Miami, FL"), '\n');

console.log('2. extractLocationCorrected("Arrests in Houston, Texas")');
console.log('Result:', extractLocationCorrected("Arrests in Houston, Texas"), '\n');

console.log('3. extractLocationCorrected("Activity in California")');
console.log('Result:', extractLocationCorrected("Activity in California"), '\n');

console.log('4. extractLocationCorrected("ICE action in New York City, NY")');
console.log('Result:', extractLocationCorrected("ICE action in New York City, NY"), '\n');

console.log('5. extractLocationCorrected("No specific location mentioned")');
console.log('Result:', extractLocationCorrected("No specific location mentioned"), '\n');