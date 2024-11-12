"use client";
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: null,
    email: null,
    profile_name: "",
    first_name: "",
    last_name: "",
    stripe_customer_id: null,
    stripe_subscription_id: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUserId: (state, action) => {
      state.user_id = action.payload
    },
    setUserEmail: (state, action) => {
        state.email = action.payload
    },
    setUserProfileName: (state, action) => {
        state.profile_name = action.payload
    },
    setUserFirstName: (state, action) => {
        state.first_name = action.payload
    },
    setUserLastName: (state, action) => {
        state.last_name = action.payload
    },
    setUserStripeCustomerId: (state, action) => {
        state.stripe_customer_id = action.payload
    },
    setUserStripeSubscriptionId: (state, action) => {
        state.stripe_subscription_id = action.payload
    },
    setUser: (state, action) => {
        const user = action.payload.user;
        state.user = user;
    },

    logout: (state, action) => {
        // state.user_id = null;
        // state.email = null;
        // state.profile_name = "";
        // state.first_name = "";
        // state.last_name = "";
        // state.stripe_customer_id = null;
        // state.stripe_subscription_id = null;
        state.user = initialState;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserId, setUser, logout } = userSlice.actions
export default userSlice.reducer

