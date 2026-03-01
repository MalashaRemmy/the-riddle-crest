// ============================================
// DATABASE PERSISTENCE MODULE (Supabase)
// ============================================
// Handles all Supabase read/write operations for per-user
// game progress. Falls back to localStorage when offline,
// when the user is a local guest, or when no Supabase session
// is available.
//
// Supabase table: `game_progress`
//   id          UUID  PRIMARY KEY  DEFAULT gen_random_uuid()
//   user_id     UUID  NOT NULL  REFERENCES auth.users(id)
//   data        JSONB NOT NULL  DEFAULT '{}'
//   updated_at  TIMESTAMPTZ  DEFAULT now()
//
// Dependencies: supabase-config.js (provides `supabase` global)
//               auth.js (provides `RCAuth` global — used to check guest state)
// Consumed by: script.js (via the global RCDatabase object)
// ============================================

const RCDatabase = {

    // ------------------------------------------------
    // SAVE — persist game progress to Supabase
    // ------------------------------------------------
    // Upserts a row in the `game_progress` table keyed by user_id.
    // Falls back to localStorage for guests or on error.
    async save(data) {
        try {
            // If local guest, only use localStorage
            if (typeof RCAuth !== 'undefined' && RCAuth._isLocalGuest) {
                this._saveToLocalStorage(data);
                return;
            }

            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;
            if (!user) {
                this._saveToLocalStorage(data);
                return;
            }

            const payload = {
                user_id: user.id,
                data: {
                    currentRound: data.currentRound,
                    roundReplays: data.roundReplays,
                    overallProgress: data.overallProgress,
                    session: {
                        isGuest: false,
                        email: user.email || null,
                        isLoggedIn: true
                    }
                },
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('game_progress')
                .upsert(payload, { onConflict: 'user_id' });

            if (error) throw error;

            // Also keep a localStorage mirror for fast offline access
            this._saveToLocalStorage(data);
        } catch (err) {
            console.error('[DB] Supabase save failed, using localStorage:', err.message);
            this._saveToLocalStorage(data);
        }
    },

    // ------------------------------------------------
    // LOAD — retrieve game progress from Supabase
    // ------------------------------------------------
    // Reads the authenticated user's progress row.
    // Falls back to localStorage if Supabase is unavailable.
    // Returns: data object or null
    async load() {
        try {
            // If local guest, only use localStorage
            if (typeof RCAuth !== 'undefined' && RCAuth._isLocalGuest) {
                return this._loadFromLocalStorage();
            }

            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;
            if (!user) {
                return this._loadFromLocalStorage();
            }

            const { data: rows, error } = await supabase
                .from('game_progress')
                .select('data')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            if (error) throw error;

            if (rows && rows.data) {
                // Mirror to localStorage for offline access
                this._saveToLocalStorage(rows.data);
                return rows.data;
            }

            // No Supabase data — check localStorage for migrateable data
            return this._loadFromLocalStorage();
        } catch (err) {
            console.warn('[DB] Supabase load failed, using localStorage:', err.message);
            return this._loadFromLocalStorage();
        }
    },

    // ------------------------------------------------
    // DELETE — remove all game data for the current user
    // ------------------------------------------------
    // Called on full game reset or account deletion.
    async deleteProgress() {
        try {
            if (typeof RCAuth !== 'undefined' && RCAuth._isLocalGuest) {
                this._clearLocalStorage();
                return;
            }

            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;
            if (user) {
                await supabase
                    .from('game_progress')
                    .delete()
                    .eq('user_id', user.id);
            }
            this._clearLocalStorage();
        } catch (err) {
            console.error('[DB] Supabase delete failed:', err.message);
            this._clearLocalStorage();
        }
    },

    // ------------------------------------------------
    // MIGRATE GUEST DATA — copy localStorage data to
    // Supabase after guest-to-account conversion.
    // ------------------------------------------------
    async migrateGuestData() {
        try {
            const localData = this._loadFromLocalStorage();
            if (!localData) return;

            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData?.session?.user;
            if (!user) return;

            // Check if Supabase already has data for this user
            const { data: existing, error: fetchErr } = await supabase
                .from('game_progress')
                .select('user_id')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            if (fetchErr) throw fetchErr;

            // Only migrate if no row exists yet
            if (!existing) {
                const { error } = await supabase
                    .from('game_progress')
                    .insert({
                        user_id: user.id,
                        data: {
                            currentRound: localData.currentRound || 1,
                            roundReplays: localData.roundReplays || {},
                            overallProgress: localData.overallProgress || {},
                            session: {
                                isGuest: false,
                                email: user.email || null,
                                isLoggedIn: true
                            }
                        },
                        updated_at: new Date().toISOString()
                    });

                if (error) throw error;
                console.log('[DB] Guest data migrated to Supabase.');
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
