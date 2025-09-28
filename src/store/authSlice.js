import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status:false,
    userData:null,
};
/**
 * User data structure from Appwrite:
 * {
  "$id": "$id",
  "$createdAt": "$createdAt",
  "$updatedAt": "$updatedAt",
  "name": "name",
  "registration": "registration",
  "status": "status",
  "labels": "labels",
  "passwordUpdate": "passwordUpdate",
  "email": "email",
  "phone": "phone",
  "emailVerification": "emailVerification",
  "phoneVerification": "phoneVerification",
  "mfa": "mfa",
  "prefs": {
    "profilePictureId": "profilePictureId"
  },
  "targets": [
    {
      "$id": "$id",
      "$createdAt": "$createdAt",
      "$updatedAt": "$updatedAt",
      "name": "name",
      "userId": "userId",
      "providerId": "providerId",
      "providerType": "providerType",
      "identifier": "identifier",
      "expired": "expired"
    }
  ],
  "accessedAt": "accessedAt"
}
 */


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