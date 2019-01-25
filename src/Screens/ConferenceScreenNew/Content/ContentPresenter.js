import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RTCView } from "react-native-webrtc";
import BottomArea from "./BottomArea";

/**
 * ContentPresenter
 */
const ContentPresenter = props => {
  if (props.stream) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.container}
          onPressOut={props.toggleConferenceMode}
        >
          <RTCView
            style={styles.container}
            mirror={true}
            objectFit={"cover"}
            streamURL={props.stream.toURL()}
          >
            <View style={{ ...styles.box, flex: 1 }} />
            <View style={{ ...styles.box, flex: 7 }} />
            <View style={styles.bottomArea}>
              <BottomArea onClose={props.onClose} />
            </View>
          </RTCView>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <View style={styles.container} />;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  box: {
    display: "flex",
    opacity: 0
  },
  bottomArea: {
    flex: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ContentPresenter;
