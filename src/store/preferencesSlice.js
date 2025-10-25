import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    basic_uses: 0,
    pro_uses: 0,
    ultra_uses: 0,
    bio: '',
    profilePicture: null,
    isLoading: false,
    error: null,
};

const preferencesSlice = createSlice({
    name: "preferences",
    initialState,
    reducers: {
        setPreferences: (state, action) => {
            return { ...state, ...action.payload, isLoading: false, error: null };
        },
        updatePreferences: (state, action) => {
            return { ...state, ...action.payload };
        },
        setPreferencesLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setPreferencesError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearPreferences: () => {
            return initialState;
        },
    },
});

export default preferencesSlice.reducer;
export const {
    setPreferences,
    updatePreferences,
    setPreferencesLoading,
    setPreferencesError,
    clearPreferences,
} = preferencesSlice.actions;
