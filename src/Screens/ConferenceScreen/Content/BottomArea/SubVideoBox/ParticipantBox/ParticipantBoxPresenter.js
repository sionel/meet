import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';
import ButtonCameraOff from '../../../../../../../assets/buttons/btn_vc_camera_off.png';

const apiLevel = DeviceInfo.getAPILevel();
const canUseStream =
  (Platform.OS === 'android' && apiLevel >= 26) || Platform.OS === 'ios';

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = props => {
  const stream = props.videoTrack && props.videoTrack.getOriginalStream();

  const content =
    stream && !props.isMuteVideo ? (
      canUseStream ? (
        <RTCView
          style={styles.video}
          mirror={false}
          objectFit={'cover'}
          streamURL={stream.toURL()}
        />
      ) : (
        <View style={styles.video}>
          <Text style={styles.profile}>{props.user.name[0]}</Text>
        </View>
      )
    ) : (
      <View style={styles.video}>
        <Image source={ButtonCameraOff} style={styles.imageCameraOff} />
      </View>
    );
  return (
    <TouchableOpacity
      style={styles.container}
      onPressOut={() => props.setMainUser(props.user.id)}
    >
      <View
        style={[styles.videoArea, props.isSelect && styles.videoAreaSelected]}
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
    // width: 100,
    // height: 120,
    display: 'flex',
    marginHorizontal: 2,
    marginLeft: 10,
  },
  videoArea: {
    flex: 1,
    width: 90,
    height: 90,
    backgroundColor: '#1D1D1D',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    // borderRadius: 50,
    overflow: 'hidden'
  },
  videoAreaSelected: {
    borderWidth: 3,
    borderColor: '#039BE5'
  },
  video: {
    flex: 1,
    // opacity: 1,
    backgroundColor: '#1D1D1D',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  profile: {
    color: '#DDD',
    fontSize: 32
  },
  nameArea: {
    display: 'flex',
    height: 20,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  name: {
    color: '#fff'
  },
  imageCameraOff: {
    width: '50%',
    height: '50%'
  }
});

export default ParticipantBoxPresenter;
