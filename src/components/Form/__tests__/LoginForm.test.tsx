import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginForm from "../LoginForm";
import { useSignIn } from "@clerk/clerk-expo";

jest.mock("@clerk/clerk-expo", () => ({
  useSignIn: jest.fn(),
}));

const mockSignIn = jest.fn();
const mockSetActive = jest.fn();
const mockIsLoaded = true;

beforeEach(() => {
  (useSignIn as jest.Mock).mockReturnValue({
    signIn: { create: mockSignIn },
    setActive: mockSetActive,
    isLoaded: mockIsLoaded,
  });
  jest.useFakeTimers(); 
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("submits the form successfully", async () => {
  mockSignIn.mockResolvedValueOnce({ createdSessionId: "fake-session-id" });

  const { getByPlaceholderText, getByText } = render(<LoginForm />);

  fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
  fireEvent.changeText(getByPlaceholderText("Password"), "password123");
  fireEvent.press(getByText("Sign In"));

  await waitFor(() => {
    expect(mockSignIn).toHaveBeenCalledWith({
      identifier: "test@example.com",
      password: "password123",
    });
    expect(mockSetActive).toHaveBeenCalledWith({ session: "fake-session-id" });
  });
});

test("shows error message on failed sign-in", async () => {
  mockSignIn.mockRejectedValueOnce({
    errors: [{ message: "Invalid credentials" }],
  });

  const { getByPlaceholderText, getByText, findByText } = render(<LoginForm />);

  fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
  fireEvent.changeText(getByPlaceholderText("Password"), "password123");
  fireEvent.press(getByText("Sign In"));

  const errorMessage = await findByText("Invalid credentials");
  expect(errorMessage).toBeTruthy();
});
