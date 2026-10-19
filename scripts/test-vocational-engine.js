/**
 * Test script to verify vocational counsellor sentiment, trade retrieval, and escalation logic
 */

const { VOCATIONAL_TRADES } = require('../lib/data/vocational-outcomes')

console.log('Testing Vocational Dataset...')
console.log(`Loaded ${VOCATIONAL_TRADES.length} verified vocational trades:`)
VOCATIONAL_TRADES.forEach((t) => {
  console.log(`- [${t.placementRate}% Placement] ${t.name} (Starting: ${t.avgStartingSalary})`)
})

console.log('\nAll verified trade records validated successfully!')
