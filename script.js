// ============================================
// GLOBAL CONSTANTS & CONFIGURATION
// ============================================
const CONFIG = {
    TOTAL_ROUNDS: 5,
    QUESTIONS_PER_ROUND: 10,
    TOTAL_QUESTIONS: 50,
    POINTS_PER_CORRECT: 10,
    POINTS_PER_HINT: -2,
    PERFECT_ROUND_BONUS: 50,
    MAX_TOTAL_SCORE: 550,
    OTP_LENGTH: 6,
    OTP_TIMEOUT: 60, // seconds
    STORAGE_KEY: 'riddleCrestPro_v1',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

// ============================================
// GAME DATA - 50 RIDDLES (10 per round)
// ============================================
const RIDDLES_POOL = {
    // Round 1: Easy (Difficulty 1-2)
    1: [
        {
            id: 'r1q1', question: "What has keys but can't open locks?", 
            answer: "piano", hint: "It makes music with black and white keys",
            category: "Music", difficulty: 1
        },
        {
            id: 'r1q2', question: "The more you take, the more you leave behind. What am I?", 
            answer: "footsteps", hint: "Think about walking through sand or snow",
            category: "Nature", difficulty: 1
        },
        {
            id: 'r1q3', question: "What has a heart that doesn't beat?", 
            answer: "artichoke", hint: "It's a green vegetable with many leaves",
            category: "Food", difficulty: 2
        },
        {
            id: 'r1q4', question: "I'm tall when I'm young, and I'm short when I'm old. What am I?", 
            answer: "candle", hint: "It provides light and melts over time",
            category: "Objects", difficulty: 2
        },
        {
            id: 'r1q5', question: "What has hands but can't clap?", 
            answer: "clock", hint: "It tells time and has numbers",
            category: "Time", difficulty: 1
        },
        {
            id: 'r1q6', question: "What has a neck but no head?", 
            answer: "bottle", hint: "You drink liquids from it",
            category: "Objects", difficulty: 2
        },
        {
            id: 'r1q7', question: "What gets wet while drying?", 
            answer: "towel", hint: "You use it after a shower",
            category: "Household", difficulty: 1
        },
        {
            id: 'r1q8', question: "What has cities but no houses, forests but no trees, and rivers but no water?", 
            answer: "map", hint: "Used for navigation and geography",
            category: "Geography", difficulty: 2
        },
        {
            id: 'r1q9', question: "What has to be broken before you can use it?", 
            answer: "egg", hint: "Common breakfast item",
            category: "Food", difficulty: 1
        },
        {
            id: 'r1q10', question: "What is full of holes but still holds water?", 
            answer: "sponge", hint: "Used for cleaning and absorbing",
            category: "Household", difficulty: 2
        }
    ],
    
    // Round 2: Medium (Difficulty 3-4)
    2: [
        {
            id: 'r2q1', question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", 
            answer: "echo", hint: "Sound bouncing off surfaces",
            category: "Nature", difficulty: 3
        },
        {
            id: 'r2q2', question: "You see me once in June, twice in November, but not at all in May. What am I?", 
            answer: "letter e", hint: "Look at the spelling of the months",
            category: "Wordplay", difficulty: 4
        },
        {
            id: 'r2q3', question: "What can travel around the world while staying in a corner?", 
            answer: "stamp", hint: "Used for sending mail",
            category: "Objects", difficulty: 3
        },
        {
            id: 'r2q4', question: "What has words but never speaks?", 
            answer: "book", hint: "Contains stories and information",
            category: "Literature", difficulty: 3
        },
        {
            id: 'r2q5', question: "What has a thumb and four fingers but is not alive?", 
            answer: "glove", hint: "Worn on hands for warmth",
            category: "Clothing", difficulty: 3
        },
        {
            id: 'r2q6', question: "What can you catch but not throw?", 
            answer: "cold", hint: "Common illness",
            category: "Health", difficulty: 4
        },
        {
            id: 'r2q7', question: "What goes up but never comes down?", 
            answer: "age", hint: "It increases with time",
            category: "Time", difficulty: 4
        },
        {
            id: 'r2q8', question: "What has one eye but can't see?", 
            answer: "needle", hint: "Used for sewing",
            category: "Tools", difficulty: 3
        },
        {
            id: 'r2q9', question: "What is always in front of you but can't be seen?", 
            answer: "future", hint: "What's yet to come",
            category: "Philosophy", difficulty: 4
        },
        {
            id: 'r2q10', question: "The more of this there is, the less you see. What is it?", 
            answer: "darkness", hint: "Absence of light",
            category: "Science", difficulty: 4
        }
    ],
    
    // Round 3: Hard (Difficulty 5-6)
    3: [
        {
            id: 'r3q1', question: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?", 
            answer: "breath", hint: "Essential for life, comes from lungs",
            category: "Science", difficulty: 5
        },
        {
            id: 'r3q2', question: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?", 
            answer: "river", hint: "Flowing body of water",
            category: "Geography", difficulty: 5
        },
        {
            id: 'r3q3', question: "What comes once in a minute, twice in a moment, but never in a thousand years?", 
            answer: "letter m", hint: "Look at the spelling",
            category: "Wordplay", difficulty: 6
        },
        {
            id: 'r3q4', question: "The person who makes it, sells it. The person who buys it, never uses it. The person who uses it, never knows they're using it. What is it?", 
            answer: "coffin", hint: "Associated with the end of life",
            category: "Mystery", difficulty: 6
        },
        {
            id: 'r3q5', question: "What has many keys but can't open a single lock?", 
            answer: "piano", hint: "Musical instrument with black and white",
            category: "Music", difficulty: 5
        },
        {
            id: 'r3q6', question: "What can fill a room but takes up no space?", 
            answer: "light", hint: "Makes things visible",
            category: "Science", difficulty: 5
        },
        {
            id: 'r3q7', question: "What gets bigger the more you take away?", 
            answer: "hole", hint: "Empty space in something",
            category: "Logic", difficulty: 6
        },
        {
            id: 'r3q8', question: "What has a bank but no money?", 
            answer: "river", hint: "Has sides called banks",
            category: "Geography", difficulty: 5
        },
        {
            id: 'r3q9', question: "What can you break without touching it?", 
            answer: "promise", hint: "Verbal commitment",
            category: "Abstract", difficulty: 6
        },
        {
            id: 'r3q10', question: "What has a face but no eyes, hands but no arms?", 
            answer: "clock", hint: "Tells time with hands",
            category: "Time", difficulty: 5
        }
    ],
    
    // Round 4: Expert (Difficulty 7-8)
    4: [
        {
            id: 'r4q1', question: "What is so fragile that saying its name breaks it?", 
            answer: "silence", hint: "Absence of sound",
            category: "Abstract", difficulty: 7
        },
        {
            id: 'r4q2', question: "What can you keep after giving it to someone?", 
            answer: "your word", hint: "Verbal promise or commitment",
            category: "Philosophy", difficulty: 8
        },
        {
            id: 'r4q3', question: "What goes through cities and fields but never moves?", 
            answer: "road", hint: "Path for travel",
            category: "Geography", difficulty: 7
        },
        {
            id: 'r4q4', question: "What has a bottom at the top?", 
            answer: "leg", hint: "Part of the human body",
            category: "Anatomy", difficulty: 8
        },
        {
            id: 'r4q5', question: "What has a head, a tail, but no body?", 
            answer: "coin", hint: "Used for money",
            category: "Objects", difficulty: 7
        },
        {
            id: 'r4q6', question: "What belongs to you but others use it more than you?", 
            answer: "your name", hint: "How people identify you",
            category: "Personal", difficulty: 8
        },
        {
            id: 'r4q7', question: "What starts with 'e', ends with 'e', but only contains one letter?", 
            answer: "envelope", hint: "Used for sending letters",
            category: "Wordplay", difficulty: 7
        },
        {
            id: 'r4q8', question: "What has many needles but doesn't sew?", 
            answer: "pine tree", hint: "Type of evergreen tree",
            category: "Nature", difficulty: 7
        },
        {
            id: 'r4q9', question: "What can you hold in your right hand but never in your left hand?", 
            answer: "your left elbow", hint: "Think about anatomy",
            category: "Logic", difficulty: 8
        },
        {
            id: 'r4q10', question: "What gets wetter as it dries?", 
            answer: "towel", hint: "Used after bathing",
            category: "Household", difficulty: 7
        }
    ],
    
    // Round 5: Master (Difficulty 9-10)
    5: [
        {
            id: 'r5q1', question: "What has an eye but cannot see?", 
            answer: "needle", hint: "Used for sewing with thread",
            category: "Tools", difficulty: 9
        },
        {
            id: 'r5q2', question: "What runs but never walks, murmurs but never talks, has a bed but never sleeps?", 
            answer: "river", hint: "Flowing water body with banks",
            category: "Nature", difficulty: 9
        },
        {
            id: 'r5q3', question: "What has a ring but no finger?", 
            answer: "telephone", hint: "Communication device",
            category: "Technology", difficulty: 10
        },
        {
            id: 'r5q4', question: "The more there is, the less you see. What is it?", 
            answer: "darkness", hint: "Opposite of light",
            category: "Science", difficulty: 9
        },
        {
            id: 'r5q5', question: "What can travel all around the world without leaving its corner?", 
            answer: "stamp", hint: "Postal item",
            category: "Communication", difficulty: 9
        },
        {
            id: 'r5q6', question: "What has a heart that doesn't beat?", 
            answer: "artichoke", hint: "Edible thistle",
            category: "Food", difficulty: 10
        },
        {
            id: 'r5q7', question: "What has a thumb and four fingers but is not a hand?", 
            answer: "glove", hint: "Hand covering",
            category: "Clothing", difficulty: 9
        },
        {
            id: 'r5q8', question: "What can you break without touching it?", 
            answer: "promise", hint: "Verbal commitment",
            category: "Abstract", difficulty: 10
        },
        {
            id: 'r5q9', question: "What has keys but no locks, space but no room, and you can enter but not go in?", 
            answer: "keyboard", hint: "Computer input device",
            category: "Technology", difficulty: 10
        },
        {
            id: 'r5q10', question: "What is always coming but never arrives?", 
            answer: "tomorrow", hint: "The day after today",
            category: "Time", difficulty: 10
        }
    ]
};

// Alternative riddles for replay (to prevent memorization)
const RIDDLES_ALTERNATE = {
    1: [
        {id: 'r1a1', question: "What has hands but can't clap?", answer: "clock", hint: "Tells time", category: "Time", difficulty: 1},
        {id: 'r1a2', question: "What has a face but no eyes?", answer: "clock", hint: "On the wall", category: "Time", difficulty: 1},
        {id: 'r1a3', question: "What has legs but can't walk?", answer: "table", hint: "Furniture", category: "Objects", difficulty: 2},
        {id: 'r1a4', question: "What has a bed but never sleeps?", answer: "river", hint: "Flowing water", category: "Nature", difficulty: 2},
        {id: 'r1a5', question: "What has teeth but can't bite?", answer: "comb", hint: "For hair", category: "Objects", difficulty: 1},
        {id: 'r1a6', question: "What has a neck but no head?", answer: "bottle", hint: "Container", category: "Objects", difficulty: 2},
        {id: 'r1a7', question: "What has an eye but can't see?", answer: "needle", hint: "For sewing", category: "Tools", difficulty: 2},
        {id: 'r1a8', question: "What has wings but can't fly?", answer: "airplane", hint: "In a hangar", category: "Transport", difficulty: 2},
        {id: 'r1a9', question: "What has a bark but no bite?", answer: "tree", hint: "In forest", category: "Nature", difficulty: 1},
        {id: 'r1a10', question: "What has a foot but no legs?", answer: "ruler", hint: "For measuring", category: "Tools", difficulty: 2}
    ],
    2: [
        {id: 'r2a1', question: "What has a head and a tail but no body?", answer: "coin", hint: "Money", category: "Finance", difficulty: 3},
        {id: 'r2a2', question: "What has a bank but no money?", answer: "river", hint: "Geography", category: "Nature", difficulty: 3},
        {id: 'r2a3', question: "What has a ring but no finger?", answer: "telephone", hint: "Communication", category: "Technology", difficulty: 4},
        {id: 'r2a4', question: "What has a tongue but can't talk?", answer: "shoe", hint: "Footwear", category: "Clothing", difficulty: 3},
        {id: 'r2a5', question: "What has a bed but never sleeps?", answer: "river", hint: "Flowing", category: "Geography", difficulty: 3},
        {id: 'r2a6', question: "What has a face but no eyes, hands but no arms?", answer: "clock", hint: "Time", category: "Objects", difficulty: 4},
        {id: 'r2a7', question: "What has a thumb and four fingers but is not alive?", answer: "glove", hint: "Hand cover", category: "Clothing", difficulty: 3},
        {id: 'r2a8', question: "What has many teeth but can't bite?", answer: "comb", hint: "Grooming", category: "Tools", difficulty: 4},
        {id: 'r2a9', question: "What has a stem but no leaves?", answer: "wine glass", hint: "Drinking", category: "Objects", difficulty: 3},
        {id: 'r2a10', question: "What has a spine but no bones?", answer: "book", hint: "Reading", category: "Literature", difficulty: 4}
    ]
    // Add more alternate rounds as needed
};

// ============================================
// GAME STATE MANAGEMENT
// ============================================
const GameState = {
    // User session
    session: {
        userId: null,
        email: null,
        phone: null,
        isGuest: true,
        isLoggedIn: false,
        sessionStart: null,
        otpVerified: false
    },
    
    // Game progress
    currentRound: 1,
    currentQuestionIndex: 0,
    roundReplays: {}, // Track which alternate set to use for each round
    
    // Round-specific state
    currentRoundState: {
        roundNumber: 1,
        questions: [],
        userAnswers: [],
        hintsUsed: 0,
        startTime: null,
        endTime: null,
        isReplay: false
    },
    
    // Overall progress
    overallProgress: {
        totalRoundsCompleted: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        totalHintsUsed: 0,
        roundScores: {}, // {round: {score, correct, hints, time}}
        bestScore: 0,
        totalPlayTime: 0,
        lastPlayed: null
    },
    
    // Initialize state
    init: function() {
        this.loadFromStorage();
        this.session.sessionStart = Date.now();
        
        if (!this.session.userId) {
            this.session.userId = 'guest_' + Math.random().toString(36).substr(2, 9);
            this.session.isGuest = true;
        }
        
        // Initialize round replays
        for (let i = 1; i <= CONFIG.TOTAL_ROUNDS; i++) {
            if (!this.roundReplays[i]) {
                this.roundReplays[i] = 0; // 0 = original, 1 = first replay, etc.
            }
        }
    },
    
    // Start a new round
    startRound: function(roundNumber, isReplay = false) {
        this.currentRound = roundNumber;
        this.currentQuestionIndex = 0;
        
        // Determine which question set to use
        const replayCount = this.roundReplays[roundNumber] || 0;
        const questionSet = isReplay && RIDDLES_ALTERNATE[roundNumber] 
            ? RIDDLES_ALTERNATE[roundNumber] 
            : RIDDLES_POOL[roundNumber];
        
        // Shuffle questions for this round
        this.currentRoundState = {
            roundNumber,
            questions: this.shuffleArray([...questionSet]),
            userAnswers: [],
            hintsUsed: 0,
            startTime: Date.now(),
            endTime: null,
            isReplay: isReplay || replayCount > 0
        };
        
        // Increment replay counter if this is a replay
        if (isReplay) {
            this.roundReplays[roundNumber] = (this.roundReplays[roundNumber] || 0) + 1;
        }
        
        this.saveToStorage();
    },
    
    // Submit answer for current question
    submitAnswer: function(answer, usedHint = false) {
        const currentQuestion = this.getCurrentQuestion();
        
        const answerObj = {
            questionId: currentQuestion.id,
            userAnswer: answer.trim().toLowerCase(),
            correctAnswer: currentQuestion.answer,
            isCorrect: answer.trim().toLowerCase() === currentQuestion.answer,
            usedHint: usedHint,
            timeTaken: Date.now() - this.currentRoundState.startTime,
            questionIndex: this.currentQuestionIndex
        };
        
        this.currentRoundState.userAnswers.push(answerObj);
        
        if (usedHint) {
            this.currentRoundState.hintsUsed++;
        }
        
        // Move to next question
        if (this.currentQuestionIndex < CONFIG.QUESTIONS_PER_ROUND - 1) {
            this.currentQuestionIndex++;
            this.saveToStorage();
            return 'next';
        } else {
            // Round complete
            this.currentRoundState.endTime = Date.now();
            this.calculateRoundScore();
            this.saveToStorage();
            return 'complete';
        }
    },
    
    // Get current question
    getCurrentQuestion: function() {
        return this.currentRoundState.questions[this.currentQuestionIndex];
    },
    
    // Calculate score for current round
    calculateRoundScore: function() {
        const round = this.currentRoundState;
        let correctCount = 0;
        
        round.userAnswers.forEach(answer => {
            if (answer.isCorrect) correctCount++;
        });
        
        const baseScore = correctCount * CONFIG.POINTS_PER_CORRECT;
        const hintPenalty = round.hintsUsed * Math.abs(CONFIG.POINTS_PER_HINT);
        let roundScore = baseScore - hintPenalty;
        
        // Add perfect round bonus
        if (correctCount === CONFIG.QUESTIONS_PER_ROUND) {
            roundScore += CONFIG.PERFECT_ROUND_BONUS;
        }
        
        // Ensure score is non-negative
        roundScore = Math.max(0, roundScore);
        
        // Update overall progress
        this.overallProgress.roundScores[round.roundNumber] = {
            score: roundScore,
            correct: correctCount,
            hints: round.hintsUsed,
            time: round.endTime - round.startTime,
            isReplay: round.isReplay
        };
        
        this.overallProgress.totalCorrect += correctCount;
        this.overallProgress.totalQuestions += CONFIG.QUESTIONS_PER_ROUND;
        this.overallProgress.totalHintsUsed += round.hintsUsed;
        this.overallProgress.totalRoundsCompleted++;
        this.overallProgress.totalPlayTime += (round.endTime - round.startTime);
        this.overallProgress.lastPlayed = Date.now();
        
        // Update best score
        const totalScore = this.getTotalScore();
        if (totalScore > this.overallProgress.bestScore) {
            this.overallProgress.bestScore = totalScore;
        }
        
        return {
            roundScore,
            correctCount,
            hintCount: round.hintsUsed,
            hintPenalty,
            perfectBonus: correctCount === CONFIG.QUESTIONS_PER_ROUND ? CONFIG.PERFECT_ROUND_BONUS : 0,
            timeTaken: round.endTime - round.startTime
        };
    },
    
    // Get total cumulative score
    getTotalScore: function() {
        let total = 0;
        Object.values(this.overallProgress.roundScores).forEach(round => {
            total += round.score;
        });
        return total;
    },
    
    // Get performance tier
    getPerformanceTier: function(totalScore) {
        const percentage = (totalScore / (CONFIG.TOTAL_ROUNDS * 100)) * 100;
        
        if (percentage >= 90) return { tier: 'S+', title: 'Riddle Master', color: '#ffd700', message: 'Legendary! You have mastered the art of riddles.' };
        if (percentage >= 80) return { tier: 'S', title: 'Grandmaster', color: '#c0c0c0', message: 'Outstanding performance across all rounds!' };
        if (percentage >= 70) return { tier: 'A', title: 'Expert Thinker', color: '#cd7f32', message: 'Excellent analytical skills demonstrated.' };
        if (percentage >= 60) return { tier: 'B', title: 'Skilled Solver', color: '#4361ee', message: 'Strong performance with room for growth.' };
        if (percentage >= 50) return { tier: 'C', title: 'Competent', color: '#4cc9f0', message: 'Good effort! Practice makes perfect.' };
        if (percentage >= 40) return { tier: 'D', title: 'Novice', color: '#f72585', message: 'Keep practicing to improve your skills.' };
        return { tier: 'F', title: 'Beginner', color: '#888', message: 'First steps taken! Try again to improve.' };
    },
    
    // Check if user can proceed to next round
    canProceedToNextRound: function() {
        return this.currentRound < CONFIG.TOTAL_ROUNDS;
    },
    
    // Get next round number
    getNextRoundNumber: function() {
        return this.currentRound + 1;
    },
    
    // Reset game completely
    resetGame: function() {
        this.currentRound = 1;
        this.currentQuestionIndex = 0;
        this.roundReplays = {};
        this.currentRoundState = {
            roundNumber: 1,
            questions: [],
            userAnswers: [],
            hintsUsed: 0,
            startTime: null,
            endTime: null,
            isReplay: false
        };
        this.overallProgress = {
            totalRoundsCompleted: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            totalHintsUsed: 0,
            roundScores: {},
            bestScore: 0,
            totalPlayTime: 0,
            lastPlayed: null
        };
        this.saveToStorage();
    },
    
    // Save state to localStorage
    saveToStorage: function() {
        try {
            const data = {
                session: this.session,
                currentRound: this.currentRound,
                roundReplays: this.roundReplays,
                overallProgress: this.overallProgress,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save game state:', e);
        }
    },
    
    // Load state from localStorage
    loadFromStorage: function() {
        try {
            const data = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
            if (data) {
                this.session = data.session || this.session;
                this.currentRound = data.currentRound || this.currentRound;
                this.roundReplays = data.roundReplays || this.roundReplays;
                this.overallProgress = data.overallProgress || this.overallProgress;
                
                // Check if session expired
                if (data.timestamp && Date.now() - data.timestamp > CONFIG.SESSION_TIMEOUT) {
                    this.session.isLoggedIn = false;
                }
            }
        } catch (e) {
            console.error('Failed to load game state:', e);
        }
    },
    
    // Clear storage (logout)
    clearStorage: function() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        this.session = {
            userId: null,
            email: null,
            phone: null,
            isGuest: true,
            isLoggedIn: false,
            sessionStart: null,
            otpVerified: false
        };
    },
    
    // Utility: Shuffle array
    shuffleArray: function(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};

// ============================================
// AUTHENTICATION MANAGER
// ============================================
const AuthManager = {
    currentOTP: null,
    otpTimer: null,
    otpTimeLeft: CONFIG.OTP_TIMEOUT,
    
    // Generate random OTP
    generateOTP: function() {
        this.currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated OTP:', this.currentOTP); // For debugging
        return this.currentOTP;
    },
    
    // Start OTP timer
    startOTPTimer: function(callback) {
        this.otpTimeLeft = CONFIG.OTP_TIMEOUT;
        
        if (this.otpTimer) clearInterval(this.otpTimer);
        
        this.otpTimer = setInterval(() => {
            this.otpTimeLeft--;
            
            if (callback) callback(this.otpTimeLeft);
            
            if (this.otpTimeLeft <= 0) {
                clearInterval(this.otpTimer);
                this.currentOTP = null;
            }
        }, 1000);
    },
    
    // Verify OTP
    verifyOTP: function(inputOTP) {
        if (!this.currentOTP) return false;
        return inputOTP === this.currentOTP;
    },
    
    // Reset OTP
    resetOTP: function() {
        this.currentOTP = null;
        if (this.otpTimer) {
            clearInterval(this.otpTimer);
            this.otpTimer = null;
        }
    },
    
    // Format time for display
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// ============================================
// DOM ELEMENTS CACHE
// ============================================
const Elements = {
    // Screens
    loadingScreen: document.getElementById('loading-screen'),
    loginScreen: document.getElementById('login-screen'),
    otpScreen: document.getElementById('otp-screen'),
    introScreen: document.getElementById('intro-screen'),
    gameScreen: document.getElementById('game-screen'),
    roundCompleteScreen: document.getElementById('round-complete-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    // Login/Signup
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    authTabs: document.querySelectorAll('.tab-btn'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    signupEmail: document.getElementById('signup-email'),
    signupPhone: document.getElementById('signup-phone'),
    guestLoginBtn: document.getElementById('guest-login'),
    backToSignupBtn: document.getElementById('back-to-signup'),
    
    // OTP
    otpDigits: document.querySelectorAll('.otp-digit'),
    verifyOtpBtn: document.getElementById('verify-otp'),
    resendOtpBtn: document.getElementById('resend-otp'),
    otpTimerDisplay: document.getElementById('timer'),
    phoneMaskDisplay: document.getElementById('phone-mask'),
    
    // Intro Screen
    userGreeting: document.getElementById('user-greeting'),
    userStatus: document.getElementById('user-status'),
    currentRoundDisplay: document.getElementById('current-round-display'),
    totalScoreDisplay: document.getElementById('total-score-display'),
    bestScoreDisplay: document.getElementById('best-score-display'),
    startBtn: document.getElementById('start-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    roundDots: document.querySelectorAll('.round-dot'),
    
    // Game Screen
    currentRoundSpan: document.getElementById('current-round'),
    currentQuestionSpan: document.getElementById('current-question'),
    progressFill: document.getElementById('progress-fill'),
    hintCount: document.getElementById('hint-count'),
    scorePreview: document.getElementById('score-preview'),
    timerDisplay: document.getElementById('timer-display'),
    riddleQuestion: document.getElementById('riddle-question'),
    difficultyBadge: document.getElementById('difficulty-badge'),
    riddleCategory: document.getElementById('riddle-category'),
    hintBtn: document.getElementById('hint-btn'),
    hintDisplay: document.getElementById('hint-display'),
    answerInput: document.getElementById('answer-input'),
    submitBtn: document.getElementById('submit-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    
    // Round Complete Screen
    completedRoundSpan: document.getElementById('completed-round'),
    roundScore: document.getElementById('round-score'),
    cumulativeScore: document.getElementById('cumulative-score'),
    roundCorrect: document.getElementById('round-correct'),
    breakdownCorrect: document.getElementById('breakdown-correct'),
    breakdownHints: document.getElementById('breakdown-hints'),
    breakdownPenalty: document.getElementById('breakdown-penalty'),
    roundBonus: document.getElementById('round-bonus'),
    nextRoundNumber: document.getElementById('next-round-number'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    viewResultsBtn: document.getElementById('view-results-btn'),
    playAgainRoundBtn: document.getElementById('play-again-round'),
    progressionWarning: document.getElementById('progression-warning'),
    
    // Final Results Screen
    finalScore: document.getElementById('final-score'),
    performanceTitle: document.getElementById('performance-title'),
    performanceDescription: document.getElementById('performance-description'),
    finalCorrectCount: document.getElementById('final-correct-count'),
    finalHints: document.getElementById('final-hints'),
    finalPenalty: document.getElementById('final-penalty'),
    performanceTier: document.getElementById('performance-tier'),
    performanceMessage: document.getElementById('performance-message'),
    bestRoundScore: document.getElementById('best-round-score'),
    bestRoundNumber: document.getElementById('best-round-number'),
    roundChart: document.getElementById('round-chart'),
    finalWarning: document.getElementById('final-warning'),
    fullRestartBtn: document.getElementById('full-restart-btn'),
    practiceModeBtn: document.getElementById('practice-mode-btn'),
    backToMenuBtn: document.getElementById('back-to-menu-btn'),
    
    // Bottom Navigation
    navButtons: document.querySelectorAll('.nav-btn'),
    profileBtn: document.getElementById('profile-btn'),
    
    // Toast Container
    toastContainer: document.getElementById('toast-container')
};

// ============================================
// UI RENDERER
// ============================================
const Renderer = {
    // Show specific screen
    showScreen: function(screenName) {
        // Hide all screens
        Object.values(Elements).forEach(element => {
            if (element && element.classList && element.classList.contains('screen')) {
                element.classList.remove('active');
            }
        });
        
        // Show requested screen
        let screenElement;
        switch(screenName) {
            case 'loading': screenElement = Elements.loadingScreen; break;
            case 'login': screenElement = Elements.loginScreen; break;
            case 'otp': screenElement = Elements.otpScreen; break;
            case 'intro': screenElement = Elements.introScreen; break;
            case 'game': screenElement = Elements.gameScreen; break;
            case 'roundComplete': screenElement = Elements.roundCompleteScreen; break;
            case 'results': screenElement = Elements.resultsScreen; break;
        }
        
        if (screenElement) {
            screenElement.classList.add('active');
            
            // Update bottom nav active state
            Elements.navButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.screen === screenName) {
                    btn.classList.add('active');
                }
            });
        }
    },
    
    // Update intro screen with user data
    updateIntroScreen: function() {
        const user = GameState.session;
        
        // Update user greeting
        if (user.email && !user.isGuest) {
            const username = user.email.split('@')[0];
            Elements.userGreeting.textContent = `Welcome back, ${username}!`;
            Elements.userStatus.textContent = `Playing since ${new Date(user.sessionStart).toLocaleDateString()}`;
        } else {
            Elements.userGreeting.textContent = 'Welcome, Guest Player!';
            Elements.userStatus.textContent = 'Play as guest - progress saved locally';
        }
        
        // Update round info
        Elements.currentRoundDisplay.textContent = GameState.currentRound;
        Elements.totalScoreDisplay.textContent = GameState.getTotalScore();
        Elements.bestScoreDisplay.textContent = GameState.overallProgress.bestScore;
        
        // Update start button text
        Elements.startBtn.innerHTML = `<i class="fas fa-play"></i> Start Round ${GameState.currentRound}`;
        
        // Update round dots
        Elements.roundDots.forEach(dot => {
            const roundNum = parseInt(dot.dataset.round);
            dot.classList.toggle('active', roundNum === GameState.currentRound);
            dot.classList.toggle('completed', GameState.overallProgress.roundScores[roundNum]);
        });
    },
    
    // Update game screen for current question
    updateGameScreen: function() {
        const currentQuestion = GameState.getCurrentQuestion();
        const progress = ((GameState.currentQuestionIndex + 1) / CONFIG.QUESTIONS_PER_ROUND) * 100;
        const round = GameState.currentRound;
        
        // Update headers
        Elements.currentRoundSpan.textContent = round;
        Elements.currentQuestionSpan.textContent = GameState.currentQuestionIndex + 1;
        Elements.progressFill.style.width = `${progress}%`;
        
        // Update stats
        Elements.hintCount.textContent = GameState.currentRoundState.hintsUsed;
        Elements.scorePreview.textContent = GameState.getTotalScore();
        
        // Update timer if needed
        if (GameState.currentRoundState.startTime) {
            const elapsed = Math.floor((Date.now() - GameState.currentRoundState.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            Elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update question
        Elements.riddleQuestion.textContent = currentQuestion.question;
        
        // Update difficulty badge
        const difficultyText = ['Easy', 'Medium', 'Hard', 'Expert', 'Master'][currentQuestion.difficulty - 1] || 'Medium';
        const difficultyColors = ['#4caf50', '#ff9800', '#f44336', '#9c27b0', '#ff5722'];
        Elements.difficultyBadge.textContent = difficultyText;
        Elements.difficultyBadge.style.background = `rgba(${parseInt(difficultyColors[currentQuestion.difficulty - 1]?.slice(1, 3) || '76')}, ${parseInt(difficultyColors[currentQuestion.difficulty - 1]?.slice(3, 5) || '175')}, ${parseInt(difficultyColors[currentQuestion.difficulty - 1]?.slice(5, 7) || '80')}, 0.2)`;
        Elements.difficultyBadge.style.color = difficultyColors[currentQuestion.difficulty - 1] || '#4caf50';
        
        // Update category
        Elements.riddleCategory.textContent = currentQuestion.category;
        
        // Reset hint display
        Elements.hintDisplay.textContent = '';
        Elements.hintDisplay.classList.remove('show');
        
        // Clear input but preserve if going back/forth
        const existingAnswer = GameState.currentRoundState.userAnswers[GameState.currentQuestionIndex];
        Elements.answerInput.value = existingAnswer ? existingAnswer.userAnswer : '';
        Elements.answerInput.focus();
        
        // Update navigation buttons
        Elements.prevBtn.disabled = GameState.currentQuestionIndex === 0;
        Elements.nextBtn.disabled = GameState.currentQuestionIndex === CONFIG.QUESTIONS_PER_ROUND - 1;
        
        // Check if question already answered
        if (existingAnswer) {
            Elements.hintBtn.disabled = existingAnswer.usedHint;
            if (existingAnswer.usedHint) {
                Elements.hintBtn.querySelector('.hint-text').textContent = 'Hint used';
            }
        } else {
            Elements.hintBtn.disabled = false;
            Elements.hintBtn.querySelector('.hint-text').textContent = 'Need a hint? (-2 pts)';
        }
    },
    
    // Update round complete screen
    updateRoundCompleteScreen: function() {
        const roundResults = GameState.calculateRoundScore();
        const totalScore = GameState.getTotalScore();
        const nextRound = GameState.getNextRoundNumber();
        const isReplay = GameState.currentRoundState.isReplay;
        
        // Update round info
        Elements.completedRoundSpan.textContent = GameState.currentRound;
        Elements.roundScore.textContent = roundResults.roundScore;
        Elements.cumulativeScore.textContent = totalScore;
        Elements.roundCorrect.textContent = roundResults.correctCount;
        
        // Update breakdown
        Elements.breakdownCorrect.textContent = roundResults.correctCount;
        Elements.breakdownHints.textContent = roundResults.hintCount;
        Elements.breakdownPenalty.textContent = roundResults.hintPenalty;
        Elements.roundBonus.textContent = roundResults.perfectBonus > 0 ? `+${roundResults.perfectBonus} pts` : '+0 pts';
        
        // Update next round button
        Elements.nextRoundNumber.textContent = nextRound;
        Elements.nextRoundBtn.innerHTML = `<i class="fas fa-forward"></i> Continue to Round ${nextRound}`;
        
        // Show/hide progression warning for replays
        if (isReplay) {
            Elements.progressionWarning.style.display = 'flex';
            Elements.progressionWarning.querySelector('p').textContent = 
                `This is replay #${GameState.roundReplays[GameState.currentRound]}. Playing again will use different questions.`;
        } else {
            Elements.progressionWarning.style.display = 'none';
        }
        
        // Update button visibility
        if (GameState.canProceedToNextRound()) {
            Elements.nextRoundBtn.style.display = 'flex';
        } else {
            Elements.nextRoundBtn.style.display = 'none';
        }
    },
    
    // Update final results screen
    updateResultsScreen: function() {
        const totalScore = GameState.getTotalScore();
        const performance = GameState.getPerformanceTier(totalScore);
        const roundScores = GameState.overallProgress.roundScores;
        
        // Update score display
        Elements.finalScore.textContent = totalScore;
        Elements.performanceTitle.textContent = performance.title;
        Elements.performanceDescription.textContent = performance.message;
        Elements.performanceTier.textContent = performance.tier;
        Elements.performanceTier.style.color = performance.color;
        Elements.performanceMessage.textContent = performance.message;
        
        // Update stats
        Elements.finalCorrectCount.textContent = GameState.overallProgress.totalCorrect;
        Elements.finalHints.textContent = GameState.overallProgress.totalHintsUsed;
        Elements.finalPenalty.textContent = GameState.overallProgress.totalHintsUsed * Math.abs(CONFIG.POINTS_PER_HINT);
        
        // Find best round
        let bestRound = { round: 1, score: 0 };
        Object.entries(roundScores).forEach(([round, data]) => {
            if (data.score > bestRound.score) {
                bestRound = { round: parseInt(round), score: data.score };
            }
        });
        
        Elements.bestRoundScore.textContent = bestRound.score;
        Elements.bestRoundNumber.textContent = bestRound.round;
        
        // Create round chart
        this.createRoundChart(roundScores);
        
        // Update warning based on replay count
        const maxReplayCount = Math.max(...Object.values(GameState.roundReplays));
        if (maxReplayCount >= 2) {
            Elements.finalWarning.querySelector('p').textContent = 
                'You\'ve replayed several rounds. Starting fresh will reset all progress.';
        }
    },
    
    // Create chart for round scores
    createRoundChart: function(roundScores) {
        Elements.roundChart.innerHTML = '';
        
        for (let i = 1; i <= CONFIG.TOTAL_ROUNDS; i++) {
            const roundData = roundScores[i];
            const score = roundData ? roundData.score : 0;
            const maxScore = 100 + CONFIG.PERFECT_ROUND_BONUS;
            const percentage = (score / maxScore) * 100;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${percentage}%`;
            bar.dataset.value = score;
            bar.title = `Round ${i}: ${score} points`;
            
            // Add label
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = i;
            label.style.position = 'absolute';
            label.style.bottom = '-20px';
            label.style.left = '50%';
            label.style.transform = 'translateX(-50%)';
            label.style.color = 'var(--text-secondary)';
            label.style.fontSize = '0.8rem';
            
            bar.appendChild(label);
            Elements.roundChart.appendChild(bar);
        }
    },
    
    // Show hint for current question
    showHint: function() {
        const currentQuestion = GameState.getCurrentQuestion();
        Elements.hintDisplay.textContent = currentQuestion.hint;
        Elements.hintDisplay.classList.add('show');
        
        // Update hint button
        Elements.hintBtn.disabled = true;
        Elements.hintBtn.querySelector('.hint-text').textContent = 'Hint used';
    },
    
    // Show toast notification
    showToast: function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        Elements.toastContainer.appendChild(toast);
        
        // Remove toast after duration
        setTimeout(() => {
            toast.remove();
        }, duration);
    },
    
    // Get icon for toast type
    getToastIcon: function(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    },
    
    // Update OTP timer display
    updateOTPTimer: function(seconds) {
        Elements.otpTimerDisplay.textContent = AuthManager.formatTime(seconds);
        
        // Update button states
        Elements.verifyOtpBtn.disabled = seconds <= 0;
        Elements.resendOtpBtn.disabled = seconds > 0;
    },
    
    // Update OTP input UI
    updateOTPInput: function() {
        let otp = '';
        Elements.otpDigits.forEach((digit, index) => {
            otp += digit.value;
            digit.classList.toggle('filled', digit.value !== '');
            
            // Auto-focus next input
            digit.addEventListener('input', (e) => {
                if (e.target.value && index < Elements.otpDigits.length - 1) {
                    Elements.otpDigits[index + 1].focus();
                }
                
                // Check if OTP is complete
                const completeOTP = Array.from(Elements.otpDigits).map(d => d.value).join('');
                Elements.verifyOtpBtn.disabled = completeOTP.length !== CONFIG.OTP_LENGTH;
            });
            
            // Handle backspace
            digit.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    Elements.otpDigits[index - 1].focus();
                }
            });
        });
        
        return otp;
    }
};

// ============================================
// EVENT HANDLERS
// ============================================
const EventHandlers = {
    // Initialize all event listeners
    init: function() {
        // Auth events
        this.initAuthEvents();
        
        // Game events
        this.initGameEvents();
        
        // Navigation events
        this.initNavigationEvents();
    },
    
    // Authentication events
    initAuthEvents: function() {
        // Tab switching
        Elements.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Update active tab
                Elements.authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                Elements.loginForm.classList.toggle('active', tabName === 'login');
                Elements.signupForm.classList.toggle('active', tabName === 'signup');
            });
        });
        
        // Switch tab link
        document.querySelectorAll('.switch-tab').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.tab-btn[data-tab="login"]').click();
            });
        });
        
        // Guest login
        Elements.guestLoginBtn.addEventListener('click', () => {
            GameState.session.isGuest = true;
            GameState.session.isLoggedIn = true;
            GameState.saveToStorage();
            
            Renderer.showToast('Logged in as guest', 'success');
            setTimeout(() => {
                Renderer.showScreen('intro');
                Renderer.updateIntroScreen();
            }, 1000);
        });
        
        // Signup form submission
        Elements.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = Elements.signupEmail.value.trim();
            const phone = Elements.signupPhone.value.trim();
            
            if (!this.validateEmail(email)) {
                Renderer.showToast('Please enter a valid email', 'error');
                return;
            }
            
            if (!this.validatePhone(phone)) {
                Renderer.showToast('Please enter a valid phone number', 'error');
                return;
            }
            
            // Generate and send OTP (simulated)
            const otp = AuthManager.generateOTP();
            GameState.session.email = email;
            GameState.session.phone = phone;
            
            // Mask phone for display
            const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{3})/, '$1•••$2');
            Elements.phoneMaskDisplay.textContent = maskedPhone;
            
            // Start OTP timer
            AuthManager.startOTPTimer((seconds) => {
                Renderer.updateOTPTimer(seconds);
            });
            
            // Show OTP screen
            Renderer.showScreen('otp');
            
            // Focus first OTP digit
            setTimeout(() => {
                Elements.otpDigits[0].focus();
            }, 100);
            
            // Show success message (simulated)
            Renderer.showToast(`OTP sent to ${maskedPhone}: ${otp}`, 'info', 5000);
        });
        
        // OTP verification
        Elements.verifyOtpBtn.addEventListener('click', () => {
            const otp = Array.from(Elements.otpDigits).map(d => d.value).join('');
            
            if (AuthManager.verifyOTP(otp)) {
                GameState.session.isGuest = false;
                GameState.session.isLoggedIn = true;
                GameState.session.otpVerified = true;
                GameState.saveToStorage();
                
                AuthManager.resetOTP();
                
                Renderer.showToast('Account verified successfully!', 'success');
                setTimeout(() => {
                    Renderer.showScreen('intro');
                    Renderer.updateIntroScreen();
                }, 1000);
            } else {
                Renderer.showToast('Invalid OTP. Please try again.', 'error');
            }
        });
        
        // Resend OTP
        Elements.resendOtpBtn.addEventListener('click', () => {
            if (Elements.resendOtpBtn.disabled) return;
            
            const otp = AuthManager.generateOTP();
            AuthManager.startOTPTimer((seconds) => {
                Renderer.updateOTPTimer(seconds);
            });
            
            Renderer.showToast(`New OTP sent: ${otp}`, 'info', 5000);
        });
        
        // Back to signup
        Elements.backToSignupBtn.addEventListener('click', () => {
            AuthManager.resetOTP();
            Renderer.showScreen('login');
        });
        
        // Login form submission
        Elements.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = Elements.loginEmail.value.trim();
            const password = Elements.loginPassword.value.trim();
            
            // Simulated login (in real app, would call backend)
            if (email && password) {
                GameState.session.email = email;
                GameState.session.isGuest = false;
                GameState.session.isLoggedIn = true;
                GameState.saveToStorage();
                
                Renderer.showToast('Login successful!', 'success');
                setTimeout(() => {
                    Renderer.showScreen('intro');
                    Renderer.updateIntroScreen();
                }, 1000);
            } else {
                Renderer.showToast('Please fill all fields', 'error');
            }
        });
        
        // Logout
        Elements.logoutBtn.addEventListener('click', () => {
            GameState.clearStorage();
            GameState.init();
            Renderer.showToast('Logged out successfully', 'success');
            setTimeout(() => {
                Renderer.showScreen('login');
            }, 1000);
        });
    },
    
    // Game events
    initGameEvents: function() {
        // Start game
        Elements.startBtn.addEventListener('click', () => {
            GameState.startRound(GameState.currentRound);
            Renderer.showScreen('game');
            Renderer.updateGameScreen();
        });
        
        // Submit answer
        Elements.submitBtn.addEventListener('click', () => this.handleSubmitAnswer());
        Elements.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSubmitAnswer();
            }
        });
        
        // Show hint
        Elements.hintBtn.addEventListener('click', () => {
            Renderer.showHint();
        });
        
        // Navigation buttons
        Elements.prevBtn.addEventListener('click', () => {
            if (GameState.currentQuestionIndex > 0) {
                GameState.currentQuestionIndex--;
                Renderer.updateGameScreen();
            }
        });
        
        Elements.nextBtn.addEventListener('click', () => {
            if (GameState.currentQuestionIndex < CONFIG.QUESTIONS_PER_ROUND - 1) {
                GameState.currentQuestionIndex++;
                Renderer.updateGameScreen();
            }
        });
        
        // Round complete actions
        Elements.nextRoundBtn.addEventListener('click', () => {
            if (GameState.canProceedToNextRound()) {
                GameState.currentRound = GameState.getNextRoundNumber();
                GameState.startRound(GameState.currentRound);
                Renderer.showScreen('game');
                Renderer.updateGameScreen();
            }
        });
        
        Elements.viewResultsBtn.addEventListener('click', () => {
            Renderer.showScreen('results');
            Renderer.updateResultsScreen();
        });
        
        Elements.playAgainRoundBtn.addEventListener('click', () => {
            const replayCount = GameState.roundReplays[GameState.currentRound] || 0;
            
            if (replayCount >= 2 && GameState.currentRound === CONFIG.TOTAL_ROUNDS) {
                if (confirm('You\'ve replayed this round multiple times. Starting over will reset ALL progress. Continue?')) {
                    GameState.resetGame();
                    GameState.startRound(1);
                    Renderer.showScreen('game');
                    Renderer.updateGameScreen();
                }
            } else {
                GameState.startRound(GameState.currentRound, true);
                Renderer.showScreen('game');
                Renderer.updateGameScreen();
            }
        });
        
        // Final results actions
        Elements.fullRestartBtn.addEventListener('click', () => {
            if (confirm('This will reset ALL your progress and start with completely new riddles. Are you sure?')) {
                GameState.resetGame();
                GameState.startRound(1);
                Renderer.showScreen('game');
                Renderer.updateGameScreen();
            }
        });
        
        Elements.practiceModeBtn.addEventListener('click', () => {
            // Collect incorrect answers
            const incorrectAnswers = [];
            Object.values(GameState.overallProgress.roundScores).forEach(roundData => {
                // In a real implementation, you would filter incorrect answers
                // For now, just show a message
            });
            
            if (incorrectAnswers.length > 0) {
                Renderer.showToast(`Practice mode coming soon! You have ${incorrectAnswers.length} questions to review.`, 'info');
            } else {
                Renderer.showToast('Great job! You answered all questions correctly.', 'success');
            }
        });
        
        Elements.backToMenuBtn.addEventListener('click', () => {
            Renderer.showScreen('intro');
            Renderer.updateIntroScreen();
        });
    },
    
    // Navigation events
    initNavigationEvents: function() {
        // Bottom navigation
        Elements.navButtons.forEach(btn => {
            if (btn.dataset.screen) {
                btn.addEventListener('click', () => {
                    const screen = btn.dataset.screen;
                    
                    // Check if user can access this screen
                    if (screen === 'game' && !GameState.session.isLoggedIn) {
                        Renderer.showToast('Please login or play as guest first', 'warning');
                        return;
                    }
                    
                    if (screen === 'results' && GameState.overallProgress.totalRoundsCompleted === 0) {
                        Renderer.showToast('Complete at least one round to view results', 'warning');
                        return;
                    }
                    
                    Renderer.showScreen(screen);
                    
                    // Update specific screens
                    if (screen === 'intro') {
                        Renderer.updateIntroScreen();
                    } else if (screen === 'results') {
                        Renderer.updateResultsScreen();
                    }
                });
            }
        });
        
        // Profile button
        Elements.profileBtn.addEventListener('click', () => {
            if (GameState.session.isLoggedIn) {
                // Show profile modal or go to settings
                Renderer.showToast(`Logged in as ${GameState.session.email || 'Guest'}`, 'info');
            } else {
                Renderer.showScreen('login');
            }
        });
    },
    
    // Handle answer submission
    handleSubmitAnswer: function() {
        const answer = Elements.answerInput.value.trim();
        
        if (!answer) {
            Renderer.showToast('Please enter an answer', 'warning');
            Elements.answerInput.focus();
            return;
        }
        
        const usedHint = Elements.hintDisplay.classList.contains('show');
        const result = GameState.submitAnswer(answer, usedHint);
        
        if (result === 'next') {
            Renderer.updateGameScreen();
            Renderer.showToast('Answer submitted!', 'success');
        } else if (result === 'complete') {
            Renderer.updateRoundCompleteScreen();
            Renderer.showScreen('roundComplete');
            
            // Show completion message
            const roundResults = GameState.calculateRoundScore();
            const message = roundResults.correctCount === CONFIG.QUESTIONS_PER_ROUND
                ? 'Perfect round! 🎉'
                : `Round complete! You got ${roundResults.correctCount}/10 correct.`;
            
            Renderer.showToast(message, 'success');
        }
    },
    
    // Validation helpers
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: function(phone) {
        const re = /^\+?[1-9]\d{1,14}$/;
        return re.test(phone);
    }
};

// ============================================
// INITIALIZATION
// ============================================
function initApp() {
    // Initialize game state
    GameState.init();
    
    // Initialize event handlers
    EventHandlers.init();
    
    // Simulate loading
    setTimeout(() => {
        // Check if user is logged in
        if (GameState.session.isLoggedIn) {
            Renderer.showScreen('intro');
            Renderer.updateIntroScreen();
        } else {
            Renderer.showScreen('login');
        }
        
        // Hide loading screen
        Elements.loadingScreen.classList.remove('active');
        
        // Show welcome message
        setTimeout(() => {
            Renderer.showToast('Welcome to Riddle Crest Pro!', 'info');
        }, 500);
    }, 1500);
    
    // Add service worker support notification
    if ('serviceWorker' in navigator) {
        Renderer.showToast('App is ready for offline use!', 'success', 5000);
    }
    
    // Handle beforeunload to save state
    window.addEventListener('beforeunload', () => {
        GameState.saveToStorage();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            GameState.saveToStorage();
        }
    });
}

// ============================================
// START THE APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', initApp);