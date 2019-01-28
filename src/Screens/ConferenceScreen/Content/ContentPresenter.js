import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RTCView } from "react-native-webrtc";
import MainVideo from "./MainVideo";
import TopArea from "./TopArea";
import BottomArea from "./BottomArea";

/**
 * ContentPresenter
 */
const ContentPresenter = props => {
  const { mainUser } = props;
  const stream =
    !mainUser.isMuteVideo &&
    mainUser.videoTrack &&
    mainUser.videoTrack.getOriginalStream();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={props.toggleConferenceMode}
      >
        <MainVideo stream={stream} isMuteVideo={mainUser.isMuteVideo}>
          <View style={styles.topArea}>
            <TopArea />
          </View>
          <View style={{ ...styles.box, flex: 7 }} />
          <View style={styles.bottomArea}>
            <BottomArea onClose={props.onClose} />
          </View>
        </MainVideo>
      </TouchableOpacity>
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topArea: {
    flex: 1
  },
  middleArea: {
    flex: 7
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
