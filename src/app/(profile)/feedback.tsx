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
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Feedback = () => {
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
      alert("Please select a rating before submitting your feedback.");
      return;
    }
    if (!feedback.trim()) {
      alert("Please provide your feedback.");
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
      alert(`Feedback submitted with a rating of ${rating} stars!`);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View className="flex-1 p-5">
        <Text className="text-2xl mt-12 text-center font-semibold">
          Help us improve!
        </Text>

        <Text className="text-xl mt-5 text-center">
          How was your experience using Savy?
        </Text>

        <View className="flex-row items-center justify-center mt-5">
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
                size={40}
                color={
                  selectedIndex !== null && selectedIndex >= index
                    ? "orange"
                    : "gray"
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-16">
          <Text className="mb-4 text-base text-center">
            Did Savy help you feel more confident and improve your interview
            performance?
          </Text>
          <TextArea
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
            placeholder="Share your feedback"
            textInputStyles="h-80 ml-0"
          />
        </View>
      </View>

      <View className="absolute bottom-1 left-0 right-0 flex-row items-center justify-center px-4">
        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          containerStyles={`border border-[#00AACE] h-14 rounded-xl mb-4 mx-1 w-1/2`}
          textStyles="text-[#00AACE] text-[16px]"
          disabled={loading}
        />

        <CustomButton
          title="Submit"
          onPress={handleSubmit}
          containerStyles={`bg-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-1`}
          textStyles="text-white text-[16px]"
          disabled={loading}
        />
      </View>
      <Spinner visible={loading} color="#00AACE" />
    </KeyboardAvoidingView>
  );
};

export default Feedback;
