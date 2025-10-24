import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import darkModeSlice from "./darkmodeSlice";
import postSlice from "./postSlice";
import profileSlice from "./profileSlice";

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "darkMode"], // Only persist auth and darkMode slices
    blacklist: ["post", "profile"], // Don't persist post and profile data for better performance
};

// Auth persist configuration (more specific control)
const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["status", "userData", "isInitialized"], // Only persist essential auth data
    blacklist: ["isLoading", "error"], // Don't persist temporary states
    // Transform to exclude preferences from persistence
    transforms: [
        {
            in: (state) => {
                // When saving to storage, remove preferences
                if (state.userData?.prefs) {
                    return {
                        ...state,
                        userData: {
                            ...state.userData,
                            prefs: undefined // Don't persist preferences
                        }
                    };
                }
                return state;
            },
            out: (state) => {
                // When loading from storage, state will have no prefs
                // They will be fetched fresh on initializeAuth
                return state;
            }
        }
    ]
};

// Combine reducers
const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authSlice),
    darkMode: darkModeSlice,
    post: postSlice,
    profile: profileSlice,
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