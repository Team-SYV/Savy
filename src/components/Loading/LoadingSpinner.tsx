import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

const LoadingSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={"#00AACE"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
});

export default LoadingSpinner;
