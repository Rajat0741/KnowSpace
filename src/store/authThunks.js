import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../appwrite/auth";
import { login, logout, setLoading, setError, setInitialized } from "./authSlice";
import { loadProfilePicture } from "./profileSlice";

// Async thunk for initializing auth state
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { dispatch, getState }) => {
        const { auth } = getState();
        
        // Skip if already initialized
        if (auth.isInitialized) {
            return;
        }

        try {
            dispatch(setLoading(true));
            const userData = await authService.getCurrentUser();
            
            if (userData) {
                dispatch(login({ userData }));
                dispatch(loadProfilePicture());
                return { success: true, userData };
            } else {
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
            
            throw new Error("Failed to create session");
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
            await authService.logout();
            dispatch(logout());
            return { success: true };
        } catch (error) {
            console.log("Logout error:", error);
            // Even if logout fails on server, clear local state
            dispatch(logout());
            return { success: true };
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