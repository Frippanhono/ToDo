import { isValidEmail, validateUser } from "./auth";

export interface LoginResult {
  success: boolean;
  error?: string;
}

export const authService = {
  login: (email: string): LoginResult => {
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    if (!validateUser(email)) {
      return {
        success: false,
        error: "User not found. Please check your email address.",
      };
    }

    return { success: true };
  },
};
