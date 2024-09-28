import { sampleMessages } from "@/constants/sampleMessage";
import { Message, Role } from "@/types/Chat";
import { useUser } from "@clerk/clerk-expo";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { transcribeAudio } from "@/api";

const VirtualInterview = () => {
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);
  const messages = sampleMessages;
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | undefined>(
    undefined
  );

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      console.error("Microphone permission not granted");
    }
  };

  // Request permission
  useEffect(() => {
    requestPermissions();
  }, []);

  const startRecording = async () => {
    if (isRecording) {
      console.log("Already recording");
      return;
    }

    try {
      if (recording) {
        await stopRecording();
      }

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) {
      console.log("No recording to stop");
      return;
    }

    console.log("Stopping recording...");
    setIsRecording(false);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    try {
      const file = {
        uri: uri,
        name: "recording.m4a",
        type: "audio/m4a",
      };

      // Log the file object to ensure it’s structured correctly
      console.log("Transcribing file:", file);

      // Call the API to transcribe audio
      const transcription = await transcribeAudio(file);

      console.log("Transcription:", transcription);
    } catch (error) {
      console.error("Failed to transcribe audio", error.message || error);
    }

    setRecording(undefined);
  };

  const speak = (message: string) => {
    Speech.speak(message, {
      rate: 1.0,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row my-2 mx-4 ${
        item.role === Role.Bot ? "justify-start" : "justify-end"
      }`}
    >
      {item.role === Role.Bot && (
        <View className="flex items-start">
          <View className="flex-row items-center mb-1">
            <Image
              source={require("@/assets/images/savy.png")}
              className="w-5 h-5 rounded-full mr-1"
            />
            <Text className="text-sm"> Savy </Text>
          </View>
          <View className="bg-[#CDF1F8] p-4 rounded-lg max-w-[315px] border border-[#ADE3ED]">
            <Text className="text-base">{item.content}</Text>
            <TouchableOpacity onPress={() => speak(item.content)}>
              <Text className="text-blue-500">Speak</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {item.role === Role.User && (
        <View className="flex items-end">
          <View className="flex-row items-center mb-1">
            <Text className="text-sm"> {user.firstName} </Text>
            <Image
              source={{
                uri: user.imageUrl || "https://via.placeholder.com/150",
              }}
              className="w-5 h-5 rounded-full ml-2"
            />
          </View>
          <View className="bg-[#ecebeb] p-4 rounded-lg max-w-[315px] border border-[#D8D8D8]">
            <Text className="text-base">{item.content}</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 justify-between bg-gray-50">
      <Image
        source={require("@/assets/images/avatar.png")}
        className="w-[96%] h-56 rounded-xl mx-auto mt-4 mb-2"
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      <View className="flex-row p-2 bg-white shadow-md justify-center border-gray-300 border">
        {isRecording ? (
          <TouchableOpacity className="p-3" onPress={stopRecording}>
            <Image
              source={require("@/assets/icons/stop-mic.png")}
              className="w-14 h-12 rounded-full mr-24"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="p-3" onPress={startRecording}>
            <Image
              source={require("@/assets/icons/mic.png")}
              className="w-14 h-12 rounded-full mr-24"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity className="p-3">
          <Image
            source={require("@/assets/icons/video.png")}
            className="w-12 h-12 rounded-full"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VirtualInterview;
