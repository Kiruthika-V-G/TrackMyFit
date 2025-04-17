import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name : "user",
    initialState : {
        currentUser : null
    },
    reducers : {
        loginSuccess : (state,action) => {
            state.currentUser = action.payload.user;
            localStorage.setItem("trackmyfit-app-token",action.payload.token)
        },
        logout : (state) => {
            state.currentUser = null;
            localStorage.removeItem("trackmyfit-app-token")
        },
    }
})

export const {loginSuccess,logout} = userSlice.actions;
export default userSlice.reducer;