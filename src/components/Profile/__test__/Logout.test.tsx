import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Logout from "../Logout";
import { useAuth } from "@clerk/clerk-expo";

// Mock the useAuth hook
jest.mock("@clerk/clerk-expo", () => ({
  useAuth: jest.fn(),
}));

describe("Logout Component", () => {
  it("should call signOut when confirmLogout is triggered", async () => {
    const signOutMock = jest.fn();

    // Mock the signOut function from useAuth
    (useAuth as jest.Mock).mockReturnValue({
      signOut: signOutMock,
    });

    // Render the Logout component
    const { getByText, findByTestId } = render(<Logout />);

    // Trigger logout modal
    fireEvent.press(getByText("Sign out"));

    // Ensure the modal content is visible
    const confirmButton = await findByTestId("signout-button");
    expect(confirmButton).toBeTruthy();

    // Trigger the confirm logout
    fireEvent.press(confirmButton);

    // Wait for the signOut function to be called
    await waitFor(() => {
      expect(signOutMock).toHaveBeenCalled();
    });
  });
});
