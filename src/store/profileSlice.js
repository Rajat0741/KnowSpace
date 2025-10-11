import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/appwrite/auth";
import { logout } from "./authSlice";

// Async thunk to load profile picture
export const loadProfilePicture = createAsyncThunk(
    'profile/loadProfilePicture',
    async () => {
        try {
            const url = await authService.getProfilePictureUrl();
            return url;
        } catch (error) {
            console.log('Error loading profile picture:', error);
            return null;
        }
    }
);

const initialState = {
    profilePictureUrl: null,
    isLoading: false,
    hasCheckedProfilePicture: false // Track if we've already checked for profile picture
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfilePicture: (state, action) => {
            state.profilePictureUrl = action.payload;
            state.hasCheckedProfilePicture = true;
        },
        clearProfilePicture: (state) => {
            state.profilePictureUrl = null;
            state.hasCheckedProfilePicture = true;
        },
        setProfileLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetProfileCheck: (state) => {
            state.hasCheckedProfilePicture = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProfilePicture.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loadProfilePicture.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profilePictureUrl = action.payload;
                state.hasCheckedProfilePicture = true;
            })
            .addCase(loadProfilePicture.rejected, (state) => {
                state.isLoading = false;
                state.profilePictureUrl = null;
                state.hasCheckedProfilePicture = true;
            })
            // Clear profile picture when user logs out
            .addCase(logout, (state) => {
                state.profilePictureUrl = null;
                state.isLoading = false;
                state.hasCheckedProfilePicture = false;
            });
    }
})

export const { setProfilePicture, clearProfilePicture, setProfileLoading, resetProfileCheck } = profileSlice.actions;

export default profileSlice.reducer;
