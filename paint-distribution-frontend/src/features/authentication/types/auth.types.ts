
export interface AuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  phone?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  uid: string;
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Request payload for refreshing an access token.
 */
export interface RefreshTokenRequest {
  refresh: string;
}

/**
 * Response returned after successfully refreshing a token.
 */
export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

/**
 * Standard API message response.
 */
export interface ApiMessageResponse {
  message: string;
  detail?: string;
  success?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthErrorResponse {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}
