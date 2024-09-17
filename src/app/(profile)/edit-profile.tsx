import { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import CustomFormField from "@/components/FormField/CustomFormField";
import CustomButton from "@/components/Button/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const EditProfile = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [imageUri, setImageUri] = useState(user?.imageUrl || "");
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Handles the process of saving user profile updates.
  const handleSaveUser = async () => {
    if (!firstName.trim()) {
      showMessage("First name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await user?.update({
        firstName,
        lastName,
      });

      if (newImageUri) {
        const base64 = `data:image/png;base64,${newImageUri}`;
        await user?.setProfileImage({
          file: base64,
        });
      }

      showMessage("Your changes are saved");
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      showMessage("Failed to update profile.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Opens the image picker to select a new image and updates the states for the new image URI and display image URI.
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      setNewImageUri(result.assets[0].base64 || "");
      setImageUri(result.assets[0].uri || "");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Spinner visible={loading} color="#00AACE" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex pt-12 bg-white min-h-full">
          <View className="flex items-center justify-center">
            <Image
              source={{ uri: imageUri || "https://via.placeholder.com/150" }}
              className="h-32 w-32 rounded-full border-2 border-[#008FAE]"
              style={{ resizeMode: "cover" }}
            />

            <TouchableOpacity
              onPress={handleImagePicker}
              disabled={loading}
              className="mt-2"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <View className="border border-[#008FAE] py-2 px-2 rounded-lg flex-row items-center">
                <MaterialCommunityIcons
                  name="pencil"
                  size={16}
                  color="#008FAE"
                />
                <Text className="ml-1 font-medium text-gray-700">
                  Change avatar
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text className="mt-10 mx-5 mb-1 text-sm font-semibold text-gray-800">
            First Name
          </Text>
          <CustomFormField
            title="firstName"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            otherStyles="mx-4"
          />
          <Text className="mt-6 mx-5 mb-1 text-sm font-semibold text-gray-800">
            Last Name
          </Text>
          <CustomFormField
            title="lastName"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            otherStyles="mx-4 mb-12"
          />

          <View className="absolute bottom-1 left-0 right-0 flex-row flex items-center justify-center px-4">
            <CustomButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              containerStyles={`border border-[#00AACE] h-14 rounded-xl mb-4 mx-1 w-1/2`}
              textStyles="text-[#00AACE] text-[16px] font-semibold"
              disabled={loading}
            />

            <CustomButton
              title="SAVE"
              onPress={handleSaveUser}
              containerStyles={`bg-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-1`}
              textStyles="text-white text-[16px] font-semibold"
              disabled={loading}
            />
          </View>

          {message && (
            <View className="absolute bottom-24 left-0 right-0 z-10 bg-gray-600 rounded-full py-3 px-1 mx-28">
              <Text className="text-center text-white">{message}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
