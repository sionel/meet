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
// import DeviceInfo from 'react-native-device-info';
// import ButtonCameraOff from '../../../../../../../assets/buttons/btn_vc_camera_off.png';
import ButtonCameraOff from '../../../../../../../assets/icons/speaker/ico-camera-bl-off_2x.png';
import CustomIcon from '../../../../../../components/CustomIcon';

// const apiLevel = DeviceInfo.getAPILevel();
const canUseStream = true;
// (Platform.OS === 'android' && apiLevel >= 26) || Platform.OS === 'ios';

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = props => {
  const stream = props.videoTrack && props.videoTrack.getOriginalStream();

  const content = canUseStream ? (
    stream && !props.isMuteVideo ? (
      <View style={styles.video}>
        <RTCView
          style={styles.video}
          mirror={false}
          objectFit={'cover'}
          streamURL={stream.toURL()}
          zOrder={1} // zOrder 는 [0, 1] 만 사용가능 (아마?)
        />
      </View>
    ) : (
      <View style={styles.video}>
        <Image source={ButtonCameraOff} style={styles.imageCameraOff} />
      </View>
    )
  ) : (
    <View style={[styles.video, { backgroundColor: '#00000030' }]}>
      <CustomIcon name={'personIcon'} width={60} height={60} />
    </View>
  );

  /**
   * 닉네임 표기 방법
   * 닉네임(이름) > 이름
   * @param {*} user
   */
  const getUserName = user => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.setMainUser(props.user.id)}
    >
      <View
        style={styles.videoArea}
        // style={[styles.videoArea, props.isSelect && styles.videoAreaSelected]}
      >
        {content}
        {/* {(props.isMuteAudio || props.isMuteMic) && (
          <CustomIcon
            name={'icoMikeOff'}
            width={24}
            height={24}
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5
            }}
          />
        )} */}
      </View>
      <View style={styles.nameArea}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
          {getUserName(props.user)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

ParticipantBoxPresenter.defaultProps = {
  user: {
    name: '',
    isMuteAudio: false,
    isMuteMic: false,
    isMuteVideo: false
  }
};

const styles = StyleSheet.create({
  container: {
    // width: 100,
    // height: 120,
    display: 'flex',
    marginHorizontal: 5
    // marginLeft: 10
  },
  videoArea: {
    flex: 1,
    width: 90,
    height: 90,
    backgroundColor: '#1D1D1D',
    borderWidth: 0,
    // borderWidth: 3,
    // borderColor: 'rgba(255, 255, 255, 0.5)',
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
    backgroundColor: 'rgb(102, 104, 106)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
    // borderWidth: 1,
    // borderColor: 'rgb(102, 104, 106)'
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
    width: 90,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'DOUZONEText30'
  },
  imageCameraOff: {
    width: '30%',
    height: '30%'
  }
});

export default ParticipantBoxPresenter;
