import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * ConferenceScreenPresenter
 */
const LoadingIndicator = props => {
  if (props.mainUser) {
  }
  return <View style={styles.container} />;
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange"
  }
});

export default LoadingIndicator;
