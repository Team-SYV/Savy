import React, { useState, useCallback } from "react";
import CustomButton from "@/components/Button/CustomButton";
import Stepper from "@/components/Stepper/Stepper";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { getErrorMessage, validateStep } from "@/utils/validateJobInfo";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { JobInfoData } from "@/types/JobInfo";
import * as Haptics from "expo-haptics";
import { steps } from "@/constants/constants";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import StepContent from "@/components/JobInfo/StepContent";

const JobInformation = () => {
  const [formData, setFormData] = useState<JobInfoData>({
    selectedIndustry: null,
    selectedJobRole: null,
    selectedInterviewType: "Behavioral",
    selectedExperienceLevel: null,
    companyName: "",
    jobDescription: "",
  });

  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleStepPress = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const handleNextStep = useCallback(async () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
      router.push("/(record-yourself)/record");
      return;
    }

    if (!validateStep(activeStep, formData)) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [activeStep]: getErrorMessage(activeStep),
      }));
      return;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [activeStep]: "",
    }));

    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  }, [activeStep, formData]);

  const handlePrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const updateFormData = (key: string, value: any, callback?: () => void) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [key]: value,
      };

      return updatedFormData;
    });
    setHasChanges(true);
    if (callback) {
      callback();
    }
    if (errors[activeStep]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [activeStep]: "",
      }));
    }
  };

  const handleBackButtonPress = () => {
    if (hasChanges) {
      setModalVisible(true);
    } else {
      router.back();
    }
  };

  const handleDiscardChanges = () => {
    setModalVisible(false);
    setHasChanges(false);
    router.back();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", formData);
    // Simulate form submission (e.g., send data to an API)
    // After submitting, you can navigate to another route
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Stack.Screen
          options={{
            headerLeft: () => (
              <TouchableOpacity onPress={handleBackButtonPress}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          {steps.map((step, index) => {
            if (index > activeStep) return null;
            return (
              <View key={index}>
                <Stepper
                  isActive={index === activeStep}
                  isCompleted={index < activeStep}
                  onStepPress={handleStepPress}
                  section={step}
                  index={index}
                />
                {index === activeStep && (
                  <>
                    <StepContent
                      activeStep={activeStep}
                      formData={formData}
                      updateFormData={updateFormData}
                      handleNextStep={handleNextStep}
                      handleSubmit={handleSubmit}
                    />
                    {errors[activeStep] && (
                      <Text className="text-red-500 ml-12">
                        {errors[activeStep]}
                      </Text>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View className="absolute bottom-1 left-0 right-0 flex-row items-center justify-center px-6">
          <CustomButton
            title="Prev"
            onPress={handlePrevStep}
            containerStyles="border border-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-2"
            textStyles="text-[#00AACE] text-[16px] font-semibold text-base"
          />
          <CustomButton
            title={activeStep === steps.length - 1 ? "Submit" : "Next"}
            onPress={handleNextStep}
            containerStyles="bg-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-2"
            textStyles="text-white text-[16px] font-semibold text-base"
          />
        </View>

        <ConfirmationModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleDiscardChanges}
          title="Discard Changes"
          message="Are you sure you want to discard your changes?"
          cancelText="Cancel"
          confirmText="Discard"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 120,
    marginTop: 24,
    padding: 15,
  },
});

export default JobInformation;
