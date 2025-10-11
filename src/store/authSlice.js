import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    isLoading: false,
    error: null,
    isInitialized: false, // Track if auth has been checked on app start
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
            if (action.payload) {
                state.error = null; // Clear errors when starting new operation
            }
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setInitialized: (state) => {
            state.isInitialized = true;
            state.isLoading = false;
        },
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.isLoading = false;
            state.error = null;
            state.isInitialized = true;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.isLoading = false;
            state.error = null;
            state.isInitialized = true;
        },
        updateUserData: (state, action) => {
            if (state.userData) {
                state.userData = { ...state.userData, ...action.payload };
            }
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Handle async thunk states if needed
        builder
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => {
                    state.isLoading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected'),
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.error?.message || 'An error occurred';
                }
            );
    }
})

export default authSlice.reducer;
export const {
    login,
    logout,
    updateUserData,
    setLoading,
    setError,
    setInitialized,
    clearError
} = authSlice.actions;