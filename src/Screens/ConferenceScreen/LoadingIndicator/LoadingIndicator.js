import React, { Component } from "react";
import { View, StyleSheet, Image, StatusBar } from "react-native";
import CameraLoading from "./cameraLoading.gif";

/**
 * ConferenceScreenPresenter
 */
class LoadingIndicator extends Component {
  componentDidMount() {
    // this.animation.play();
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Image style={styles.indicator} source={CameraLoading} resizeMode="contain" />
      </View>
    );
  }
}

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0069E0",
  },
  indicator: {
    width: "33%",
    height: "33%"
  }
});

export default LoadingIndicator;
