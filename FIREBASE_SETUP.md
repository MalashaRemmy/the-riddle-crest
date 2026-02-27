# Firebase Setup Guide — Riddle Crest Pro

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** and follow the wizard
3. Once created, click the **Web** icon (`</>`) to register a web app
4. Copy the Firebase config object

## 2. Update `firebase-config.js`

Open `firebase-config.js` and replace the placeholder values with your real config:

```js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## 3. Enable Authentication Providers

In the Firebase Console:

1. Go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Enable **Anonymous** (for guest play)

## 4. Set Up Firestore Database

1. Go to **Firestore Database → Create database**
2. Choose **Start in production mode**
3. Select a Cloud Firestore location near your users

## 5. Deploy Firestore Security Rules

Copy the contents of `firestore.rules` into the Firebase Console:

1. Go to **Firestore Database → Rules**
2. Replace the default rules with the contents of `firestore.rules`
3. Click **Publish**

Alternatively, deploy via the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## 6. Firestore Data Structure

```
/users/{uid}
    ├── email: string
    ├── phone: string | null
    ├── isGuest: boolean
    ├── createdAt: timestamp
    └── /gameData/progress
            ├── currentRound: number
            ├── roundReplays: object
            ├── overallProgress: object
            ├── session: object
            └── updatedAt: timestamp
```

## 7. How It Works

| Action | What Happens |
|--------|-------------|
| **Sign Up** | Creates Firebase Auth account + Firestore profile. Sends verification email. |
| **Log In** | Authenticates via Firebase Auth. Loads progress from Firestore. |
| **Guest Play** | Creates anonymous Firebase Auth account. Progress saved under anonymous UID. |
| **Guest → Account** | Links email/password to anonymous account. UID preserved, data stays intact. |
| **Logout** | Signs out of Firebase Auth. `onAuthStateChanged` navigates to login screen. |
| **Save Progress** | Writes to Firestore + localStorage mirror (fire-and-forget). |
| **Load Progress** | Reads from Firestore first, falls back to localStorage if offline. |

## 8. Offline Support

- Firestore offline persistence is enabled in `firebase-config.js`
- Every save also mirrors to `localStorage` for instant offline reads
- If Firestore is unreachable, the app falls back to localStorage seamlessly

## 9. Files Overview

| File | Purpose |
|------|---------|
| `firebase-config.js` | Firebase SDK initialization (Auth + Firestore) |
| `auth.js` | All authentication operations (`RCAuth` global) |
| `db.js` | Firestore read/write for game progress (`RCDatabase` global) |
| `firestore.rules` | Firestore security rules |
| `script.js` | Main app — integrates auth/db via `onAuthStateChanged` |
