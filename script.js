// ============================================================================
// GAME DATA - All riddles stored here
// ============================================================================
const riddles = [
    {
        id: 1,
        question: "What has keys but can't open locks?",
        answer: "piano",
        hint: "It makes music but isn't an instrument you blow into",
        difficulty: 1
    },
    {
        id: 2,
        question: "The more you take, the more you leave behind. What am I?",
        answer: "footsteps",
        hint: "Think about walking through soft ground",
        difficulty: 1
    },
    {
        id: 3,
        question: "What has a heart that doesn't beat?",
        answer: "artichoke",
        hint: "It's a vegetable with layers",
        difficulty: 2
    },
    {
        id: 4,
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: "echo",
        hint: "Think about sound bouncing in mountains",
        difficulty: 2
    },
    {
        id: 5,
        question: "What has cities, but no houses; forests, but no trees; and rivers, but no water?",
        answer: "map",
        hint: "You might use this while traveling",
        difficulty: 3
    },
    {
        id: 6,
        question: "What can travel around the world while staying in a corner?",
        answer: "stamp",
        hint: "Think about sending letters",
        difficulty: 3
    },
    {
        id: 7,
        question: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?",
        answer: "breath",
        hint: "It's essential for life but invisible",
        difficulty: 4
    },
    {
        id: 8,
        question: "The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never knows they're using it. What is it?",
        answer: "coffin",
        hint: "Think about the end of life",
        difficulty: 4
    },
    {
        id: 9,
        question: "What has a neck but no head?",
        answer: "bottle",
        hint: "You might find liquid in it",
        difficulty: 5
    },
    {
        id: 10,
        question: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?",
        answer: "river",
        hint: "Look outside for flowing water",
        difficulty: 5
    }
];

// ============================================================================
// GAME STATE MANAGEMENT
// ============================================================================
const gameState = {
    currentRiddleIndex: 0,
    hintsUsed: 0,
    userAnswers: [], // Array of objects: {riddleId, userAnswer, usedHint}
    gamePhase: 'intro', // 'intro', 'playing', 'finished'
    
    // Initialize or reset the game state
    init: function() {
        this.currentRiddleIndex = 0;
        this.hintsUsed = 0;
        this.userAnswers = [];
        this.gamePhase = 'intro';
    },
    
    // Save user's answer for current riddle
    saveAnswer: function(userAnswer, usedHint) {
        const currentRiddle = riddles[this.currentRiddleIndex];
        this.userAnswers.push({
            riddleId: currentRiddle.id,
            userAnswer: userAnswer.trim().toLowerCase(),
            usedHint: usedHint
        });
    },
    
    // Move to next riddle
    nextRiddle: function() {
        if (this.currentRiddleIndex < riddles.length - 1) {
            this.currentRiddleIndex++;
            return true;
        }
        return false; // Game is complete
    },
    
    // Move to previous riddle (for review)
    previousRiddle: function() {
        if (this.currentRiddleIndex > 0) {
            this.currentRiddleIndex--;
            return true;
        }
        return false;
    },
    
    // Calculate final score
    calculateScore: function() {
        let correctAnswers = 0;
        
        this.userAnswers.forEach((answer, index) => {
            const correctAnswer = riddles[index].answer;
            if (answer.userAnswer === correctAnswer) {
                correctAnswers++;
            }
        });
        
        // Each correct answer = 10 points, minus 2 points per hint used
        let score = (correctAnswers * 10) - (this.hintsUsed * 2);
        return Math.max(0, Math.min(100, score)); // Clamp between 0-100
    },
    
    // Get performance interpretation
    getPerformance: function(score) {
        if (score >= 90) return {
            title: "Riddle Master! 🏆",
            message: "Outstanding! Your wit and wisdom are unparalleled.",
            tier: "S+"
        };
        if (score >= 75) return {
            title: "Clever Thinker! 🌟",
            message: "Excellent work! You've got a sharp mind.",
            tier: "A"
        };
        if (score >= 60) return {
            title: "Good Job! 👍",
            message: "Solid performance! You understand the patterns.",
            tier: "B"
        };
        if (score >= 40) return {
            title: "On Your Way! 📚",
            message: "Good effort! With more practice, you'll excel.",
            tier: "C"
        };
        return {
            title: "Keep Practicing! 💪",
            message: "Riddles take time to master. Try again!",
            tier: "D"
        };
    }
};

// ============================================================================
// DOM ELEMENTS - Cache all elements we'll manipulate
// ============================================================================
const elements = {
    // Screens
    introScreen: document.getElementById('intro-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    // Intro screen elements
    startBtn: document.getElementById('start-btn'),
    
    // Game screen elements
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    hintCount: document.getElementById('hint-count'),
    scorePreview: document.getElementById('score-preview'),
    riddleQuestion: document.getElementById('riddle-question'),
    hintBtn: document.getElementById('hint-btn'),
    hintDisplay: document.getElementById('hint-display'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    
    // Results screen elements
    finalScore: document.getElementById('final-score'),
    performanceTitle: document.getElementById('performance-title'),
    performanceDescription: document.getElementById('performance-description'),
    correctCount: document.getElementById('correct-count'),
    finalHints: document.getElementById('final-hints'),
    hintPenalty: document.getElementById('hint-penalty'),
    performanceTier: document.getElementById('performance-tier'),
    performanceMessage: document.getElementById('performance-message'),
    answersList: document.getElementById('answers-list'),
    playAgainBtn: document.getElementById('play-again-btn'),
    viewIntroBtn: document.getElementById('view-intro-btn')
};

// ============================================================================
// UI RENDER FUNCTIONS
// ============================================================================
const renderer = {
    // Switch between game screens
    showScreen: function(screenName) {
        // Hide all screens
        elements.introScreen.classList.remove('active');
        elements.gameScreen.classList.remove('active');
        elements.resultsScreen.classList.remove('active');
        
        // Show requested screen
        if (screenName === 'intro') {
            elements.introScreen.classList.add('active');
        } else if (screenName === 'playing') {
            elements.gameScreen.classList.add('active');
            this.updateGameScreen();
        } else if (screenName === 'finished') {
            elements.resultsScreen.classList.add('active');
            this.updateResultsScreen();
        }
    },
    
    // Update all game screen elements based on current state
    updateGameScreen: function() {
        const currentRiddle = riddles[gameState.currentRiddleIndex];
        const progressPercentage = ((gameState.currentRiddleIndex + 1) / riddles.length) * 100;
        
        // Update progress bar and text
        elements.progressFill.style.width = `${progressPercentage}%`;
        elements.progressText.textContent = `Riddle ${gameState.currentRiddleIndex + 1}/${riddles.length}`;
        
        // Update stats
        elements.hintCount.textContent = gameState.hintsUsed;
        elements.scorePreview.textContent = gameState.calculateScore();
        
        // Update riddle question
        elements.riddleQuestion.textContent = currentRiddle.question;
        
        // Reset hint display
        elements.hintDisplay.textContent = '';
        elements.hintDisplay.classList.remove('show');
        
        // Clear input
        elements.answerInput.value = '';
        elements.answerInput.focus();
        
        // Update navigation buttons
        elements.prevBtn.disabled = gameState.currentRiddleIndex === 0;
        elements.nextBtn.disabled = gameState.currentRiddleIndex === riddles.length - 1;
        
        // Check if user has already answered this riddle
        const existingAnswer = gameState.userAnswers[gameState.currentRiddleIndex];
        if (existingAnswer) {
            elements.answerInput.value = existingAnswer.userAnswer;
        }
    },
    
    // Update results screen with final calculations
    updateResultsScreen: function() {
        const score = gameState.calculateScore();
        const performance = gameState.getPerformance(score);
        
        // Calculate correct answers
        let correctCount = 0;
        gameState.userAnswers.forEach((answer, index) => {
            if (answer.userAnswer === riddles[index].answer) {
                correctCount++;
            }
        });
        
        // Update score display
        elements.finalScore.textContent = score;
        elements.performanceTitle.textContent = performance.title;
        elements.performanceDescription.textContent = performance.message;
        elements.correctCount.textContent = correctCount;
        elements.finalHints.textContent = gameState.hintsUsed;
        elements.hintPenalty.textContent = `-${gameState.hintsUsed * 2}`;
        elements.performanceTier.textContent = performance.tier;
        elements.performanceMessage.textContent = performance.message;
        
        // Render answer review
        this.renderAnswersReview();
    },
    
    // Render the list of user answers with correct/incorrect status
    renderAnswersReview: function() {
        elements.answersList.innerHTML = '';
        
        gameState.userAnswers.forEach((userAnswer, index) => {
            const riddle = riddles[index];
            const isCorrect = userAnswer.userAnswer === riddle.answer;
            
            const answerItem = document.createElement('div');
            answerItem.className = 'answer-item';
            
            answerItem.innerHTML = `
                <div>
                    <strong>Riddle ${index + 1}:</strong> ${riddle.question}
                    <div style="margin-top: 5px; font-size: 0.9em;">
                        Your answer: <em>${userAnswer.userAnswer}</em>
                        ${userAnswer.usedHint ? ' <i class="fas fa-lightbulb" style="color: #ffd700;"></i>' : ''}
                    </div>
                </div>
                <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </div>
            `;
            
            elements.answersList.appendChild(answerItem);
        });
    },
    
    // Show hint for current riddle
    showHint: function() {
        const currentRiddle = riddles[gameState.currentRiddleIndex];
        elements.hintDisplay.textContent = currentRiddle.hint;
        elements.hintDisplay.classList.add('show');
    }
};

// ============================================================================
// EVENT HANDLERS
// ============================================================================
const eventHandlers = {
    // Start the game
    handleStartGame: function() {
        gameState.init();
        gameState.gamePhase = 'playing';
        renderer.showScreen('playing');
    },
    
    // Submit answer for current riddle
    handleSubmitAnswer: function() {
        const answer = elements.answerInput.value.trim();
        
        if (!answer) {
            alert("Please enter an answer before submitting!");
            return;
        }
        
        // Check if user used hint for this riddle
        const usedHint = elements.hintDisplay.classList.contains('show');
        
        // Save answer to state
        gameState.saveAnswer(answer, usedHint);
        
        // Reset hint display for next question
        elements.hintDisplay.classList.remove('show');
        
        // Check if game is complete
        if (gameState.currentRiddleIndex === riddles.length - 1) {
            // Game is finished
            gameState.gamePhase = 'finished';
            renderer.showScreen('finished');
        } else {
            // Move to next riddle
            gameState.nextRiddle();
            renderer.updateGameScreen();
        }
    },
    
    // Show hint for current riddle
    handleShowHint: function() {
        // Only count hint if not already shown for this riddle
        if (!elements.hintDisplay.classList.contains('show')) {
            gameState.hintsUsed++;
            elements.hintCount.textContent = gameState.hintsUsed;
            elements.scorePreview.textContent = gameState.calculateScore();
        }
        
        renderer.showHint();
    },
    
    // Navigate to previous riddle
    handlePreviousRiddle: function() {
        if (gameState.previousRiddle()) {
            renderer.updateGameScreen();
        }
    },
    
    // Navigate to next riddle
    handleNextRiddle: function() {
        if (gameState.nextRiddle()) {
            renderer.updateGameScreen();
        }
    },
    
    // Restart the game
    handlePlayAgain: function() {
        gameState.init();
        renderer.showScreen('playing');
    },
    
    // Return to intro screen
    handleViewIntro: function() {
        renderer.showScreen('intro');
    },
    
    // Handle Enter key for answer submission
    handleKeyPress: function(event) {
        if (event.key === 'Enter' && gameState.gamePhase === 'playing') {
            this.handleSubmitAnswer();
        }
    }
};

// ============================================================================
// EVENT LISTENER SETUP
// ============================================================================
function setupEventListeners() {
    // Intro screen
    elements.startBtn.addEventListener('click', () => eventHandlers.handleStartGame());
    
    // Game screen
    elements.submitBtn.addEventListener('click', () => eventHandlers.handleSubmitAnswer());
    elements.hintBtn.addEventListener('click', () => eventHandlers.handleShowHint());
    elements.prevBtn.addEventListener('click', () => eventHandlers.handlePreviousRiddle());
    elements.nextBtn.addEventListener('click', () => eventHandlers.handleNextRiddle());
    elements.answerInput.addEventListener('keypress', (e) => eventHandlers.handleKeyPress(e));
    
    // Results screen
    elements.playAgainBtn.addEventListener('click', () => eventHandlers.handlePlayAgain());
    elements.viewIntroBtn.addEventListener('click', () => eventHandlers.handleViewIntro());
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function initGame() {
    // Setup event listeners
    setupEventListeners();
    
    // Initialize game state
    gameState.init();
    
    // Show intro screen
    renderer.showScreen('intro');
    
    console.log("🎮 The Riddle Crest initialized!");
    console.log("📊 Game State:", gameState);
    console.log("❓ Riddles loaded:", riddles.length);
}

// ============================================================================
// START THE GAME WHEN PAGE LOADS
// ============================================================================
document.addEventListener('DOMContentLoaded', initGame);