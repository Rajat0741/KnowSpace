import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../appwrite/auth";
import { login, logout, setLoading, setError, setInitialized } from "./authSlice";
import { loadProfilePicture } from "./profileSlice";
import { setPreferences, clearPreferences, setPreferencesLoading, setPreferencesError } from "./preferencesSlice";

// Async thunk for initializing auth state
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { dispatch, getState }) => {
        try {
            dispatch(setLoading(true));
            
            const userData = await authService.getCurrentUser();
            
            if (userData) {
                // Login user without preferences in userData
                dispatch(login({ userData }));
                
                // ALWAYS fetch preferences when user is authenticated (even on reload)
                // This ensures preferences are refreshed every time the app loads
                try {
                    dispatch(setPreferencesLoading(true));
                    const freshPrefs = await authService.getPreferences();
                    dispatch(setPreferences(freshPrefs));
                    
                    // Load profile picture after preferences are set
                    // This ensures ProfilePicture component has correct preferences data
                    await dispatch(loadProfilePicture());
                } catch (prefsError) {
                    // If preferences fetch fails, log error but continue
                    console.log("Could not fetch preferences:", prefsError);
                    dispatch(setPreferencesError(prefsError.message));
                }
                
                return { success: true, userData };
            } else {
                // If no user but we have persisted auth state, clear it
                const persistedAuth = getState().auth;
                if (persistedAuth.status) {
                    try {
                        localStorage.removeItem('persist:auth');
                        localStorage.removeItem('persist:root');
                    } catch {
                        // Silent cleanup
                    }
                }
                
                dispatch(logout());
                return { success: true, userData: null };
            }
        } catch (error) {
            console.log("Auth initialization error:", error);
            dispatch(setError(error.message || "Authentication check failed"));
            dispatch(logout());
            throw error;
        } finally {
            dispatch(setInitialized());
        }
    }
);

// Async thunk for logging in with Google
export const loginWithGoogle = createAsyncThunk(
    'auth/loginWithGoogle',
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const result = await authService.loginWithGoogle();
            return result;
        } catch (error) {
            console.log("Google login error:", error);
            dispatch(setError(error.message || "Google login failed"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Async thunk for handling OAuth callback
export const handleOAuthCallback = createAsyncThunk(
    'auth/handleOAuthCallback',
    async ({ userId, secret }, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            
            const session = await authService.handleOAuthCallback(userId, secret);
            
            if (session) {
                const userData = await authService.getCurrentUser();
                
                if (userData) {
                    dispatch(login({ userData }));
                    dispatch(loadProfilePicture());
                    return { success: true, userData };
                }
            }
            
            throw new Error("Failed to create session or retrieve user data");
        } catch (error) {
            console.log("OAuth callback error:", error);
            dispatch(setError(error.message || "Authentication failed"));
            dispatch(logout());
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Async thunk for logging out
export const performLogout = createAsyncThunk(
    'auth/performLogout',
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            
            // Attempt to logout from server
            await authService.logout();
            
            // Clear local state
            dispatch(logout());
            dispatch(clearPreferences());
            
            // Clear any persisted auth data
            try {
                localStorage.removeItem('persist:auth');
                localStorage.removeItem('persist:root');
            } catch {
                // Silent cleanup
            }
            
            return { success: true };
        } catch (error) {
            // Even if logout fails on server, clear local state
            dispatch(logout());
             
            // Still clear persisted data
            try {
                localStorage.removeItem('persist:auth');
                localStorage.removeItem('persist:root');
            } catch {
                // Silent cleanup
            }
            
            // Don't throw the error - we want logout to succeed locally even if server fails
            return { success: true, serverError: error.message };
        } finally {
            dispatch(setLoading(false));
        }
    }
);

// Async thunk for refreshing user data
export const refreshUserData = createAsyncThunk(
    'auth/refreshUserData',
    async (_, { dispatch }) => {
        try {
            const userData = await authService.getCurrentUser();
            
            if (userData) {
                dispatch(login({ userData }));
                return { success: true, userData };
            } else {
                dispatch(logout());
                return { success: false, userData: null };
            }
        } catch (error) {
            console.log("Refresh user data error:", error);
            dispatch(setError(error.message || "Failed to refresh user data"));
            throw error;
        }
    }
);