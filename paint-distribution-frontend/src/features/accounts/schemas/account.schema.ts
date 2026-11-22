
import type { AccountFormValues } from "../types/account.types";

export type AccountValidationErrors = Partial<
  Record<keyof AccountFormValues, string>
>;

export interface AccountValidationResult {
  isValid: boolean;
  errors: AccountValidationErrors;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAccount(
  values: AccountFormValues,
  isEditing = false
): AccountValidationResult {
  const errors: AccountValidationErrors = {};

  if (!values.first_name.trim()) {
    errors.first_name = "First name is required.";
  }

  if (!values.last_name.trim()) {
    errors.last_name = "Last name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.role.trim()) {
    errors.role = "Please select an account role.";
  }

  if (!isEditing && !values.password) {
    errors.password = "Password is required.";
  } else if (
    values.password &&
    values.password.length < 8
  ) {
    errors.password = "Password must contain at least 8 characters.";
  }

  if (
    values.password &&
    values.password !== values.confirm_password
  ) {
    errors.confirm_password = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
