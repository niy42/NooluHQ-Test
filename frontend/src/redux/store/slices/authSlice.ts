import {
  createSlice,
  type PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import type { AuthState, OnboardingProgress, User } from "../types";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  onboardingToken: null,
  email: "",
  onboardingProgress: {
    currentStep: 1,
    completedSteps: [],
    totalSteps: 4,
    percentage: 0,
    isComplete: false,
  },
  refreshToken: null,
  isLoading: false,
  isLoggingOut: false,
  resetEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) => {
      const timestamp = new Date().toISOString();

      state.user = action.payload.user;
      state.accessToken = {
        token: action.payload.accessToken,
        timestamp,
      };
      state.refreshToken = action.payload.refreshToken
        ? { token: action.payload.refreshToken, timestamp }
        : null;

      state.onboardingToken = null;

      state.isLoading = false;
    },

    setOnboardingToken: (state, action: PayloadAction<string>) => {
      const timestamp = new Date().toISOString();
      state.onboardingToken = {
        token: action.payload,
        timestamp,
      };
      state.accessToken = null;
    },

    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },

    refreshAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>,
    ) => {
      state.accessToken = {
        token: action.payload.accessToken,
        timestamp: new Date().toISOString(),
      };
    },

    setOnboardingProgress: (
      state,
      action: PayloadAction<OnboardingProgress>,
    ) => {
      state.onboardingProgress = action.payload;
    },

    updateCurrentStep: (state, action: PayloadAction<number>) => {
      state.onboardingProgress.currentStep = action.payload;
    },

    resetOnboardingProgress: (state) => {
      state.onboardingProgress = {
        currentStep: 1,
        completedSteps: [],
        totalSteps: 4,
        percentage: 0,
        isComplete: false,
      };
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logoutUser: () => initialState,

    clearOnboardingToken: (state) => {
      state.onboardingToken = null;
    },
  },
});

export const {
  loginSuccess,
  setOnboardingToken,
  setEmail,
  refreshAccessToken,
  updateUserProfile,
  logoutUser,
  clearOnboardingToken,
  setOnboardingProgress,
  updateCurrentStep,
  resetOnboardingProgress,
} = authSlice.actions;

const selectAuth = (state: { auth: AuthState }) => state.auth;

export const selectAuthState = createSelector([selectAuth], (auth) => auth);

export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.user,
);

export const selectAccessToken = createSelector(
  [selectAuth],
  (auth) => auth.accessToken?.token ?? null,
);

export const selectOnboardingToken = createSelector(
  [selectAuth],
  (auth) => auth.onboardingToken?.token ?? null,
);

export const selectRefreshToken = createSelector(
  [selectAuth],
  (auth) => auth.refreshToken?.token ?? null,
);

export const selectOnboardingProgress = createSelector(
  [(state: { auth: AuthState }) => state.auth],
  (auth) => auth.onboardingProgress,
);

export const selectCurrentStep = createSelector(
  [selectOnboardingProgress],
  (progress) => progress.currentStep,
);

export const selectCompletedSteps = createSelector(
  [selectOnboardingProgress],
  (progress) => progress.completedSteps,
);

export const selectEmail = createSelector([selectAuth], (auth) => auth.email);

// Returns the most appropriate token to use right now
export const selectAuthToken = createSelector([selectAuth], (auth) => {
  if (auth.accessToken?.token) return auth.accessToken.token;
  if (auth.onboardingToken?.token) return auth.onboardingToken.token;
  return null;
});

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => !!auth.accessToken?.token,
);

export const selectIsOnboarding = createSelector(
  [selectAuth],
  (auth) => !!auth.onboardingToken?.token && !auth.accessToken?.token,
);

export const selectIsLoading = createSelector(
  [selectAuth],
  (auth) => auth.isLoading,
);

export const selectIsLoggingOut = createSelector(
  [selectAuth],
  (auth) => auth.isLoggingOut,
);

export const selectResetEmail = createSelector(
  [selectAuth],
  (auth) => auth.resetEmail,
);

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "accessToken", "onboardingToken", "refreshToken"],
};

export default persistReducer(authPersistConfig, authSlice.reducer);
