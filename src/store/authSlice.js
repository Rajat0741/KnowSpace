import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:false,
    userData:null,
};

const authSlice = createSlice({
    name: "auth",
  initialState,
  reducers: {
    login:(state, action)=>{
        state.status = true;
        state.userData = action.payload.userData;
    }
    ,
    logout:(state)=>{
      state.status = false;
      state.userData = null;
    },
    updateUserData:(state, action)=>{
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    }
  }
})

export default authSlice.reducer;
export const {login,logout, updateUserData} = authSlice.actions;