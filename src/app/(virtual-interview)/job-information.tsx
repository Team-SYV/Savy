import React, { useState, useCallback } from "react";
import CustomButton from "@/components/Button/CustomButton";
import Stepper from "@/components/Stepper/Stepper";
import { getErrorMessage, validateStep } from "@/utils/validateJobInfo";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import ConfirmationModal from "@/components/Modal/ConfirmationModal";
import { JobInfoData } from "@/types/JobInfo";
import * as Haptics from "expo-haptics";
import { steps } from "@/constants/constants";
import { createJobInformation } from "@/api";
import { useUser } from "@clerk/clerk-expo";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import VirtualInterviewStepContent from "@/components/JobInfo/VirtualInterviewStepContent";
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
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [jobInformationId, setJobInformationId] = useState<string | null>(null);
  const router = useRouter();
  const user = useUser();

  // Updates the active step in a multi-step process when a step is pressed
  const handleStepPress = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  // Move to next step
  const handleNextStep = useCallback(async () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
      router.push("/(virtual-interview)/virtual-interview");
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

  // Moves to previous step.
  const handlePrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  //Updates form data, marks changes.
  const updateFormData = (
    key: string,
    value: string,
    callback?: () => void
  ) => {
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

  // Button to show a confirmation modal if there are unsaved changes
  const handleBackButtonPress = () => {
    if (hasChanges) {
      setModalVisible(true);
    } else {
      router.back();
    }
  };

  // Closes the confirmation modal, navigates back.
  const handleDiscardChanges = () => {
    setModalVisible(false);
    setHasChanges(false);
    router.back();
  };

  // Submits the job information
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const jobData = {
        user_id: user.user.id,
        industry: formData.selectedIndustry,
        role: formData.selectedJobRole,
        type: formData.selectedInterviewType,
        experience: formData.selectedExperienceLevel,
        company_name: formData.companyName,
        job_description: formData.jobDescription,
      };

      const response = await createJobInformation(jobData);
      console.log(response);
      setJobInformationId(response);
    } catch (error) {
      console.error("Error creating job description:", error.message);
    } finally {
      setLoading(false);
    }
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
                    <VirtualInterviewStepContent
                      activeStep={activeStep}
                      formData={formData}
                      updateFormData={updateFormData}
                      handleNextStep={handleNextStep}
                      handleSubmit={handleSubmit}
                      jobInformationId={jobInformationId}
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

        {loading && <LoadingSpinner />}

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
