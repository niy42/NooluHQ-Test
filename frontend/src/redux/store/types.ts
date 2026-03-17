export interface AuthReduxState {
  refreshToken?: { _time_stamp: string };
  accessToken?: { _time_stamp: string };
}

export type CombinedReducerType = {
  authentication: AuthReduxState;
};

export interface TokenData {
  token: string;
  timestamp: string;
}

export interface Profile {
  id: number;
  userId: number;
  address: string;
  city: string;
  state: string;
  countryCode: string | null;
  postalCode: string | null;
  photo: string | null;
}

export interface Customer {
  id: number;
  userId: number;
  status: string;
}

export interface User {
  id: number;
  uuid: string;
  email: string;
  phone: string;
  role: string;
  name: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLogin: string;
  mfaEnabled: boolean;
  enableEmailNotification: boolean;
  enableSmsNotification: boolean;
  enableInAppNotification: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps?: number;
  percentage?: number;
  isComplete?: boolean;
}

interface TokenInfo {
  token: string | null;
  timestamp: string;
}

export interface AuthState {
  user: User | null;
  accessToken: TokenInfo | null;
  onboardingToken: { token: string | null; timestamp: string } | null;
  refreshToken: { token: string | null; timestamp: string } | null;
  onboardingProgress: OnboardingProgress; // ← NEW: progress state
  isLoading: boolean;
  isLoggingOut: boolean;
  resetEmail: string | null;
}
