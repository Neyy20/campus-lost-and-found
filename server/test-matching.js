const { calculateMatchScore, findPossibleMatches } = require('../client/src/utils/matching');

console.log('\n--- TESTING RULE-BASED MATCHING ALGORITHM ---');

const lostItem = {
  id: '1',
  type: 'LOST',
  title: 'Black Leather Wallet',
  category: 'Wallet',
  location: 'Library',
  description: 'Black leather wallet with college ID card and metro pass'
};

const foundItem1 = {
  id: '2',
  type: 'FOUND',
  title: 'Black Wallet',
  category: 'Wallet',
  location: 'Library',
  description: 'Found black wallet near library study desks'
};

const foundItem2 = {
  id: '3',
  type: 'FOUND',
  title: 'Blue Water Bottle',
  category: 'Bottle',
  location: 'Canteen',
  description: 'Milton steel blue bottle left in canteen'
};

const score1 = calculateMatchScore(lostItem, foundItem1);
console.log(`Match Score between Lost Wallet and Found Wallet: ${score1} points (Expected >= 8)`);

const score2 = calculateMatchScore(lostItem, foundItem2);
console.log(`Match Score between Lost Wallet and Found Bottle: ${score2} points (Expected 0)`);

const allItems = [lostItem, foundItem1, foundItem2];
const matches = findPossibleMatches(lostItem, allItems, 3);

console.log(`Possible matches found for Lost Wallet: ${matches.length} item(s)`);
matches.forEach((m) => {
  console.log(`- Matched: "${m.item.title}" | Score: ${m.score} pts`);
});

if (matches.length === 1 && matches[0].item.id === '2' && score1 >= 8 && score2 === 0) {
  console.log('\n✅ RULE-BASED MATCHING ALGORITHM PASSED ALL TESTS!\n');
} else {
  console.error('\n❌ Matching test failed\n');
  process.exit(1);
}
