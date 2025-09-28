import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => {
    const stored = localStorage.getItem('isDarkMode')
    if (stored !== null) {
        return stored === 'true'
    }
    return true // default value
}

const initialState = {
    isDarkMode: getInitialDarkMode()
}

const darkModeSlice = createSlice({
    name: "darkMode",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode
            localStorage.setItem('isDarkMode', state.isDarkMode)
        }
    }
})

export const { toggleDarkMode } = darkModeSlice.actions
export default darkModeSlice.reducer