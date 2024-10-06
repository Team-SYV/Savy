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
import { useUser } from "@clerk/clerk-expo";
import RecordStepContent from "@/components/JobInfo/RecordStepContent";
import Spinner from "react-native-loading-spinner-overlay";
import {
  createJobInformation,
  createQuestions,
  generateQuestions,
  getJobInformation,
} from "@/api";
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
import { cleanQuestion } from "@/utils/cleanQuestion";

const JobInformation = () => {
  const [formData, setFormData] = useState<JobInfoData>({
    selectedIndustry: null,
    selectedJobRole: null,
    selectedInterviewType: "Behavioral",
    selectedExperienceLevel: null,
    companyName: null,
    jobDescription: null,
  });

  const router = useRouter();
  const user = useUser();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [jobInformationId, setJobInformationId] = useState<string | null>(null);

  // Updates the active step when a step is pressed
  const handleStepPress = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  // Move to next step
  const handleNextStep = useCallback(async () => {
    if (activeStep === steps.length - 1) {
      await handleSkip();
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

  // Moves to previous step
  const handlePrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  // Updates form data, marks changes
  const updateFormData = (
    key: string,
    value: string | null,
    callback?: () => void
  ) => {
    setFormData((prevState) => {
      let newState = {
        ...prevState,
        [key]: value,
      };

      if (key === "selectedIndustry") {
        newState = {
          ...newState,
          selectedJobRole: null,
        };
      }

      if (callback) {
        callback();
      }

      return newState;
    });

    setHasChanges(true);

    if (errors[activeStep]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [activeStep]: "",
      }));
    }
  };

  // Show the confirmation modal when back is pressed and there is changes
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

  // Creates job information
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const jobData = {
        user_id: user.user.id,
        industry: formData.selectedIndustry,
        role: formData.selectedJobRole,
        type: formData.selectedInterviewType,
        experience: formData.selectedExperienceLevel,
        company_name: formData.companyName || "None",
        job_description: formData.jobDescription || "None",
      };

      const response = await createJobInformation(jobData);
      setJobInformationId(response);
    } catch (error) {
      console.error("Error creating job description:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // When file upload is skipped
  const handleSkip = async () => {
    try {
      setLoading(true);

      const jobData = {
        user_id: user.user.id,
        industry: formData.selectedIndustry,
        role: formData.selectedJobRole,
        type: formData.selectedInterviewType,
        experience: formData.selectedExperienceLevel,
        company_name: formData.companyName || "None",
        job_description: formData.jobDescription || "None",
      };

      // Create job information
      const response = await createJobInformation(jobData);
      const jobId = response;
      setJobInformationId(jobId);

      // Fetch the newly created job information
      const jobInfo = await getJobInformation(jobId);
      const {
        industry,
        experience,
        type,
        company_name,
        role,
        job_description,
      } = jobInfo;

      const formPayload = new FormData();
      formPayload.append("type", "RECORD");
      formPayload.append("industry", industry);
      formPayload.append("experience_level", experience);
      formPayload.append("interview_type", type);
      formPayload.append("job_description", job_description);
      formPayload.append("company_name", company_name);
      formPayload.append("job_role", role);

      console.log("Form Data (without file):", formPayload);

      // Generate questions
      const questions = await generateQuestions(formPayload);

      for (const question of questions) {
        if (typeof question === "string") {
          const cleanedQuestion = cleanQuestion(question);
          await createQuestions(jobId, { question: cleanedQuestion });
        } else {
          console.error("Invalid question format:", question);
        }
      }
      router.push(`/(record-yourself)/record?jobId=${jobId}`);
    } catch (err) {
      console.error("Error skipping file upload:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Spinner visible={loading} color="#00AACE" />

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
                    <RecordStepContent
                      activeStep={activeStep}
                      formData={formData}
                      updateFormData={updateFormData}
                      handleNextStep={handleNextStep}
                      handleSubmit={handleSubmit}
                      handleSubmitRoute={`/(record-yourself)/file-upload?jobId=`}
                      handleSkip={handleSkip}
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

        <View className="absolute bottom-1 left-0 right-0 flex-row items-center justify-center px-6">
          <CustomButton
            title="Prev"
            onPress={handlePrevStep}
            containerStyles="border border-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-2"
            textStyles="text-[#00AACE] text-[16px] font-semibold text-base"
            isLoading={loading}
          />
          <CustomButton
            title={activeStep === steps.length - 1 ? "Submit" : "Next"}
            onPress={handleNextStep}
            containerStyles="bg-[#00AACE] h-14 rounded-xl mb-4 w-1/2 mx-2"
            textStyles="text-white text-[16px] font-semibold text-base"
            isLoading={loading}
            disabled={loading}
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
