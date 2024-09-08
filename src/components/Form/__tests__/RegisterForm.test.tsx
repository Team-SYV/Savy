import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { useSignUp } from "@clerk/clerk-expo";
import RegisterForm from "../RegisterForm";

// Mock useSignUp hook from @clerk/clerk-expo
jest.mock("@clerk/clerk-expo", () => ({
  useSignUp: jest.fn(),
}));

describe("RegisterForm", () => {
  let mockSignUpCreate;
  let mockSignUpPrepareEmailAddressVerification;
  let mockSignUpAttemptEmailAddressVerification;
  let mockSetActive;

  beforeEach(() => {
    jest.useFakeTimers(); 

    mockSignUpCreate = jest.fn();
    mockSignUpPrepareEmailAddressVerification = jest.fn();
    mockSignUpAttemptEmailAddressVerification = jest.fn();
    mockSetActive = jest.fn();

    (useSignUp as jest.Mock).mockReturnValue({
      isLoaded: true,
      signUp: {
        create: mockSignUpCreate,
        prepareEmailAddressVerification: mockSignUpPrepareEmailAddressVerification,
        attemptEmailAddressVerification: mockSignUpAttemptEmailAddressVerification,
      },
      setActive: mockSetActive,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); 
  });

  it("should successfully call signUp.create and show verification modal", async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterForm />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john.doe@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Password123");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "Password123");

    mockSignUpCreate.mockResolvedValueOnce({});
    mockSignUpPrepareEmailAddressVerification.mockResolvedValueOnce({});

    await act(async () => {
      fireEvent.press(getByText("Sign Up"));
      jest.runAllTimers(); 
    });

    await waitFor(() => {
      expect(mockSignUpCreate).toHaveBeenCalledWith({
        emailAddress: "john.doe@example.com",
        password: "Password123",
        firstName: "John",
        lastName: "Doe",
      });

      expect(getByText("Email Verification")).toBeTruthy();
    });
  });

  it("should handle signUp failure and show general error message", async () => {
    const { getByText, getByPlaceholderText } = render(<RegisterForm />);

    fireEvent.changeText(getByPlaceholderText("First Name"), "John");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Doe");
    fireEvent.changeText(getByPlaceholderText("Email"), "john.doe@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Password123");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "Password123");

    mockSignUpCreate.mockRejectedValueOnce({
      errors: [{ message: "Sign up failed" }],
    });

    await act(async () => {
      fireEvent.press(getByText("Sign Up"));
      jest.runAllTimers(); 
    });

    await waitFor(() => {
      expect(getByText("Sign up failed")).toBeTruthy();
    });
  });
});
