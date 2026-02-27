/**
 * Runtime Adversarial Validation — Pure Logic Tests
 * Exercises scenarios 1-4 without a browser by stubbing DOM/localStorage.
 * Run: node tests/runtime-audit.js
 */

// ── Stubs for browser globals ──────────────────────────────────────────────
const _store = {};
global.localStorage = {
    getItem: (k) => _store[k] || null,
    setItem: (k, v) => { _store[k] = v; },
    removeItem: (k) => { delete _store[k]; },
};
global.document = {
    getElementById: () => null,
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener: () => {},
    hidden: false,
};
global.window = { addEventListener: () => {} };
global.navigator = {};

// ── Load source (evaluates CONFIG, RIDDLES_POOL, RIDDLES_ALTERNATE, GameState, AuthManager) ──
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

// We only need up to the end of GameState (before Elements which needs real DOM).
// Extract by evaluating the source up to "const Elements" via Function wrapper.
const cutoff = src.indexOf('const Elements');
if (cutoff === -1) { console.error('FAIL: could not find "const Elements" marker'); process.exit(1); }
const logicSrc = src.substring(0, cutoff);

// Evaluate in an isolated scope, returning the objects we need.
const mod = new Function(`
    ${logicSrc}
    return { CONFIG, RIDDLES_POOL, RIDDLES_ALTERNATE, GameState, AuthManager };
`)();

const { CONFIG, RIDDLES_POOL, RIDDLES_ALTERNATE, GameState } = mod;

// ── Test helpers ───────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, label) {
    if (condition) {
        passed++;
    } else {
        failed++;
        console.error(`  FAIL: ${label}`);
    }
}

function section(title) { console.log(`\n=== ${title} ===`); }

// Helper: play a full round, answering all questions correctly (or not)
function playRound(gs, roundNum, allCorrect = true, useHints = 0, isReplay = false) {
    gs.startRound(roundNum, isReplay);
    for (let q = 0; q < CONFIG.QUESTIONS_PER_ROUND; q++) {
        const question = gs.getCurrentQuestion();
        const answer = allCorrect ? question.answer : 'wrong_answer_xyz';
        const hint = q < useHints;
        gs.submitAnswer(answer, hint);
    }
}

// ── SCENARIO 1: Play all 5 rounds in sequence ─────────────────────────────
section('Scenario 1: Play all 5 rounds in sequence');

GameState.resetGame();
GameState.init();

for (let r = 1; r <= CONFIG.TOTAL_ROUNDS; r++) {
    playRound(GameState, r, true, 0, false);
}

const totalAfter5 = GameState.getTotalScore();
const expectedPerfect = CONFIG.TOTAL_ROUNDS * ((CONFIG.QUESTIONS_PER_ROUND * CONFIG.POINTS_PER_CORRECT) + CONFIG.PERFECT_ROUND_BONUS);
assert(totalAfter5 === expectedPerfect, `Perfect 5-round total should be ${expectedPerfect}, got ${totalAfter5}`);
assert(totalAfter5 === CONFIG.MAX_TOTAL_SCORE, `Total should match CONFIG.MAX_TOTAL_SCORE (${CONFIG.MAX_TOTAL_SCORE}), got ${totalAfter5}`);
assert(GameState.overallProgress.totalRoundsCompleted === 5, `totalRoundsCompleted should be 5, got ${GameState.overallProgress.totalRoundsCompleted}`);
assert(GameState.overallProgress.totalCorrect === 50, `totalCorrect should be 50, got ${GameState.overallProgress.totalCorrect}`);
assert(GameState.overallProgress.totalQuestions === 50, `totalQuestions should be 50, got ${GameState.overallProgress.totalQuestions}`);
assert(GameState.overallProgress.totalHintsUsed === 0, `totalHintsUsed should be 0, got ${GameState.overallProgress.totalHintsUsed}`);
assert(GameState.overallProgress.bestScore === expectedPerfect, `bestScore should be ${expectedPerfect}, got ${GameState.overallProgress.bestScore}`);

const tier = GameState.getPerformanceTier(totalAfter5);
assert(tier.tier === 'S+', `Performance tier at max score should be S+, got ${tier.tier}`);
console.log(`  Total: ${totalAfter5} | Tier: ${tier.tier} | Rounds: ${GameState.overallProgress.totalRoundsCompleted}`);

// Verify each round score individually
for (let r = 1; r <= 5; r++) {
    const rs = GameState.overallProgress.roundScores[r];
    assert(rs && rs.score === 150, `Round ${r} score should be 150, got ${rs ? rs.score : 'missing'}`);
    assert(rs && rs.correct === 10, `Round ${r} correct should be 10, got ${rs ? rs.correct : 'missing'}`);
}

// ── SCENARIO 2: Replay a completed round, confirm aggregates ──────────────
section('Scenario 2: Replay round 3 (with hints), confirm aggregates stay correct');

const scoreBefore = GameState.getTotalScore();
const round3ScoreBefore = GameState.overallProgress.roundScores[3].score;

// Replay round 3 with 3 hints and all correct
playRound(GameState, 3, true, 3, true);

const round3ScoreAfter = GameState.overallProgress.roundScores[3].score;
const expectedR3Replay = (10 * CONFIG.POINTS_PER_CORRECT) + CONFIG.PERFECT_ROUND_BONUS - (3 * Math.abs(CONFIG.POINTS_PER_HINT));
assert(round3ScoreAfter === expectedR3Replay, `Replayed round 3 score should be ${expectedR3Replay}, got ${round3ScoreAfter}`);

const totalAfterReplay = GameState.getTotalScore();
const expectedTotal = scoreBefore - round3ScoreBefore + round3ScoreAfter;
assert(totalAfterReplay === expectedTotal, `Total after replay should be ${expectedTotal}, got ${totalAfterReplay}`);

assert(GameState.overallProgress.totalRoundsCompleted === 5, `totalRoundsCompleted should still be 5 after replay, got ${GameState.overallProgress.totalRoundsCompleted}`);
assert(GameState.overallProgress.totalCorrect === 50, `totalCorrect should still be 50 after replay, got ${GameState.overallProgress.totalCorrect}`);
assert(GameState.overallProgress.totalHintsUsed === 3, `totalHintsUsed should be 3 after replay, got ${GameState.overallProgress.totalHintsUsed}`);

// Call calculateRoundScore 5 more times (simulating re-renders) and confirm idempotency
const snapshotBefore = JSON.stringify(GameState.overallProgress);
for (let i = 0; i < 5; i++) {
    GameState.calculateRoundScore();
}
const snapshotAfter = JSON.stringify(GameState.overallProgress);
// lastPlayed timestamp will differ, so compare without it
const normalize = (s) => JSON.parse(s, (k, v) => k === 'lastPlayed' ? 0 : v);
assert(
    JSON.stringify(normalize(snapshotBefore)) === JSON.stringify(normalize(snapshotAfter)),
    'Calling calculateRoundScore() 5 extra times should not change aggregates (idempotent)'
);
console.log(`  Replay R3 score: ${round3ScoreAfter} | Total: ${totalAfterReplay} | Idempotent: ${JSON.stringify(normalize(snapshotBefore)) === JSON.stringify(normalize(snapshotAfter))}`);

// ── SCENARIO 2b: Replay with all wrong answers ────────────────────────────
section('Scenario 2b: Replay round 1 with all wrong answers');

playRound(GameState, 1, false, 2, true);
const r1After = GameState.overallProgress.roundScores[1];
assert(r1After.score === 0, `Round 1 all-wrong + 2 hints score should be 0 (clamped), got ${r1After.score}`);
assert(r1After.correct === 0, `Round 1 correct should be 0, got ${r1After.correct}`);
assert(GameState.overallProgress.totalCorrect === 40, `totalCorrect should now be 40 (lost 10 from R1), got ${GameState.overallProgress.totalCorrect}`);
console.log(`  R1 replayed wrong: score=${r1After.score}, correct=${r1After.correct}, totalCorrect=${GameState.overallProgress.totalCorrect}`);

// ── SCENARIO 3: Rapid-fire submits (race condition test) ──────────────────
section('Scenario 3: Rapid-fire answer submission');

GameState.resetGame();
GameState.init();
GameState.startRound(1);

// Submit all 10 answers as fast as possible (synchronous, simulates rapid clicks)
const results = [];
for (let q = 0; q < CONFIG.QUESTIONS_PER_ROUND; q++) {
    const question = GameState.getCurrentQuestion();
    results.push(GameState.submitAnswer(question.answer, false));
}

assert(results.filter(r => r === 'next').length === 9, `Should have 9 'next' results, got ${results.filter(r => r === 'next').length}`);
assert(results[9] === 'complete', `Last submit should return 'complete', got ${results[9]}`);
assert(GameState.currentRoundState.userAnswers.length === 10, `Should have exactly 10 answers, got ${GameState.currentRoundState.userAnswers.length}`);

const snapshot = GameState.getCurrentRoundResultsSnapshot();
assert(snapshot.correctCount === 10, `Rapid-fire: all 10 correct, got ${snapshot.correctCount}`);
assert(snapshot.roundScore === 150, `Rapid-fire: round score should be 150, got ${snapshot.roundScore}`);

// Double-submit guard: try submitting an 11th answer — guard should reject it
const extraResult = GameState.submitAnswer('anything', false);
assert(extraResult === 'complete', `11th submit should return 'complete' (guard), got '${extraResult}'`);
assert(GameState.currentRoundState.userAnswers.length === 10, `Answers should still be 10 after 11th submit, got ${GameState.currentRoundState.userAnswers.length}`);
console.log(`  Rapid-fire: ${results.length} submits, answers=${GameState.currentRoundState.userAnswers.length}, score=${snapshot.roundScore}`);

// ── SCENARIO 4: Mid-round state recovery (simulate reload) ───────────────
section('Scenario 4: Mid-round state recovery via localStorage');

GameState.resetGame();
GameState.init();
GameState.startRound(2);

// Answer 5 of 10 questions
for (let q = 0; q < 5; q++) {
    const question = GameState.getCurrentQuestion();
    GameState.submitAnswer(question.answer, q === 2); // use hint on Q3
}
GameState.saveToStorage();

const savedRound = GameState.currentRound;
const savedQuestionIndex = GameState.currentQuestionIndex;
const savedAnswersCount = GameState.currentRoundState.userAnswers.length;
const savedHints = GameState.currentRoundState.hintsUsed;

// Simulate a "reload" by reading from localStorage into a fresh GameState-like object
const rawData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
assert(rawData !== null, 'Saved data should exist in localStorage');
assert(rawData.currentRound === savedRound, `Stored currentRound should be ${savedRound}, got ${rawData.currentRound}`);
assert(rawData.overallProgress !== undefined, 'Stored overallProgress should exist');

// Re-init GameState (simulates page reload)
GameState.currentRound = 1;
GameState.currentQuestionIndex = 0;
GameState.overallProgress = { roundScores: {}, bestScore: 0 };
GameState.loadFromStorage();

assert(GameState.currentRound === savedRound, `After reload, currentRound should be ${savedRound}, got ${GameState.currentRound}`);

// Note: currentRoundState (the in-progress round) is NOT persisted by the current save logic.
// This is a known limitation: only overallProgress and currentRound are saved.
// Verify the saved aggregates are intact.
assert(GameState.overallProgress.roundScores !== undefined, 'roundScores should be restored');
console.log(`  Saved round=${savedRound}, qIdx=${savedQuestionIndex}, answers=${savedAnswersCount}, hints=${savedHints}`);
console.log(`  Restored round=${GameState.currentRound}, overallProgress keys=${Object.keys(GameState.overallProgress).join(',')}`);

// ── SCENARIO 4b: Verify session expiry on reload ─────────────────────────
section('Scenario 4b: Session expiry on stale timestamp');

// Manually set an old timestamp
_store[CONFIG.STORAGE_KEY] = JSON.stringify({
    session: { isLoggedIn: true, isGuest: false, email: 'test@test.com' },
    currentRound: 3,
    roundReplays: {},
    overallProgress: { roundScores: {}, bestScore: 0 },
    timestamp: Date.now() - CONFIG.SESSION_TIMEOUT - 1000, // expired
});
GameState.loadFromStorage();
assert(GameState.session.isLoggedIn === false, 'Expired session should set isLoggedIn=false');
console.log(`  Session expired correctly: isLoggedIn=${GameState.session.isLoggedIn}`);

// ── Summary ───────────────────────────────────────────────────────────────
section('SUMMARY');
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
if (failed > 0) {
    console.error(`\n  *** ${failed} TEST(S) FAILED ***`);
    process.exit(1);
} else {
    console.log('\n  ✓ All logic tests passed.');
    process.exit(0);
}
