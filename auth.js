// Authentication Module
// Handles user registration, login, logout, and session management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.supabase = window.supabaseClient;
        this.init();
    }

    async init() {
        // Check if user is already logged in
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.onAuthStateChange(this.currentUser);
        }

        // Listen for auth state changes
        this.supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                this.currentUser = session.user;
                this.onAuthStateChange(this.currentUser);
            } else {
                this.currentUser = null;
                this.onAuthStateChange(null);
            }
        });
    }

    /**
     * Register a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} fullName - User full name
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async register(email, password, fullName) {
        try {
            // Validate inputs
            if (!email || !password || !fullName) {
                return { success: false, error: 'All fields are required' };
            }

            if (password.length < 6) {
                return { success: false, error: 'Password must be at least 6 characters' };
            }

            if (!this.isValidEmail(email)) {
                return { success: false, error: 'Please enter a valid email address' };
            }

            // Register user with Supabase Auth
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (error) {
                console.error('Registration error:', error);
                return { success: false, error: error.message };
            }

            // Store additional user info in users table
            const { error: insertError } = await this.supabase
                .from('users')
                .insert([
                    {
                        id: data.user.id,
                        email: email,
                        full_name: fullName,
                        password_hash: this.hashPassword(password) // Optional: for reference
                    }
                ]);

            if (insertError) {
                console.error('Error storing user data:', insertError);
                // Registration succeeded but data storage failed - user can still login
                return {
                    success: true,
                    warning: 'Account created but profile data could not be saved'
                };
            }

            return {
                success: true,
                message: 'Registration successful! Please check your email to confirm your account.'
            };

        } catch (error) {
            console.error('Unexpected error during registration:', error);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async login(email, password) {
        try {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required' };
            }

            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                console.error('Login error:', error);
                return { success: false, error: error.message };
            }

            this.currentUser = data.user;
            return { success: true, user: data.user };

        } catch (error) {
            console.error('Unexpected error during login:', error);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }

    /**
     * Logout user
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                return { success: false, error: error.message };
            }

            this.currentUser = null;
            return { success: true };

        } catch (error) {
            console.error('Unexpected error during logout:', error);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }

    /**
     * Get current user session
     * @returns {Promise<{user: object|null, session: object|null}>}
     */
    async getCurrentSession() {
        const { data: { session } } = await this.supabase.auth.getSession();
        return { user: session?.user || null, session };
    }

    /**
     * Callback when auth state changes
     * Override this to handle UI updates
     */
    onAuthStateChange(user) {
        if (user) {
            console.log('User logged in:', user.email);

            // Identify the signed-in user to Pendo
            if (typeof pendo !== 'undefined') {
                pendo.identify({
                    visitor: {
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : ''
                    },
                    account: {
                        id: user.email ? user.email.split('@')[1] : 'unknown'
                    }
                });
            }

            // Trigger UI update - can be overridden
            this.updateUIForLoggedIn(user);
        } else {
            console.log('User logged out');

            // Re-initialize Pendo with a stable guest identity to maintain event tracking
            if (typeof pendo !== 'undefined') {
                let guestId = localStorage.getItem('pendo_guest_id');
                if (!guestId) {
                    guestId = 'guest-' + crypto.randomUUID();
                    localStorage.setItem('pendo_guest_id', guestId);
                }
                pendo.initialize({
                    visitor: { id: guestId },
                    account: { id: 'guest' }
                });
            }

            this.updateUIForLoggedOut();
        }
    }

    /**
     * Update UI when user logs in
     */
    updateUIForLoggedIn(user) {
        // Hide landing page, show main app
        document.getElementById('landingPage')?.classList.add('hidden');
        document.getElementById('loginForm')?.classList.add('hidden');
        document.getElementById('registerForm')?.classList.add('hidden');
        document.getElementById('mainApp')?.classList.remove('hidden');

        // Show archive button
        const archiveBtn = document.getElementById('archiveBtn');
        if (archiveBtn) {
            archiveBtn.style.display = 'inline-block';
        }

        // Store user email in header greeting container
        const greetingContainer = document.getElementById('userGreetingContainer');
        if (greetingContainer) {
            greetingContainer.innerHTML = `
                <div class="user-greeting">
                    <span data-i18n="welcome">${i18n.get('welcome')}</span>
                    <strong>${user.email}</strong>
                </div>
                <button onclick="authManager.logout().then(() => location.reload());" class="btn-logout" data-i18n="logout">${i18n.get('logout')}</button>
            `;
        }
    }

    /**
     * Update UI when user logs out
     */
    updateUIForLoggedOut() {
        // Show landing page, hide main app
        document.getElementById('mainApp')?.classList.add('hidden');
        document.getElementById('landingPage')?.classList.remove('hidden');

        // Hide archive button
        const archiveBtn = document.getElementById('archiveBtn');
        if (archiveBtn) {
            archiveBtn.style.display = 'none';
        }

        // Clear user greeting container
        const greetingContainer = document.getElementById('userGreetingContainer');
        if (greetingContainer) {
            greetingContainer.innerHTML = '';
        }
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Simple password hash (for reference only, Supabase handles real hashing)
     */
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    /**
     * Get user profile from database
     */
    async getUserProfile(userId) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }

        return data;
    }

    /**
     * Update user profile
     */
    async updateUserProfile(userId, updates) {
        const { data, error } = await this.supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select();

        if (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    }
}

// Initialize auth manager when DOM is ready
let authManager;

document.addEventListener('DOMContentLoaded', function() {
    // Wait for supabase to be available
    const checkSupabase = setInterval(() => {
        if (window.supabaseClient) {
            clearInterval(checkSupabase);
            authManager = new AuthManager();
        }
    }, 100);
});
