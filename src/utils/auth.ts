import userData from "../Data/user_tasks.json";

export const validateUser = (email: string): boolean => {
  const users = userData;
  return users.some(user => user.email.toLowerCase() === email.toLowerCase());
};

export const isValidEmail = (email: string): boolean => {
  // Check if email is empty
  if (!email || email.trim() === "") {
    return false;
  }

  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check minimum length
  if (email.length < 5) {
    return false;
  }

  // Check maximum length
  if (email.length > 254) {
    return false;
  }

  return true;
};
