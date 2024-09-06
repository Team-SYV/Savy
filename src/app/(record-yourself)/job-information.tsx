import React, { useState, useCallback } from "react";
import CustomButton from "@/components/Button/CustomButton";
import InterviewTypeCard from "@/components/Card/InterviewTypeCard";
import Dropdown from "@/components/Dropdown/Dropdown";
import CompanyFormField from "@/components/FormField/CompanyFormField";
import Stepper from "@/components/Stepper/Stepper";
import TextArea from "@/components/TextArea/TextArea";
import {
  getErrorMessage,
  validateStep,
  FormData,
} from "@/utils/validateJobInfo";
import * as Haptics from "expo-haptics";
import {
  experienceLevel,
  industry,
  jobRole,
  steps,
} from "@/constants/constants";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

const JobInformation = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    selectedIndustry: null,
    selectedJobRole: null,
    selectedInterviewType: null,
    selectedExperienceLevel: null,
    companyName: "",
    jobDescription: "",
  });
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  const handleStepPress = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  const handleNextStep = useCallback(async () => {
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
    } else {
      handleSubmit();
    }
  }, [activeStep, formData]);

  const handlePrevStep = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  }, [activeStep]);

  const handleSubmit = () => {
    console.log("Submitting data:", formData);
  };

  const updateFormData = (key: string, value: any, callback?: () => void) => {
    setFormData((prevState) => {
      const updatedFormData = {
        ...prevState,
        [key]: value,
      };

      return updatedFormData;
    });

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

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Dropdown
            placeholder="Industry"
            data={industry}
            defaultOption={{
              key: formData.selectedIndustry,
              value: formData.selectedIndustry || "",
            }}
            onSelect={(value) => {
              updateFormData("selectedIndustry", value, () => {
                updateFormData("selectedJobRole", null);
              });
            }}
          />
        );
      case 1:
        return (
          formData.selectedIndustry && (
            <Dropdown
              placeholder="Job Role"
              data={jobRole[formData.selectedIndustry] || []}
              defaultOption={{
                key: formData.selectedJobRole,
                value: formData.selectedJobRole || "",
              }}
              onSelect={(value) => {
                updateFormData("selectedJobRole", value);
              }}
            />
          )
        );
      case 2:
        return (
          <View className="flex-row items-center justify-center">
            <InterviewTypeCard
              imageSource={require("@/assets/icons/technical.png")}
              title="Technical"
              description="Involves coding challenges, technical problem-solving scenarios, and discussions about specific technologies, tools, or methodologies."
              isSelected={formData.selectedInterviewType === "Technical"}
              onPress={() =>
                updateFormData("selectedInterviewType", "Technical")
              }
            />
            <InterviewTypeCard
              imageSource={require("@/assets/icons/behavioral.png")}
              title="Behavioral"
              description="Involves soft skills, interpersonal interactions, problem-solving approaches, and past experiences."
              isSelected={formData.selectedInterviewType === "Behavioral"}
              onPress={() =>
                updateFormData("selectedInterviewType", "Behavioral")
              }
            />
          </View>
        );
      case 3:
        return (
          <Dropdown
            placeholder="Experience Level"
            data={experienceLevel}
            defaultOption={{
              key: formData.selectedExperienceLevel,
              value: formData.selectedExperienceLevel || "",
            }}
            onSelect={(value) => {
              updateFormData("selectedExperienceLevel", value);
            }}
          />
        );
      case 4:
        return (
          <CompanyFormField
            title="Company Name"
            placeholder="Company Name"
            value={formData.companyName}
            onChangeText={(text) => updateFormData("companyName", text)}
            otherStyles="ml-12 mb-1"
          />
        );
      case 5:
        return (
          <TextArea
            value={formData.jobDescription}
            onChangeText={(text) => updateFormData("jobDescription", text)}
            placeholder="Fill in your job description"
          />
        );
      case 6:
        return (
          <View>
            <Text className="ml-12 mr-3 text-base">
              Do you wish to customize your interview based on your resume by
              uploading a file? If not, please skip.
            </Text>
            <View className="flex-row items-center justify-center px-6 mt-4 ml-7">
              <CustomButton
                title="Skip"
                onPress={handleNextStep}
                containerStyles="bg-gray-200 h-12 rounded-xl mb-4 mx-2 w-1/2"
                textStyles="text-[#00AACE] text-[16px] font-semibold text-base"
              />
              <CustomButton
                title="Proceed"
                onPress={handleNextStep}
                containerStyles="bg-[#00AACE] h-12 rounded-xl mb-4 w-1/2 mx-2"
                textStyles="text-white text-[16px] font-semibold text-base"
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
                    {renderStepContent()}
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
