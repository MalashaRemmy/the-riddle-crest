// Riddle Crest Game
// Complete working game with 5 rounds

const RIDDLE_SETS = {
    1: [
        { question: "What has keys but can't open locks?", answer: "piano", hint: "Musical instrument with black and white keys" },
        { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps", hint: "Think about walking in sand" },
        { question: "What has a heart that doesn't beat?", answer: "artichoke", hint: "It's a green vegetable with layers" },
        { question: "What has hands but can't clap?", answer: "clock", hint: "It tells time and has numbers" },
        { question: "What has a neck but no head?", answer: "bottle", hint: "You drink from it" },
        { question: "What gets wet while drying?", answer: "towel", hint: "Used after a shower" },
        { question: "What has cities but no houses?", answer: "map", hint: "Used for navigation" },
        { question: "What has to be broken before you can use it?", answer: "egg", hint: "Common breakfast item" },
        { question: "What is full of holes but still holds water?", answer: "sponge", hint: "Used for cleaning" },
        { question: "What has a thumb but is not alive?", answer: "glove", hint: "Worn on hands" }
    ],
    2: [
        { question: "I speak without a mouth and hear without ears. What am I?", answer: "echo", hint: "Sound bouncing in mountains" },
        { question: "What can travel around the world while staying in a corner?", answer: "stamp", hint: "Used for sending letters" },
        { question: "What has words but never speaks?", answer: "book", hint: "Contains stories" },
        { question: "What has a thumb and four fingers but is not a hand?", answer: "glove", hint: "Hand covering" },
        { question: "What can you catch but not throw?", answer: "cold", hint: "Common illness" },
        { question: "What goes up but never comes down?", answer: "age", hint: "Increases with time" },
        { question: "What has one eye but can't see?", answer: "needle", hint: "Used for sewing" },
        { question: "What is always in front of you but can't be seen?", answer: "future", hint: "What's yet to come" },
        { question: "The more of this there is, the less you see. What is it?", answer: "darkness", hint: "Absence of light" },
        { question: "What can run but never walks?", answer: "river", hint: "Flowing water" }
    ],
    3: [
        { question: "I'm light as a feather but hard to hold. What am I?", answer: "breath", hint: "Comes from lungs" },
        { question: "What has a bed but never sleeps?", answer: "river", hint: "Has banks" },
        { question: "What comes once in a minute, twice in a moment?", answer: "letter m", hint: "Look at spelling" },
        { question: "What gets bigger the more you take away?", answer: "hole", hint: "Empty space" },
        { question: "What has a bank but no money?", answer: "river", hint: "Geography feature" },
        { question: "What can you break without touching?", answer: "promise", hint: "Verbal commitment" },
        { question: "What has a face but no eyes, hands but no arms?", answer: "clock", hint: "Time device" },
        { question: "What has many needles but doesn't sew?", answer: "pine tree", hint: "Evergreen tree" },
        { question: "What can you hold in right hand but never in left?", answer: "left elbow", hint: "Anatomy" },
        { question: "What gets wetter as it dries?", answer: "towel", hint: "Bathroom item" }
    ],
    4: [
        { question: "What is so fragile that saying its name breaks it?", answer: "silence", hint: "No sound" },
        { question: "What can you keep after giving to someone?", answer: "your word", hint: "Promise" },
        { question: "What goes through cities but never moves?", answer: "road", hint: "Path for travel" },
        { question: "What has a bottom at the top?", answer: "leg", hint: "Body part" },
        { question: "What has a head, a tail, but no body?", answer: "coin", hint: "Money" },
        { question: "What belongs to you but others use it more?", answer: "your name", hint: "How people call you" },
        { question: "What starts with e, ends with e, but has one letter?", answer: "envelope", hint: "For letters" },
        { question: "What can fill a room but takes no space?", answer: "light", hint: "Makes things visible" },
        { question: "What has keys but no locks?", answer: "keyboard", hint: "Computer input" },
        { question: "What is always coming but never arrives?", answer: "tomorrow", hint: "Day after today" }
    ],
    5: [
        { question: "What has an eye but cannot see?", answer: "needle", hint: "Sewing tool" },
        { question: "What runs but never walks, murmurs but never talks?", answer: "river", hint: "Flows to sea" },
        { question: "What has a ring but no finger?", answer: "telephone", hint: "Communication device" },
        { question: "The more there is, the less you see. What is it?", answer: "darkness", hint: "Opposite of light" },
        { question: "What can travel the world without leaving corner?", answer: "stamp", hint: "Postal item" },
        { question: "What has a heart that doesn't beat?", answer: "artichoke", hint: "Vegetable" },
        { question: "What has a thumb and four fingers but not hand?", answer: "glove", hint: "Winter wear" },
        { question: "What can you break without touching?", answer: "promise", hint: "Commitment" },
        { question: "What has keys but no locks, space but no room?", answer: "keyboard", hint: "Typing device" },
        { question: "What is always coming but never arrives?", answer: "tomorrow", hint: "Future day" }
    ]
};

class Game {
    constructor() {
        this.currentRound = 1;
        this.currentQuestion = 0;
        this.score = 0;
        this.hintsUsed = 0;
        this.roundScores = {};
        this.state = 'intro';
    }

    startRound() {
        this.currentQuestion = 0;
        this.hintsUsed = 0;
        this.state = 'playing';
        this.render();
    }

    submitAnswer() {
        const input = document.getElementById('answer-input');
        const answer = input.value.trim().toLowerCase();
        
        if (!answer) {
            this.showMessage('Please enter an answer!', 'error');
            return;
        }

        const currentRiddle = this.getCurrentRiddle();
        const isCorrect = answer === currentRiddle.answer;
        
        if (isCorrect) {
            this.score += 10;
            this.showMessage('Correct! +10 points', 'success');
        } else {
            this.showMessage(`Incorrect. The answer was: ${currentRiddle.answer}`, 'error');
        }

        // Deduct for hints used in this question
        if (document.getElementById('hint-display').style.display === 'block') {
            this.score -= 2;
            this.hintsUsed++;
        }

        this.currentQuestion++;

        if (this.currentQuestion >= 10) {
            this.endRound();
        } else {
            input.value = '';
            this.render();
        }
    }

    useHint() {
        const hintDisplay = document.getElementById('hint-display');
        const currentRiddle = this.getCurrentRiddle();
        
        hintDisplay.innerHTML = `<strong>💡 Hint:</strong> ${currentRiddle.hint}`;
        hintDisplay.style.display = 'block';
        
        // Disable hint button
        document.getElementById('hint-btn').disabled = true;
    }

    getCurrentRiddle() {
        return RIDDLE_SETS[this.currentRound][this.currentQuestion];
    }

    endRound() {
        this.roundScores[this.currentRound] = {
            score: this.score,
            correct: Math.floor(this.score / 10),
            hints: this.hintsUsed
        };
        
        this.state = 'roundComplete';
        this.render();
    }

    nextRound() {
        if (this.currentRound < 5) {
            this.currentRound++;
            this.startRound();
        } else {
            this.state = 'finalResults';
            this.render();
        }
    }

    replayRound() {
        this.startRound();
    }

    showMessage(text, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    render() {
        const app = document.getElementById('app');
        
        if (this.state === 'intro') {
            app.innerHTML = `
                <div class="screen active">
                    <div class="card">
                        <h1><i class="fas fa-crown"></i> Riddle Crest</h1>
                        <div class="instructions">
                            <h2>🧠 Brain Challenge</h2>
                            <ul>
                                <li><strong>5 Rounds</strong> of increasing difficulty</li>
                                <li><strong>10 riddles</strong> per round (50 total)</li>
                                <li><strong>+10 points</strong> for each correct answer</li>
                                <li><strong>-2 points</strong> for each hint used</li>
                                <li><strong>New riddles</strong> each round prevent memorization</li>
                            </ul>
                        </div>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 1.2rem; margin-bottom: 20px;">
                                Round: <strong>${this.currentRound}/5</strong> | 
                                Total Score: <strong>${this.score}</strong>
                            </div>
                        </div>
                        <button class="btn" onclick="game.startRound()">
                            <i class="fas fa-play"></i> Start Round ${this.currentRound}
                        </button>
                    </div>
                </div>
            `;
        } else if (this.state === 'playing') {
            const riddle = this.getCurrentRiddle();
            const progress = ((this.currentQuestion + 1) / 10) * 100;
            
            app.innerHTML = `
                <div class="screen active">
                    <div class="card">
                        <div class="progress">
                            <span>Round: ${this.currentRound}/5</span>
                            <span>Question: ${this.currentQuestion + 1}/10</span>
                            <span>Score: ${this.score}</span>
                            <span>Hints: ${this.hintsUsed}</span>
                        </div>
                        
                        <div class="riddle-container">
                            <h2>Riddle #${this.currentQuestion + 1}</h2>
                            <div id="riddle-text">${riddle.question}</div>
                            
                            <div id="hint-display" style="display: none;"></div>
                            
                            <input type="text" id="answer-input" placeholder="Type your answer..." autocomplete="off">
                            
                            <div style="display: flex; gap: 10px; margin: 20px 0;">
                                <button class="btn" onclick="game.submitAnswer()">
                                    <i class="fas fa-paper-plane"></i> Submit Answer
                                </button>
                                <button class="btn btn-secondary" id="hint-btn" onclick="game.useHint()">
                                    <i class="fas fa-lightbulb"></i> Use Hint (-2 pts)
                                </button>
                            </div>
                            
                            <div style="margin-top: 20px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                                <div style="height: 100%; width: ${progress}%; background: linear-gradient(90deg, #4361ee, #4cc9f0); border-radius: 3px; transition: width 0.5s;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Focus input
            setTimeout(() => {
                document.getElementById('answer-input').focus();
            }, 100);
            
        } else if (this.state === 'roundComplete') {
            const correct = Math.floor(this.score / 10);
            const roundScore = this.score - (Object.values(this.roundScores).slice(0, -1).reduce((a, b) => a + b.score, 0) || 0);
            
            app.innerHTML = `
                <div class="screen active">
                    <div class="card">
                        <h1><i class="fas fa-trophy"></i> Round ${this.currentRound} Complete!</h1>
                        
                        <div class="score-display">
                            <div id="score-circle">
                                <div id="final-score">${roundScore}</div>
                                <div class="score-label">/ 100</div>
                            </div>
                            <h2>${correct === 10 ? 'Perfect Round! 🎉' : 'Great Job!'}</h2>
                        </div>
                        
                        <div class="results-grid">
                            <div class="result-item">
                                <h3>Correct Answers</h3>
                                <p style="font-size: 2rem; font-weight: bold; color: #4cc9f0;">${correct}/10</p>
                            </div>
                            <div class="result-item">
                                <h3>Hints Used</h3>
                                <p style="font-size: 2rem; font-weight: bold; color: #ffd700;">${this.hintsUsed}</p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0;">
                            ${this.currentRound < 5 ? `
                                <button class="btn" onclick="game.nextRound()">
                                    <i class="fas fa-forward"></i> Continue to Round ${this.currentRound + 1}
                                </button>
                            ` : `
                                <button class="btn" onclick="game.state = 'finalResults'; game.render()">
                                    <i class="fas fa-flag-checkered"></i> View Final Results
                                </button>
                            `}
                            
                            <button class="btn btn-secondary" onclick="game.replayRound()">
                                <i class="fas fa-redo"></i> Replay This Round
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else if (this.state === 'finalResults') {
            const totalScore = this.score;
            const totalCorrect = Math.floor(totalScore / 10);
            const performance = totalScore >= 400 ? 'Riddle Master! 🏆' :
                               totalScore >= 300 ? 'Expert Thinker! 🌟' :
                               totalScore >= 200 ? 'Good Job! 👍' :
                               totalScore >= 100 ? 'Keep Practicing! 📚' : 'Beginner Level';
            
            app.innerHTML = `
                <div class="screen active">
                    <div class="card">
                        <h1><i class="fas fa-award"></i> Challenge Complete!</h1>
                        
                        <div class="score-display">
                            <div id="score-circle" style="background: linear-gradient(135deg, #ffd700, #ff5722);">
                                <div id="final-score" style="font-size: 3rem;">${totalScore}</div>
                                <div class="score-label">/ 500</div>
                            </div>
                            <h2 style="color: #ffd700;">${performance}</h2>
                            <p style="color: #4cc9f0; font-size: 1.2rem;">
                                You answered ${totalCorrect} out of 50 riddles correctly
                            </p>
                        </div>
                        
                        <div class="results-grid">
                            <div class="result-item">
                                <h3><i class="fas fa-check-circle"></i> Total Correct</h3>
                                <p style="font-size: 2rem;">${totalCorrect}/50</p>
                            </div>
                            <div class="result-item">
                                <h3><i class="fas fa-lightbulb"></i> Total Hints</h3>
                                <p style="font-size: 2rem;">${Object.values(this.roundScores).reduce((a, b) => a + b.hints, 0)}</p>
                            </div>
                            <div class="result-item">
                                <h3><i class="fas fa-star"></i> Best Round</h3>
                                <p style="font-size: 2rem;">
                                    ${Math.max(...Object.values(this.roundScores).map(r => r.score))}
                                </p>
                            </div>
                            <div class="result-item">
                                <h3><i class="fas fa-chart-line"></i> Performance</h3>
                                <p style="font-size: 2rem;">
                                    ${Math.round((totalScore / 500) * 100)}%
                                </p>
                            </div>
                        </div>
                        
                        <div style="margin: 30px 0;">
                            <div style="background: rgba(255, 152, 0, 0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #ff9800; margin-bottom: 20px;">
                                <i class="fas fa-exclamation-circle"></i>
                                Starting over will reset all progress and use new riddles.
                            </div>
                            
                            <button class="btn" onclick="game.currentRound = 1; game.score = 0; game.roundScores = {}; game.state = 'intro'; game.render()">
                                <i class="fas fa-rocket"></i> Start Fresh Challenge
                            </button>
                            
                            <button class="btn btn-secondary" onclick="game.currentRound = 1; game.state = 'intro'; game.render()">
                                <i class="fas fa-home"></i> Back to Main Menu
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize game
const game = new Game();

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .message {
        font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);

// Start the game
game.render();
