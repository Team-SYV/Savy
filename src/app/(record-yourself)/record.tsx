import React, { useEffect, useState, useRef } from "react";
import { Camera, CameraView } from "expo-camera";
import { Video } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { Stack } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

const Record: React.FC = () => {
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [video, setVideo] = useState(undefined);

  // Permissions
  const [hasCameraPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<
    boolean | null
  >(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMicrophonePermission(microphonePermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null || hasMicrophonePermission === null) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.</Text>;
  } else if (!hasMicrophonePermission) {
    return <Text>Permission for microphone not granted.</Text>;
  }

  const recordVideo = async () => {
    if (cameraRef.current) {
      setIsRecording(true);

      try {
        const recordedVideo = await cameraRef.current.recordAsync();
        console.log("Recorded Video:", recordedVideo);
        setVideo(recordedVideo);
      } catch (error) {
        console.error("Error recording video:", error);
      } finally {
        setIsRecording(false);
      }
    } else {
      console.error("Camera reference is null or undefined.");
    }
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    const saveVideo = async () => {
      try {
        await MediaLibrary.saveToLibraryAsync(video.uri);
        setVideo(undefined);
      } catch (error) {
        console.error("Error saving video:", error);
      }
    };

    return (
      <SafeAreaView className="flex-1 justify-center">
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          isLooping
        />
        {hasMediaLibraryPermission && (
          <Button title="Save" onPress={saveVideo} />
        )}
        <Button title="Discard" onPress={() => setVideo(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 justify-center">
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView
        mode="video"
        style={styles.camera}
        facing="front"
        ref={cameraRef}
      >
        <View className="absolute bottom-10 left-0 right-0 items-center">
          <TouchableOpacity onPress={isRecording ? stopRecording : recordVideo}>
            <Image
              source={
                isRecording
                  ? require("@/assets/icons/stop.png")
                  : require("@/assets/icons/record.png")
              }
              className="w-24 h-24"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default Record;
const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  video: {
    flex: 1,
    alignSelf: "stretch",
  },
});
