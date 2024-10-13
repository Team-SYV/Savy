export const validateFirstName = (
  firstname: string,
  submitted: boolean
): string => {
  return firstname ? "" : submitted ? "Firstname is required" : "Required";
};

export const validateLastName = (
  lastname: string,
  submitted: boolean
): string => {
  return lastname ? "" : submitted ? "Lastname is required" : "Required";
};

export const validateEmail = (email: string, submitted: boolean): string => {
  if (!email) return submitted ? "Email is required" : "Required";
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email) ? "" : "Enter a valid email";
};

export const validatePassword = (
  password: string,
  submitted: boolean
): string => {
  if (!password) return submitted ? "Password is required" : "Required";

  const errors: string[] = [];

  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("a capital letter");
  if (!/\d/.test(password)) errors.push("a number");

  return errors.length ? `Password must include ${errors.join(", ")}.` : "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
  submitted: boolean
): string => {
  if (!confirmPassword)
    return submitted ? "Confirm Password is required" : "Required";
  return password === confirmPassword ? "" : "Passwords do not match";
};
