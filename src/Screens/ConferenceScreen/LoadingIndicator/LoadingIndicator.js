import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

/**
 * ConferenceScreenPresenter
 */
const LoadingIndicator = props => {
  if (props.mainUser) {
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#039BE5"
        style={styles.indicator}
      />
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD"
  },
  indicator: {}
});

export default LoadingIndicator;
