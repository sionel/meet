import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import imgCharacter01 from '@assets/icons/img_character_man.png';
import imgCharacter02 from '@assets/icons/img_character_woman.png';
import imgCharacter03 from '@assets/icons/img_character_woman2.png';
import CustomIcon from '@components/CustomIcon';

// const apiLevel = DeviceInfo.getAPILevel();
const canUseStream = true;
const { width } = Dimensions.get('window');
const multiWidth = width * 0.425;
// (Platform.OS === 'android' && apiLevel >= 26) || Platform.OS === 'ios';

type ParticipantBoxProps = {
  videoTrack: any;
  user: any;
  isMuteVideo: boolean;
  character: string;
  setMainUser: (id: string) => void;
  getUserName: (user: any) => string;
  isMultipleView: boolean;
  multiViewHeight: any;
  index: any;
};

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = (props: ParticipantBoxProps) => {
  const {
    videoTrack,
    user,
    isMuteVideo,
    setMainUser,
    getUserName,
    character,
    isMultipleView,
    multiViewHeight,
    index
  } = props;
  const stream = videoTrack && videoTrack.getOriginalStream();

  const content = canUseStream ? (
    stream && !isMuteVideo ? (
      <View
        style={[
          styles.video,
          isMultipleView && { width: multiWidth, height: (multiViewHeight - 10) / 2 }
        ]}
      >
        <RTCView
          style={styles.rtcSize}
          mirror={false}
          objectFit={'cover'}
          streamURL={stream.toURL()}
          zOrder={1} // zOrder 는 [0, 1] 만 사용가능 (아마?)
        />
      </View>
    ) : (
      <View
        style={[
          styles.video,
          isMultipleView && { width: multiWidth, height: (multiViewHeight - 10) / 2 }
        ]}
      >
        <Image
          source={
            character === 'jessie'
              ? imgCharacter03
              : character === 'suzy'
              ? imgCharacter02
              : imgCharacter01
          }
          resizeMode={'cover'}
          style={styles.imageCameraOff}
        />
      </View>
    )
  ) : (
    <View style={[styles.video, { backgroundColor: '#00000030' }]}>
      <CustomIcon name={'personIcon'} width={60} height={60} />
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMultipleView && {
          width: multiWidth,
          height: (multiViewHeight - 10) / 2,
          marginHorizontal: 0
        },
        index / 2 === 0 && { marginRight: 10 }
      ]}
      onPress={() => setMainUser(user.id)}
    >
      <View
        style={[
          styles.videoArea,
          isMultipleView && { width: multiWidth, height: (multiViewHeight - 10) / 2 }
        ]}
      >
        {content}
        <View style={styles.nameArea}>
          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
            {getUserName(user)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 104,
    height: 120,
    display: 'flex',
    marginHorizontal: 10,
    marginBottom: 12
  },
  multiViewContainer: {
    display: 'flex',
    flex: 1,
    marginBottom: 12
  },
  videoArea: {
    flex: 1,
    width: 104,
    height: 120,
    // backgroundColor: '#707070',
    borderWidth: 0,
    borderRadius: 6,
    // borderWidth: 3,
    // borderColor: 'rgba(255, 255, 255, 0.5)',
    // borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  videoAreaSelected: {
    borderWidth: 3,
    borderColor: '#039BE5'
  },
  video: {
    flex: 1,
    // opacity: 1,
    backgroundColor: 'rgb(187,197,208)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 104,
    height: 120
    // borderWidth: 1,
    // borderColor: 'rgb(102, 104, 106)'
  },
  profile: {
    color: '#DDD',
    fontSize: 32
  },
  nameArea: {
    position: 'absolute',
    // display: 'flex',
    width: '100%',
    height: 24,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  name: {
    // width: 90,
    // textAlign: 'center',
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 12
  },
  imageCameraOff: {
    width: '100%',
    height: '100%'
  },
  rtcSize: {
    width: '100%',
    height: '100%'
  }
});

export default ParticipantBoxPresenter;
