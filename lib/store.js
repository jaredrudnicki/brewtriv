"use client";
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from '@/lib/user/userSlice'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
  //stateReconciler: hardSet,
}

const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  //middleware: [thunk]
})

export const persistor = persistStore(store)