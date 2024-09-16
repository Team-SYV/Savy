import React, { useState } from "react";
import { Pressable, Text, View, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@clerk/clerk-expo";
import CustomButton from "../Button/CustomButton";

const Logout = () => {
  const { signOut } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  // Logout confirmation
  const confirmLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out error:", error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  const cancelLogout = () => {
    setIsModalVisible(false);
  };

  return (
    <View>
      <Pressable
        onPress={handleLogout}
        className="flex-row items-center justify-between p-4 border-b-2 border-gray-500 rounded-lg mx-6 mt-12"
      >
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={22} className="mr-2" />
          <Text className="text-base">Sign out</Text>
        </View>
        <AntDesign name="right" size={18} />
      </Pressable>

      <Modal
        transparent={true}
        animationType="none"
        visible={isModalVisible}
        onRequestClose={cancelLogout}
      >
        <View className="flex-1 justify-center items-center bg-black/20">
          <View className="w-4/5 p-5 bg-white rounded-lg">
            <Text className="text-lg mb-4">Sign out of your account?</Text>
            {isLoading ? (
              <View className="flex-row justify-center">
                <ActivityIndicator size="large" color={"#00AACE"} />
              </View>
            ) : (
              <View className="flex-row justify-end">
                <CustomButton
                  title="Cancel"
                  onPress={cancelLogout}
                  containerStyles="mr-5 py-2 px-3"
                  textStyles="text-black text-lg"
                />
                <CustomButton
                  title="Sign out"
                  onPress={confirmLogout}
                  containerStyles="bg-red-500 py-2 px-3 rounded-lg"
                  textStyles="text-white text-lg"
                  testID="signout-button"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Logout;
