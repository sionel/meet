import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import ButtonMic from "../../../../../../../assets/buttons/btn_vc_mike_on.png";
import ButtonCamera from "../../../../../../../assets/buttons/btn_vc_camera_on.png";
import ButtonSpeakerOn1 from "../../../../../../../assets/buttons/btn_speaker_turnon.png";
// import ButtonSpeaker from "../../../../../../../assets/buttons/btn_vc_speaker_on.png";
import ButtonEndCall from "../../../../../../../assets/buttons/btn_vc_endcall_none.png";
import ButtonMicOff from "../../../../../../../assets/buttons/btn_vc_mike_off.png";
import ButtonCameraOff from "../../../../../../../assets/buttons/btn_vc_camera_off.png";
import ButtonSpeakerOff2 from "../../../../../../../assets/buttons/btn_speaker_turnoff.png";
// import ButtonSpeakerOff from "../../../../../../../assets/buttons/btn_vc_speaker_off.png";

/**
 * ControlButtonPresenter
 */
const ControlButtonPresenter = props => (
  <TouchableOpacity style={styles.bottonTouch} onPressOut={props.onPress}>
    <Image
      source={getButtonSource(props.name, props.on)}
      style={styles.buttonImage}
    />
  </TouchableOpacity>
);

/**
 * ControlButtonPresenter PropTypes
 */
ControlButtonPresenter.propTypes = {
  // 버튼 이름입니다.
  name: PropTypes.oneOf(["camera", "speaker", "mic", "endcall"]).isRequired,
  // 스위치 온 온오프 입니다.
  on: PropTypes.bool.isRequired,
  // 버튼이 클릭되면 발생하는 이벤트 입니다.
  onPress: PropTypes.func.isRequired
};

/**
 * 버튼 이미지를 얻어온다.
 */
const getButtonSource = (name, on) => {
  if (on) {
    switch (name) {
      case "camera":
        return ButtonCamera;
      case "speaker":
        return ButtonSpeakerOn1;
      case "mic":
        return ButtonMic;
      case "endcall":
        return ButtonEndCall;
      default:
        return null;
    }
  } else {
    switch (name) {
      case "camera":
        return ButtonCameraOff;
      case "speaker":
        return ButtonSpeakerOff2;
      case "mic":
        return ButtonMicOff;
      case "endcall":
        return ButtonEndCall;
      default:
        return null;
    }
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  bottonTouch: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    margin: 10
  },
  buttonImage: {
    width: 55,
    height: 55
  }
});

export default ControlButtonPresenter;
