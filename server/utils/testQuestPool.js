// Test file for the daily quest pool system
const { DAILY_QUEST_POOL, selectDailyQuests, prepareDailyQuests } = require('./dailyQuestPool');

// Test 1: Verify quest pool has 25 quests
console.log('=== Test 1: Quest Pool Size ===');
console.log(`Total quests in pool: ${DAILY_QUEST_POOL.length}`);
console.log(`Expected: 25`);
console.log(`Pass: ${DAILY_QUEST_POOL.length === 25 ? 'YES' : 'NO'}`);

// Test 2: Verify difficulty distribution
console.log('\n=== Test 2: Difficulty Distribution ===');
const difficultyCount = {
  easy: 0,
  medium: 0,
  hard: 0
};

DAILY_QUEST_POOL.forEach(quest => {
  difficultyCount[quest.difficulty]++;
});

console.log(`Easy quests: ${difficultyCount.easy} (Expected: ~10)`);
console.log(`Medium quests: ${difficultyCount.medium} (Expected: ~10)`);
console.log(`Hard quests: ${difficultyCount.hard} (Expected: ~5)`);
console.log(`Pass: ${difficultyCount.easy >= 8 && difficultyCount.easy <= 12 && difficultyCount.medium >= 8 && difficultyCount.medium <= 12 && difficultyCount.hard >= 3 && difficultyCount.hard <= 7 ? 'YES' : 'NO'}`);

// Test 3: Verify all quests have required fields
console.log('\n=== Test 3: Required Fields ===');
let allFieldsValid = true;
DAILY_QUEST_POOL.forEach((quest, index) => {
  if (!quest.title || !quest.description || !quest.difficulty || !quest.statsReward || !quest.selectedSkills) {
    console.log(`Quest ${index} missing required fields`);
    allFieldsValid = false;
  }
});
console.log(`All quests have required fields: ${allFieldsValid ? 'YES' : 'NO'}`);

// Test 4: Test random selection
console.log('\n=== Test 4: Random Selection ===');
const selectedQuests = selectDailyQuests();
console.log(`Selected quests: ${selectedQuests.length} (Expected: 5)`);
console.log(`No duplicates: ${new Set(selectedQuests.map(q => q.title)).size === 5 ? 'YES' : 'NO'}`);

// Test 5: Test quest preparation for user
console.log('\n=== Test 5: Quest Preparation ===');
const testUserId = '507f1f77bcf86cd799439011';
const preparedQuests = prepareDailyQuests(testUserId);
console.log(`Prepared quests: ${preparedQuests.length} (Expected: 5)`);
console.log(`All have userId: ${preparedQuests.every(q => q.userId === testUserId) ? 'YES' : 'NO'}`);
console.log(`All have type: 'daily': ${preparedQuests.every(q => q.type === 'daily') ? 'YES' : 'NO'}`);
console.log(`All have xpReward: ${preparedQuests.every(q => q.xpReward > 0) ? 'YES' : 'NO'}`);

// Test 6: Test multiple selections for variety
console.log('\n=== Test 6: Variety Test ===');
const selections = [];
for (let i = 0; i < 5; i++) {
  selections.push(selectDailyQuests());
}

const allTitles = selections.flat().map(q => q.title);
const uniqueTitles = new Set(allTitles);
console.log(`Total quests selected across 5 rounds: ${allTitles.length}`);
console.log(`Unique quests: ${uniqueTitles.size}`);
console.log(`Variety exists: ${uniqueTitles.size > 5 ? 'YES' : 'NO'}`);

console.log('\n=== Test Complete ===');
