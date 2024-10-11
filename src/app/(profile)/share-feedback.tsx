import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextArea from "@/components/TextArea/TextArea";
import CustomButton from "@/components/Button/CustomButton";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Toast from "react-native-toast-message";

const ShareFeedback = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const numberOfStars = 5;

  const handlePress = (index: number) => {
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) {
      Toast.show({
        type: "error",
        text1: "Rating Required",
        text2: "Please select a rating before submitting your feedback.",
        topOffset: 0,
      });
      return;
    }
    if (!feedback.trim()) {
      Toast.show({
        type: "error",
        text1: "Feedback Required",
        text2: "Please provide your feedback.",
        topOffset: 0,
      });
      return;
    }

    setLoading(true);
    const rating = selectedIndex + 1;

    // Simulating a submission process
    setTimeout(() => {
      setLoading(false);
      console.log({ feedback, rating });

      // Reset form state
      setFeedback("");
      setSelectedIndex(null);
      Toast.show({
        type: "success",
        text1: "Feedback Submitted",
        text2: `Thank you for submitting your feedback`,
        topOffset: 0,
      });
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4 bg-white">
          <Image
            source={require("@/assets/images/give-feedback.png")}
            className="w-36 h-36 mx-auto"
            resizeMode="contain"
          />

          <Text className="text-[20px] mt-2 text-center font-semibold">
            Help us improve!
          </Text>

          <Text className="text-lg mt-1 text-center">
            How was your experience using Savy?
          </Text>

          <View className="flex-row items-center justify-center mt-4">
            {[...Array(numberOfStars)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(index)}
                className="mx-2"
              >
                <AntDesign
                  name={
                    selectedIndex !== null && selectedIndex >= index
                      ? "star"
                      : "staro"
                  }
                  size={35}
                  color={
                    selectedIndex !== null && selectedIndex >= index
                      ? "orange"
                      : "gray"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-8">
            <Text className="mb-4 text-base text-center">
              Did Savy help you feel more confident and improve your interview
              performance?
            </Text>

            <TextArea
              value={feedback}
              onChangeText={(text) => setFeedback(text)}
              placeholder="Share your feedback"
              textInputStyles="h-72 ml-0 mb-24"
            />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-1 left-0 right-0 flex-row items-center justify-center px-4">
        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          containerStyles={`border border-[#00AACE] h-[46px] rounded-xl mb-4 mx-1 w-1/2`}
          textStyles="text-[#00AACE] text-[15px] font-semibold"
          disabled={loading}
        />

        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          containerStyles={`bg-[#00AACE] h-[46px] rounded-xl mb-4 w-1/2 mx-1`}
          textStyles="text-white text-[15px] font-semibold"
          disabled={loading}
        />
      </View>

      <Spinner visible={loading} color="#00AACE" />

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default ShareFeedback;
