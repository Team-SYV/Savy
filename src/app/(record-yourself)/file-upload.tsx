import { Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import CustomButton from "@/components/Button/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import ProgressBar from "react-native-progress/Bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "react-native";
import { createQuestions, generateQuestions, getJobInformation } from "@/api";

const FileUpload = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { jobId } = useLocalSearchParams();

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
      });

      if (result.canceled) {
        Alert.alert("File Selection", "You did not select any file.");
      } else if (result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        setFileName(result.assets[0].name);

        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.1;
          setUploadProgress(progress);
          if (progress >= 1) {
            clearInterval(interval);
            setUploadProgress(1);
          }
        }, 100);
      } else {
        Alert.alert("Error", "There was an issue picking the file.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "There was an issue picking the file.");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName("");
    setUploadProgress(0);
  };

  const handleStartInterview = async () => {
    if (!isLoaded || !isSignedIn || !user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    if (!selectedFile) {
      Alert.alert(
        "No file uploaded",
        "Please upload your resume before starting the interview."
      );
      return;
    }

    try {
      setUploadProgress(0);

      const jobInfo = await getJobInformation(jobId);
      const {
        industry,
        experience_level,
        interview_type,
        job_description,
        company_name,
        job_role,
      } = jobInfo;

      const fileUri = selectedFile.uri;

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: selectedFile.name,
        type: selectedFile.type || "application/pdf",
      } as any);

      formData.append("industry", industry);
      formData.append("experience_level", experience_level);
      formData.append("interview_type", interview_type);
      formData.append("job_description", job_description);
      formData.append("company_name", company_name);
      formData.append("job_role", job_role);

      const questions = await generateQuestions(formData);

      for (const question of questions) {
        await createQuestions(jobId, { question });  
      }
      
      router.push(`/(record-yourself)/record?jobId=${jobId}`);
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    }
  };
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 mt-28 px-4">
        <Text className="text-xl text-gray-800 font-medium mb-4">
          Upload Your Resume
        </Text>

        <TouchableOpacity
          onPress={handleFilePick}
          className={`bg-gray-100 w-full rounded-lg items-center justify-center h-[250px] p-4 border-2 border-dashed ${
            fileName ? "border-green-500" : "border-gray-300"
          }`}
        >
          <SimpleLineIcons
            name="cloud-upload"
            size={44}
            color={fileName ? "green" : "gray"}
            className="mb-4"
          />
          <Text className="text-xl text-center font-medium mb-2">
            {fileName ? "Change File" : "Tap to Upload File"}
          </Text>
          <Text className="text-base text-center">*Supported format: .pdf</Text>
        </TouchableOpacity>

        {fileName ? (
          <View className="mt-4 flex-row justify-between items-center px-2">
            <Text className="text-base text-center">{fileName}</Text>
            <TouchableOpacity onPress={handleRemoveFile}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text className="text-base text-center mt-2">No file selected</Text>
        )}

        <View className="mt-2">
          <ProgressBar
            progress={uploadProgress}
            width={null}
            color={uploadProgress === 1 ? "green" : "gray"}
            borderColor="transparent"
          />
          {uploadProgress > 0 && uploadProgress < 1 && (
            <Text className="text-center mt-2 text-base">
              {Math.round(uploadProgress * 100)}% Uploading...
            </Text>
          )}
        </View>

        <View className="flex-row items-center mt-6">
          <Text className="text-lg font-medium">Reminder:</Text>
          <Image
            source={require("@/assets/icons/notif.png")}
            className="h-8 w-8 ml-2"
            resizeMode="contain"
          />
        </View>
        <Text className="mt-2 text-lg font-light">
          You will be interviewed based on the resume you've uploaded.
        </Text>
      </View>

      <View className="px-4 mb-8">
        <CustomButton
          title="Start Interview"
          onPress={handleStartInterview}
          containerStyles="bg-[#00AACE] h-[55px] w-full rounded-2xl"
          textStyles="text-white text-[17px]"
        />
      </View>
    </View>
  );
};

export default FileUpload;
