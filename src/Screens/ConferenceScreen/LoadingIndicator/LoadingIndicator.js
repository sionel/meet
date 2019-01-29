import React, { Component } from "react";
import LottieView from "lottie-react-native";
import { View, StyleSheet } from "react-native";

/**
 * ConferenceScreenPresenter
 */
class LoadingIndicator extends Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <View style={styles.container}>
        <LottieView
          style={styles.indicator}
          source={require("./camera.json")}
          ref={animation => {
            this.animation = animation;
          }}
        />
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
    backgroundColor: "#E3F2FD"
  },
  indicator: {
    width: 90,
    height: 90
  }
});

export default LoadingIndicator;
