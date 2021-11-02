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
// import imgCharacter01 from '../../../../assets/icons/imgCharacter01_2x.png';
import imgCharacter01 from '../../../../../../../assets/icons/imgCharacter01_2x.png';
import imgCharacter02 from '../../../../../../../assets/icons/imgCharacter02_2x.png';
import imgCharacter03 from '../../../../../../../assets/icons/imgCharacter03_2x.png';
import CustomIcon from '../../../../../../components/CustomIcon';

// const apiLevel = DeviceInfo.getAPILevel();
const canUseStream = true;
// (Platform.OS === 'android' && apiLevel >= 26) || Platform.OS === 'ios';

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = props => {
  const stream = props.videoTrack && props.videoTrack.getOriginalStream();
  let character = '';
  if (props?.user?.userInfo?.avatar) {
    character = JSON.parse(props?.user?.userInfo?.avatar)?.value;
  }
  character = props.isMuteVideo ? 'jangok' : character;
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
        <Image
          source={
            character === 'jessie'
              ? imgCharacter03
              : character === 'suzy'
              ? imgCharacter02
              : imgCharacter01
          }
          style={styles.imageCameraOff}
        />
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
      <View style={styles.videoArea}>{content}</View>
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
    // marginLeft: 10,
    // backgroundColor:'#5f5'
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
    width: '100%',
    height: '100%'
  }
});

export default ParticipantBoxPresenter;
