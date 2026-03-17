import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import type { AuthState } from "./types";

export interface CombinedReducerType {
  auth: AuthState;
}

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
