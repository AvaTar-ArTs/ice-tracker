// Test script to run the exact test cases as requested
import { extractLocation } from './index.js';

// Run test cases and report output
console.log('1         extractLocation("Operation in Miami, FL")');
console.log(extractLocation("Operation in Miami, FL"));

console.log('2         extractLocation("Arrests in Houston, Texas")');
console.log(extractLocation("Arrests in Houston, Texas"));

console.log('3         extractLocation("Activity in California")');
console.log(extractLocation("Activity in California"));

console.log('4         extractLocation("ICE action in New York City, NY")');
console.log(extractLocation("ICE action in New York City, NY"));

console.log('5         extractLocation("No specific location mentioned")');
console.log(extractLocation("No specific location mentioned"));