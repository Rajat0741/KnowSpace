import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import darkModeSlice from "./darkmodeSlice"
import postSlice from "./postSlice"
import profileSlice from "./profileSlice"

const store = configureStore({
    reducer:{
        auth : authSlice,
        darkMode: darkModeSlice,
        post: postSlice,
        profile: profileSlice
    }
})

export default store;