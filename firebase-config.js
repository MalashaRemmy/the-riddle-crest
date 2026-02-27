// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================
// This module initializes the Firebase SDK (Auth + Firestore).
//
// SETUP INSTRUCTIONS:
// 1. Create a Firebase project at https://console.firebase.google.com
// 2. Enable "Email/Password" sign-in under Authentication → Sign-in method
// 3. Create a Firestore database under Firestore Database
// 4. Replace the placeholder config below with your project's config
// 5. Deploy Firestore security rules (see firestore.rules in this repo)
// ============================================

const firebaseConfig = {
    // ⚠️ REPLACE with your Firebase project config from:
    // Firebase Console → Project Settings → General → Your apps → Web app → Config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase app (only once)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Export Firebase service references for use by other modules
const firebaseAuth = firebase.auth();
const firebaseDb = firebase.firestore();

// Enable Firestore offline persistence for PWA support
firebaseDb.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open — persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code === 'unimplemented') {
        // Browser doesn't support persistence
        console.warn('Firestore persistence not supported in this browser.');
    }
});

console.log('[Firebase] Initialized successfully.');
