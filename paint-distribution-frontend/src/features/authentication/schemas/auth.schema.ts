
import type {
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLogin(
  data: LoginCredentials
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateForgotPassword(
  data: ForgotPasswordRequest
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateResetPassword(
  data: ResetPasswordRequest
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.new_password) {
    errors.new_password = "New password is required.";
  } else if (data.new_password.length < 8) {
    errors.new_password =
      "Password must contain at least 8 characters.";
  }

  if (!data.confirm_password) {
    errors.confirm_password =
      "Please confirm your password.";
  } else if (
    data.new_password !== data.confirm_password
  ) {
    errors.confirm_password =
      "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
