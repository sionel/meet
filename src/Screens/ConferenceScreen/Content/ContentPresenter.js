import React from "react";
import { View, StyleSheet, TouchableOpacity, dimmen } from "react-native";
import { RTCView } from "react-native-webrtc";
import MainVideo from "./MainVideo";
import TopArea from "./TopArea";
import BottomArea from "./BottomArea";

/**
 * ContentPresenter
 */
const ContentPresenter = props => {
  const { mainUser } = props;
  return (
    <View style={styles.container} onLayout={props.onLayout}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={props.toggleConferenceMode}
      >
        <MainVideo mainUser={mainUser}>
          <View
            style={
              props.orientation === "vertical"
                ? styles.contentVertical
                : styles.contentHorizontal
            }
          >
            <View style={styles.topArea}>
              <TopArea orientation={props.orientation} />
            </View>
            <View style={styles.middleArea} />
            <View
              style={
                props.orientation === "vertical"
                  ? styles.bottomAreaVertical
                  : styles.bottomAreaHorizontal
              }
            >
              <BottomArea
                onClose={props.onClose}
                orientation={props.orientation}
              />
            </View>
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
  contentVertical: {
    flex: 1,
    flexDirection: "column"
  },
  contentHorizontal: {
    flex: 1,
    flexDirection: "row"
  },
  topArea: {
    flex: 2
  },
  middleArea: {
    flex: 9
  },
  bottomAreaVertical: {
    flex: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomAreaHorizontal: {
    flex: 3,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ContentPresenter;
