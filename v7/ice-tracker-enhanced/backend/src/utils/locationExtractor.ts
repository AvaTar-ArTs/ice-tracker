import axios from 'axios';
import { logger } from './logger';

// US state abbreviations and names
const US_STATES: { [key: string]: string } = {
  ALABAMA: 'AL', ALASKA: 'AK', ARIZONA: 'AZ', ARKANSAS: 'AR', CALIFORNIA: 'CA',
  COLORADO: 'CO', CONNECTICUT: 'CT', DELAWARE: 'DE', 'DISTRICT OF COLUMBIA': 'DC',
  FLORIDA: 'FL', GEORGIA: 'GA', HAWAII: 'HI', IDAHO: 'ID', ILLINOIS: 'IL',
  INDIANA: 'IN', IOWA: 'IA', KANSAS: 'KS', KENTUCKY: 'KY', LOUISIANA: 'LA',
  MAINE: 'ME', MARYLAND: 'MD', MASSACHUSETTS: 'MA', MICHIGAN: 'MI', MINNESOTA: 'MN',
  MISSISSIPPI: 'MS', MISSOURI: 'MO', MONTANA: 'MT', NEBRASKA: 'NE', NEVADA: 'NV',
  'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', OHIO: 'OH', OKLAHOMA: 'OK',
  OREGON: 'OR', PENNSYLVANIA: 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD', TENNESSEE: 'TN', TEXAS: 'TX', UTAH: 'UT', VERMONT: 'VT',
  VIRGINIA: 'VA', WASHINGTON: 'WA', 'WEST VIRGINIA': 'WV', WISCONSIN: 'WI', WYOMING: 'WY',
  'PUERTO RICO': 'PR',
};

// Reverse mapping for full names
const US_STATE_NAMES: { [key: string]: string } = {};
Object.entries(US_STATES).forEach(([fullName, abbr]) => {
  US_STATE_NAMES[abbr] = fullName.replace(/ /g, '_');
});

// Major US cities with state info
const US_CITIES: { [key: string]: { state: string, stateAbbr: string } } = {
  'NEW YORK CITY': { state: 'NEW YORK', stateAbbr: 'NY' },
  'LOS ANGELES': { state: 'CALIFORNIA', stateAbbr: 'CA' },
  'CHICAGO': { state: 'ILLINOIS', stateAbbr: 'IL' },
  'HOUSTON': { state: 'TEXAS', stateAbbr: 'TX' },
  'PHOENIX': { state: 'ARIZONA', stateAbbr: 'AZ' },
  'PHILADELPHIA': { state: 'PENNSYLVANIA', stateAbbr: 'PA' },
  'SAN ANTONIO': { state: 'TEXAS', stateAbbr: 'TX' },
  'SAN DIEGO': { state: 'CALIFORNIA', stateAbbr: 'CA' },
  'DALLAS': { state: 'TEXAS', stateAbbr: 'TX' },
  'SAN JOSE': { state: 'CALIFORNIA', stateAbbr: 'CA' },
  'AUSTIN': { state: 'TEXAS', stateAbbr: 'TX' },
  'JACKSONVILLE': { state: 'FLORIDA', stateAbbr: 'FL' },
  'FORT WORTH': { state: 'TEXAS', stateAbbr: 'TX' },
  'COLUMBUS': { state: 'OHIO', stateAbbr: 'OH' },
  'CHARLOTTE': { state: 'NORTH CAROLINA', stateAbbr: 'NC' },
  'SAN FRANCISCO': { state: 'CALIFORNIA', stateAbbr: 'CA' },
  'INDIANAPOLIS': { state: 'INDIANA', stateAbbr: 'IN' },
  'SEATTLE': { state: 'WASHINGTON', stateAbbr: 'WA' },
  'DENVER': { state: 'COLORADO', stateAbbr: 'CO' },
  'WASHINGTON': { state: 'DISTRICT OF COLUMBIA', stateAbbr: 'DC' },
};

/**
 * Represents a location found in text
 */
interface ExtractedLocation {
  name: string;
  type: 'city' | 'county' | 'state' | 'country';
  stateCode?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Extract locations from text using pattern matching and geocoding
 */
export const extractLocationsFromText = async (text: string): Promise<ExtractedLocation[]> => {
  const locations: ExtractedLocation[] = [];
  const normalizedText = text.toUpperCase();
  
  try {
    // 1. Extract state abbreviations (more precise)
    const abbrevMatches = normalizedText.match(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|PR)\b/g);
    if (abbrevMatches) {
      const uniqueStates = [...new Set(abbrevMatches)];
      uniqueStates.forEach(stateAbbr => {
        const stateName = US_STATE_NAMES[stateAbbr];
        if (stateName) {
          locations.push({
            name: stateName.replace(/_/g, ' '),
            type: 'state',
            stateCode: stateAbbr,
            countryCode: 'US'
          });
        }
      });
    }
    
    // 2. Extract full state names
    const stateRegex = new RegExp(`\\b(${Object.keys(US_STATES).join('|')})\\b`, 'gi');
    const stateMatches = text.match(stateRegex);
    if (stateMatches) {
      stateMatches.forEach(match => {
        const stateName = match.toUpperCase();
        const stateAbbr = US_STATES[stateName];
        if (stateAbbr) {
          locations.push({
            name: stateName,
            type: 'state',
            stateCode: stateAbbr,
            countryCode: 'US'
          });
        }
      });
    }
    
    // 3. Extract major cities
    const cityRegex = new RegExp(`\\b(${Object.keys(US_CITIES).join('|')})\\b`, 'gi');
    const cityMatches = text.match(cityRegex);
    if (cityMatches) {
      cityMatches.forEach(match => {
        const cityName = match.toUpperCase();
        const cityInfo = US_CITIES[cityName];
        if (cityInfo) {
          locations.push({
            name: cityName.replace(/_/g, ' '),
            type: 'city',
            stateCode: cityInfo.stateAbbr,
            countryCode: 'US'
          });
        }
      });
    }
    
    // 4. Extract city patterns like "City, State" or "City in State"
    const cityPatterns = [
      /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s*,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|PR)\b/gi,
      /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+in\s+(${Object.keys(US_STATES).join('|')})\b/gi,
      /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+in\s+(AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|PR)\b/gi,
    ];
    
    for (const pattern of cityPatterns) {
      let match;
      while ((match = pattern.exec(normalizedText)) !== null) {
        const cityName = match[1];
        const stateRef = match[2]; // Could be abbreviation or full name
        
        // Determine state code from reference
        let stateCode = US_STATES[stateRef] || stateRef;
        
        // Validate city name isn't a common word
        if (cityName.length > 2 && !['IN', 'AT', 'TO', 'FOR', 'THE', 'AND', 'ARE', 'WAS', 'HAS', 'HAD'].includes(cityName)) {
          locations.push({
            name: cityName,
            type: 'city',
            stateCode,
            countryCode: 'US'
          });
        }
      }
    }
    
    // Remove duplicates
    const uniqueLocations = Array.from(
      new Map(locations.map(loc => [`${loc.name}-${loc.type}`, loc])).values()
    );
    
    // Geocode locations to get coordinates (in a real implementation)
    // For now, we'll return the locations without coordinates
    // In a full implementation, we would call a geocoding service
    
    logger.debug('Location extraction completed', { 
      textLength: text.length, 
      locationsFound: uniqueLocations.length,
      locations: uniqueLocations.map(l => ({ name: l.name, type: l.type }))
    });
    
    return uniqueLocations;
  } catch (error) {
    logger.error('Error in location extraction', { error: error.message, textPreview: text.substring(0, 100) });
    return []; // Return empty array on error rather than throwing
  }
};