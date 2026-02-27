// ============================================
// AUTHENTICATION MODULE
// ============================================
// Handles all Firebase Auth operations: signup, login, logout,
// email verification, password reset, guest-to-account conversion,
// and auth state observation.
//
// Dependencies: firebase-config.js (provides firebaseAuth global)
// Consumed by: script.js (via the global RCAuth object)
// ============================================

const RCAuth = {
    // Current Firebase user reference (null when signed out)
    currentUser: null,

    // Whether the initial auth state check has completed
    _initialized: false,

    // Registered callback for auth state changes
    _onAuthChangeCallback: null,

    // ------------------------------------------------
    // SIGN UP — create account with email + password
    // ------------------------------------------------
    // Optionally stores phone number in Firestore user profile.
    // Sends email verification after successful creation.
    // Returns: { success: true, user } or { success: false, error }
    async signUp(email, password, phone) {
        try {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }
            if (password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters.' };
            }

            const credential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
            const user = credential.user;

            // Send verification email (non-blocking)
            user.sendEmailVerification().catch((err) => {
                console.warn('[Auth] Email verification send failed:', err.message);
            });

            // Store user profile in Firestore
            await firebaseDb.collection('users').doc(user.uid).set({
                email: email,
                phone: phone || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                isGuest: false
            }, { merge: true });

            return { success: true, user: user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // LOG IN — authenticate with email + password
    // ------------------------------------------------
    // Returns: { success: true, user } or { success: false, error }
    async logIn(email, password) {
        try {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }

            const credential = await firebaseAuth.signInWithEmailAndPassword(email, password);
            return { success: true, user: credential.user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // GUEST LOGIN — sign in anonymously via Firebase
    // ------------------------------------------------
    // Creates a temporary anonymous account. Progress is saved
    // under this anonymous UID and can later be migrated if
    // the guest converts to a full account.
    // Returns: { success: true, user } or { success: false, error }
    async guestLogin() {
        try {
            const credential = await firebaseAuth.signInAnonymously();
            const user = credential.user;

            // Mark as guest in Firestore
            await firebaseDb.collection('users').doc(user.uid).set({
                isGuest: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { success: true, user: user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // GUEST → FULL ACCOUNT CONVERSION
    // ------------------------------------------------
    // Links email/password credentials to the current anonymous user.
    // The UID stays the same so all Firestore data is preserved.
    // Returns: { success: true, user } or { success: false, error }
    async convertGuestToAccount(email, password, phone) {
        try {
            const user = firebaseAuth.currentUser;
            if (!user || !user.isAnonymous) {
                return { success: false, error: 'No guest session to convert.' };
            }
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }
            if (password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters.' };
            }

            const credential = firebase.auth.EmailAuthProvider.credential(email, password);
            const result = await user.linkWithCredential(credential);

            // Send verification email
            result.user.sendEmailVerification().catch((err) => {
                console.warn('[Auth] Email verification send failed:', err.message);
            });

            // Update Firestore profile
            await firebaseDb.collection('users').doc(result.user.uid).set({
                email: email,
                phone: phone || null,
                isGuest: false,
                convertedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            return { success: true, user: result.user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // LOG OUT — sign out and clean up
    // ------------------------------------------------
    async logOut() {
        try {
            await firebaseAuth.signOut();
            this.currentUser = null;
            return { success: true };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // PASSWORD RESET — send reset email
    // ------------------------------------------------
    async sendPasswordReset(email) {
        try {
            if (!email) {
                return { success: false, error: 'Please enter your email address.' };
            }
            await firebaseAuth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // RESEND EMAIL VERIFICATION
    // ------------------------------------------------
    async resendVerificationEmail() {
        try {
            const user = firebaseAuth.currentUser;
            if (!user) {
                return { success: false, error: 'No user is signed in.' };
            }
            await user.sendEmailVerification();
            return { success: true };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // AUTH STATE OBSERVER
    // ------------------------------------------------
    // Listens for Firebase auth state changes (login, logout, token refresh).
    // Calls the registered callback with (user) or (null).
    // Should be called once during app initialization.
    onAuthStateChanged(callback) {
        this._onAuthChangeCallback = callback;
        firebaseAuth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this._initialized = true;
            if (callback) callback(user);
        });
    },

    // ------------------------------------------------
    // HELPER: Is the current user a guest (anonymous)?
    // ------------------------------------------------
    isGuest() {
        const user = firebaseAuth.currentUser;
        return user ? user.isAnonymous : true;
    },

    // ------------------------------------------------
    // HELPER: Is the current user's email verified?
    // ------------------------------------------------
    isEmailVerified() {
        const user = firebaseAuth.currentUser;
        return user ? user.emailVerified : false;
    },

    // ------------------------------------------------
    // HELPER: Get display name or email prefix
    // ------------------------------------------------
    getDisplayName() {
        const user = firebaseAuth.currentUser;
        if (!user) return 'Player';
        if (user.isAnonymous) return 'Guest Player';
        if (user.displayName) return user.displayName;
        if (user.email) return user.email.split('@')[0];
        return 'Player';
    },

    // ------------------------------------------------
    // HELPER: Translate Firebase error codes to friendly messages
    // ------------------------------------------------
    _friendlyError(err) {
        const code = err.code || '';
        const map = {
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/weak-password': 'Password must be at least 6 characters.',
            'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
            'auth/network-request-failed': 'Network error. Check your connection.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed.',
            'auth/credential-already-in-use': 'This credential is already linked to another account.',
            'auth/requires-recent-login': 'Please log in again to complete this action.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled. Contact support.'
        };
        return map[code] || err.message || 'An unexpected error occurred.';
    }
};

console.log('[Auth] Module loaded.');
