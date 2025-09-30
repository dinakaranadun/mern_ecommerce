import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "./authSliceAPI";

const initialState = {
    user : null
}


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers:(builder)=>{
        builder.addMatcher(
            authApiSlice.endpoints.getUser.matchFulfilled,(state,{payload})=>{
                state.user = payload?._id? payload :null;
            }
        );
        builder.addMatcher(
            authApiSlice.endpoints.getUser.matchRejected,(state)=>{
                state.user = null;
            }
        );
        
    },
});


export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;