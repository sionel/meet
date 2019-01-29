import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { RTCView } from "react-native-webrtc";
import ButtonCameraOff from "../../../../../assets/buttons/btn_vc_camera_off.png";

/**
 * MainVideoPresenter
 */
const MainVideoPresenter = props => {
  const { isMuteVideo, stream } = props;
  if (!isMuteVideo && stream) {
    return (
      <RTCView
        style={styles.videoContainer}
        mirror={false}
        objectFit={"cover"}
        streamURL={stream.toURL()}
      >
        {props.children}
      </RTCView>
    );
  } else {
    return (
      <View style={styles.muteContainer}>
        <View style={styles.imageContainer}>
          <Image source={ButtonCameraOff} />
        </View>
        {props.children}
      </View>
    );
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    backgroundColor: "gray"
  },
  muteContainer: {
    flex: 1,
    backgroundColor: "gray"
  },
  imageContainer: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%"
  }
});

export default MainVideoPresenter;
