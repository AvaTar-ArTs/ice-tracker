import { extractLocation } from './index.js';

console.log('Testing extractLocation function:\n');

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