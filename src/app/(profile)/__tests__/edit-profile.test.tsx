// EditProfile.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../edit-profile";

// Mock the useUser hook
jest.mock("@clerk/clerk-expo", () => ({
  useUser: jest.fn(),
}));

// Mock the ImagePicker module
jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
}));

const Stack = createNativeStackNavigator();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="EditProfile" component={() => children} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe("EditProfile", () => {
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    imageUrl: "https://via.placeholder.com/150",
    update: jest.fn(),
    setProfileImage: jest.fn(),
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <EditProfile />
      </TestWrapper>
    );

    expect(getByText("First Name")).toBeTruthy();
    expect(getByPlaceholderText("First Name").props.value).toBe("John");
    expect(getByPlaceholderText("Last Name").props.value).toBe("Doe");
  });


  it("shows an error message if first name is empty", async () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <EditProfile />
      </TestWrapper>
    );

    fireEvent.changeText(getByPlaceholderText("First Name"), ""); 
    fireEvent.press(getByText("SAVE"));

    await waitFor(() => {
      expect(getByText("First name cannot be empty")).toBeTruthy();
    });
  });

  it("shows an error message if last name is empty", async () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <EditProfile />
      </TestWrapper>
    );

    // Clear last name field
    fireEvent.changeText(getByPlaceholderText("Last Name"), ""); 
    fireEvent.press(getByText("SAVE"));

    await waitFor(() => {
      expect(getByText("Last name cannot be empty")).toBeTruthy();
    });
});

it("calls user update with first name and last name on save", async () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <EditProfile />
      </TestWrapper>
    );

    fireEvent.changeText(getByPlaceholderText("First Name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Smith");
    fireEvent.press(getByText("SAVE"));

    await waitFor(() => {
      expect(mockUser.update).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Smith",
      });
      expect(mockUser.setProfileImage).not.toHaveBeenCalled(); 
    });
});


  it("shows success message after saving changes", async () => {
    const { getByText, getByPlaceholderText } = render(
      <TestWrapper>
        <EditProfile />
      </TestWrapper>
    );

    fireEvent.changeText(getByPlaceholderText("First Name"), "Jane");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Smith");
    fireEvent.press(getByText("SAVE"));

    await waitFor(() => {
      expect(getByText("Your changes are saved")).toBeTruthy();
    });
  });
});
