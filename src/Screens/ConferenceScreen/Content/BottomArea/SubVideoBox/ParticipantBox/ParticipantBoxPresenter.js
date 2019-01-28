import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { RTCView } from "react-native-webrtc";
import ButtonCameraOff from "../../../../../../../assets/buttons/btn_vc_camera_off.png";

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = props => {
  const stream =
    props.user.videoTrack && props.user.videoTrack.getOriginalStream();

  const content =
    stream && !props.user.isMuteVideo ? (
      <RTCView
        style={styles.video}
        mirror={false}
        objectFit={"cover"}
        streamURL={stream.toURL()}
      />
    ) : (
      <View style={styles.video}>
        <Image source={ButtonCameraOff} style={styles.imageCameraOff} />
      </View>
    );
  return (
    <TouchableOpacity style={styles.container}>
      <View
        style={props.isSelect ? styles.videoAreaSelected : styles.videoArea}
      >
        {content}
      </View>
      <View style={styles.nameArea}>
        <Text style={styles.name}>{props.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 120,
    display: "flex",
    marginHorizontal: 2
  },
  videoArea: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray"
  },
  videoAreaSelected: {
    flex: 1,
    backgroundColor: "gray",
    borderWidth: 2,
    borderColor: "#039BE5"
  },
  video: {
    flex: 1,
    opacity: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  nameArea: {
    display: "flex",
    height: 20,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  name: {
    color: "#fff"
  },
  imageCameraOff: {
    width: "50%",
    height: "50%"
  }
});

export default ParticipantBoxPresenter;
