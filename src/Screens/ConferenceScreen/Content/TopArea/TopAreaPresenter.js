import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SettingButton from "./SettingButton";
import { ConferenceModes } from "../../../../utils/Constants";

/**
 * TopAreaPresenter
 */
const TopAreaPresenter = props => {
  if (props.conferenceMode === ConferenceModes.NORMAL) {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.container}>
        {/* 경과시간 */}
        {/* <View style={styles.timeBox}>
          <Text style={{ color: "#fff", fontSize: 16.5, padding: 5 }}>
            00:00:19
          </Text>
        </View> */}
        {props.isMuteVideo ? null : (
          <View style={styles.settingBox}>
            <SettingButton
              name="switch"
              onPress={props.toggleCameraFacingMode}
            />
          </View>
        )}
      </TouchableOpacity>
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
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20
  },
  timeBox: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  settingBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  }
});

export default TopAreaPresenter;
