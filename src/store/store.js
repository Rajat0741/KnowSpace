import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import darkModeSlice from "./darkmodeSlice";
import postSlice from "./postSlice";
import profileSlice from "./profileSlice";
import preferencesSlice from "./preferencesSlice";

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "darkMode"], // Only persist auth and darkMode slices
    blacklist: ["post", "profile", "preferences"], // Don't persist post, profile, and preferences data
};

// Auth persist configuration (more specific control)
const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["status", "userData", "isInitialized"], // Only persist essential auth data
    blacklist: ["isLoading", "error"], // Don't persist temporary states
};

// Combine reducers
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    darkMode: darkModeSlice,
    post: postSlice,
    profile: profileSlice,
    preferences: preferencesSlice, // Not persisted - refreshes on reload
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    "persist/PERSIST",
                    "persist/REHYDRATE",
                    "persist/PAUSE",
                    "persist/PURGE",
                    "persist/REGISTER",
                ],
            },
        }),
});

export const persistor = persistStore(store);
export default store;