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

    // Save login state to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    return { success: true };
  },

  logout: (): void => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
  },

  getStoredLoginState: (): { isLoggedIn: boolean; userEmail: string } => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail") || "";
    return { isLoggedIn, userEmail };
  },
};
