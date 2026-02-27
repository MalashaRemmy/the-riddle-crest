// ============================================
// DATABASE PERSISTENCE MODULE (Firestore)
// ============================================
// Handles all Firestore read/write operations for per-user
// game progress. Falls back to localStorage when offline or
// when no Firebase user is available (should not happen in
// normal flow since even guests get an anonymous UID).
//
// Firestore document structure:
//   /users/{uid}/gameData/progress
//     {
//       currentRound: number,
//       roundReplays: object,
//       overallProgress: object,
//       session: object,       // app-level session metadata
//       updatedAt: timestamp
//     }
//
// Dependencies: firebase-config.js (provides firebaseDb, firebaseAuth globals)
// Consumed by: script.js (via the global RCDatabase object)
// ============================================

const RCDatabase = {

    // ------------------------------------------------
    // SAVE — persist game progress to Firestore
    // ------------------------------------------------
    // Writes the provided data object to the authenticated user's
    // gameData/progress document. Merges fields to avoid overwriting
    // unrelated data. Falls back to localStorage on error.
    async save(data) {
        try {
            const user = firebaseAuth.currentUser;
            if (!user) {
                this._saveToLocalStorage(data);
                return;
            }

            const docRef = firebaseDb
                .collection('users').doc(user.uid)
                .collection('gameData').doc('progress');

            await docRef.set({
                currentRound: data.currentRound,
                roundReplays: data.roundReplays,
                overallProgress: data.overallProgress,
                session: {
                    isGuest: user.isAnonymous,
                    email: user.email || null,
                    isLoggedIn: true
                },
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            // Also keep a localStorage mirror for fast offline access
            this._saveToLocalStorage(data);
        } catch (err) {
            console.error('[DB] Firestore save failed, using localStorage:', err.message);
            this._saveToLocalStorage(data);
        }
    },

    // ------------------------------------------------
    // LOAD — retrieve game progress from Firestore
    // ------------------------------------------------
    // Reads the authenticated user's progress document.
    // Falls back to localStorage if Firestore is unavailable.
    // Returns: data object or null
    async load() {
        try {
            const user = firebaseAuth.currentUser;
            if (!user) {
                return this._loadFromLocalStorage();
            }

            const docRef = firebaseDb
                .collection('users').doc(user.uid)
                .collection('gameData').doc('progress');

            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                // Mirror to localStorage for offline access
                this._saveToLocalStorage(data);
                return data;
            }

            // No Firestore data — check localStorage for migrateable data
            return this._loadFromLocalStorage();
        } catch (err) {
            console.warn('[DB] Firestore load failed, using localStorage:', err.message);
            return this._loadFromLocalStorage();
        }
    },

    // ------------------------------------------------
    // DELETE — remove all game data for the current user
    // ------------------------------------------------
    // Called on full game reset or account deletion.
    async deleteProgress() {
        try {
            const user = firebaseAuth.currentUser;
            if (user) {
                await firebaseDb
                    .collection('users').doc(user.uid)
                    .collection('gameData').doc('progress')
                    .delete();
            }
            this._clearLocalStorage();
        } catch (err) {
            console.error('[DB] Firestore delete failed:', err.message);
            this._clearLocalStorage();
        }
    },

    // ------------------------------------------------
    // MIGRATE GUEST DATA — copy localStorage data to a new
    // Firestore account after guest-to-account conversion.
    // The UID doesn't change during linking, so normally
    // the data is already under the correct UID. This method
    // exists as a safety net to ensure data is in Firestore.
    // ------------------------------------------------
    async migrateGuestData() {
        try {
            const localData = this._loadFromLocalStorage();
            if (!localData) return;

            const user = firebaseAuth.currentUser;
            if (!user) return;

            const docRef = firebaseDb
                .collection('users').doc(user.uid)
                .collection('gameData').doc('progress');

            const existing = await docRef.get();

            // Only migrate if Firestore has no data yet
            if (!existing.exists) {
                await docRef.set({
                    currentRound: localData.currentRound || 1,
                    roundReplays: localData.roundReplays || {},
                    overallProgress: localData.overallProgress || {},
                    session: {
                        isGuest: false,
                        email: user.email || null,
                        isLoggedIn: true
                    },
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('[DB] Guest data migrated to Firestore.');
            }
        } catch (err) {
            console.error('[DB] Guest data migration failed:', err.message);
        }
    },

    // ------------------------------------------------
    // LOCAL STORAGE HELPERS — used as offline fallback
    // ------------------------------------------------
    _saveToLocalStorage(data) {
        try {
            const payload = {
                currentRound: data.currentRound,
                roundReplays: data.roundReplays,
                overallProgress: data.overallProgress,
                session: data.session || {},
                timestamp: Date.now()
            };
            localStorage.setItem('riddleCrestPro_v1', JSON.stringify(payload));
        } catch (e) {
            console.error('[DB] localStorage save failed:', e);
        }
    },

    _loadFromLocalStorage() {
        try {
            const raw = localStorage.getItem('riddleCrestPro_v1');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.error('[DB] localStorage load failed:', e);
            return null;
        }
    },

    _clearLocalStorage() {
        try {
            localStorage.removeItem('riddleCrestPro_v1');
        } catch (e) {
            console.error('[DB] localStorage clear failed:', e);
        }
    }
};

console.log('[DB] Module loaded.');
