// ============================================
// AUTHENTICATION MODULE (Supabase)
// ============================================
// Handles all Supabase Auth operations: signup, login, logout,
// password reset, guest play (local-only), guest-to-account
// conversion, and auth state observation.
//
// Dependencies: supabase-config.js (provides `supabase` global)
// Consumed by: script.js (via the global RCAuth object)
//
// NOTE: Supabase does not have true anonymous auth. Guest play
// is handled locally — no server account is created. When a
// guest converts, a real Supabase account is created and their
// localStorage progress is migrated to the database.
// ============================================

const RCAuth = {
    // Current Supabase user object (null when signed out / guest)
    currentUser: null,

    // Whether the initial auth state check has completed
    _initialized: false,

    // Whether the current session is a local guest (no server account)
    _isLocalGuest: false,

    // Registered callback for auth state changes
    _onAuthChangeCallback: null,

    // ------------------------------------------------
    // SIGN UP — create account with email + password
    // ------------------------------------------------
    // Supabase sends a confirmation email automatically if enabled.
    // After signup we also upsert a profile row in the `users` table.
    // Returns: { success: true, user } or { success: false, error }
    async signUp(email, password, phone) {
        try {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }
            if (password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters.' };
            }

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { phone: phone || null }
                }
            });

            if (error) return { success: false, error: this._friendlyError(error) };

            const user = data.user;

            // Upsert profile row in `users` table
            if (user) {
                await supabase.from('users').upsert({
                    id: user.id,
                    email: email,
                    phone: phone || null,
                    is_guest: false,
                    created_at: new Date().toISOString()
                }, { onConflict: 'id' });
            }

            this._isLocalGuest = false;
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

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) return { success: false, error: this._friendlyError(error) };

            this._isLocalGuest = false;
            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // GUEST LOGIN — local-only guest session
    // ------------------------------------------------
    // No server account is created. A synthetic guest user object
    // is produced so the rest of the app can work uniformly.
    // Progress is saved only in localStorage until the guest converts.
    // Returns: { success: true, user } or { success: false, error }
    async guestLogin() {
        try {
            // Generate a stable local guest ID (persisted across page reloads)
            let guestId = localStorage.getItem('riddleCrest_guestId');
            if (!guestId) {
                guestId = 'guest_' + crypto.randomUUID();
                localStorage.setItem('riddleCrest_guestId', guestId);
            }

            const guestUser = {
                id: guestId,
                email: null,
                isAnonymous: true,
                email_confirmed_at: null
            };

            this.currentUser = guestUser;
            this._isLocalGuest = true;
            this._initialized = true;

            // Notify the auth state callback
            if (this._onAuthChangeCallback) {
                this._onAuthChangeCallback(guestUser);
            }

            return { success: true, user: guestUser };
        } catch (err) {
            return { success: false, error: err.message || 'Guest login failed.' };
        }
    },

    // ------------------------------------------------
    // GUEST → FULL ACCOUNT CONVERSION
    // ------------------------------------------------
    // Creates a real Supabase account and migrates localStorage
    // progress to the database via RCDatabase.migrateGuestData().
    // Returns: { success: true, user } or { success: false, error }
    async convertGuestToAccount(email, password, phone) {
        try {
            if (!this._isLocalGuest) {
                return { success: false, error: 'No guest session to convert.' };
            }
            if (!email || !password) {
                return { success: false, error: 'Email and password are required.' };
            }
            if (password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters.' };
            }

            // Create a real account
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { phone: phone || null }
                }
            });

            if (error) return { success: false, error: this._friendlyError(error) };

            const user = data.user;

            if (user) {
                // Upsert profile
                await supabase.from('users').upsert({
                    id: user.id,
                    email: email,
                    phone: phone || null,
                    is_guest: false,
                    created_at: new Date().toISOString()
                }, { onConflict: 'id' });

                // Migrate guest localStorage data to Supabase
                if (typeof RCDatabase !== 'undefined') {
                    await RCDatabase.migrateGuestData();
                }
            }

            // Clean up local guest state
            localStorage.removeItem('riddleCrest_guestId');
            this._isLocalGuest = false;

            return { success: true, user: user };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // LOG OUT — sign out and clean up
    // ------------------------------------------------
    async logOut() {
        try {
            if (this._isLocalGuest) {
                // Guest logout — just clear local state
                this.currentUser = null;
                this._isLocalGuest = false;
                localStorage.removeItem('riddleCrest_guestId');
                if (this._onAuthChangeCallback) {
                    this._onAuthChangeCallback(null);
                }
                return { success: true };
            }

            const { error } = await supabase.auth.signOut();
            if (error) return { success: false, error: this._friendlyError(error) };

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
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) return { success: false, error: this._friendlyError(error) };
            return { success: true };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // RESEND EMAIL VERIFICATION
    // ------------------------------------------------
    // Supabase does not have a dedicated "resend verification" API
    // for the compat flow. The user can call signUp again with the
    // same email — Supabase will resend the confirmation.
    async resendVerificationEmail() {
        try {
            const user = this.currentUser;
            if (!user || !user.email) {
                return { success: false, error: 'No user is signed in.' };
            }
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: user.email
            });
            if (error) return { success: false, error: this._friendlyError(error) };
            return { success: true };
        } catch (err) {
            return { success: false, error: this._friendlyError(err) };
        }
    },

    // ------------------------------------------------
    // AUTH STATE OBSERVER
    // ------------------------------------------------
    // Listens for Supabase auth state changes (SIGNED_IN, SIGNED_OUT, etc.).
    // Normalizes the user object so script.js sees a consistent shape.
    // Should be called once during app initialization.
    onAuthStateChanged(callback) {
        this._onAuthChangeCallback = callback;

        // Check for an existing session immediately
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                const user = data.session.user;
                this.currentUser = this._normalizeUser(user);
                this._initialized = true;
                callback(this.currentUser);
            } else {
                this.currentUser = null;
                this._initialized = true;
                callback(null);
            }
        });

        // Listen for future auth events
        supabase.auth.onAuthStateChange((event, session) => {
            if (session && session.user) {
                const user = this._normalizeUser(session.user);
                this.currentUser = user;
                this._initialized = true;
                // Avoid double-fire on initial load — the getSession call above handles that
                if (event !== 'INITIAL_SESSION') {
                    callback(user);
                }
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                callback(null);
            }
        });
    },

    // ------------------------------------------------
    // HELPER: Normalize Supabase user to a shape script.js expects
    // ------------------------------------------------
    // script.js expects: { id/uid, email, isAnonymous, emailVerified }
    _normalizeUser(user) {
        if (!user) return null;
        return {
            id: user.id,
            uid: user.id, // alias for compatibility with script.js
            email: user.email || null,
            isAnonymous: false, // real Supabase users are never anonymous
            emailVerified: !!user.email_confirmed_at,
            email_confirmed_at: user.email_confirmed_at,
            user_metadata: user.user_metadata || {}
        };
    },

    // ------------------------------------------------
    // HELPER: Is the current user a guest?
    // ------------------------------------------------
    isGuest() {
        return this._isLocalGuest;
    },

    // ------------------------------------------------
    // HELPER: Is the current user's email verified?
    // ------------------------------------------------
    isEmailVerified() {
        if (this._isLocalGuest) return false;
        return this.currentUser ? !!this.currentUser.emailVerified : false;
    },

    // ------------------------------------------------
    // HELPER: Get display name or email prefix
    // ------------------------------------------------
    getDisplayName() {
        if (!this.currentUser) return 'Player';
        if (this._isLocalGuest) return 'Guest Player';
        if (this.currentUser.email) return this.currentUser.email.split('@')[0];
        return 'Player';
    },

    // ------------------------------------------------
    // HELPER: Translate Supabase error messages to friendly strings
    // ------------------------------------------------
    _friendlyError(err) {
        const msg = (err.message || '').toLowerCase();
        if (msg.includes('user already registered')) return 'An account with this email already exists.';
        if (msg.includes('invalid login credentials')) return 'Incorrect email or password.';
        if (msg.includes('email not confirmed')) return 'Please confirm your email before logging in.';
        if (msg.includes('password') && msg.includes('least')) return 'Password must be at least 6 characters.';
        if (msg.includes('rate limit') || msg.includes('too many')) return 'Too many attempts. Please wait and try again.';
        if (msg.includes('network') || msg.includes('fetch')) return 'Network error. Check your connection.';
        if (msg.includes('invalid email')) return 'Please enter a valid email address.';
        if (msg.includes('user not found')) return 'No account found with this email.';
        if (msg.includes('signup is disabled')) return 'Sign-up is currently disabled. Contact support.';
        return err.message || 'An unexpected error occurred.';
    }
};

console.log('[Auth] Module loaded.');
