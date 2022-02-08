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
import imgCharacter01 from '@assets/icons/img_character_man.png';
import imgCharacter02 from '@assets/icons/img_character_woman.png';
import imgCharacter03 from '@assets/icons/img_character_woman2.png';
import CustomIcon from '@components/CustomIcon';

// const apiLevel = DeviceInfo.getAPILevel();
const canUseStream = true;
// (Platform.OS === 'android' && apiLevel >= 26) || Platform.OS === 'ios';

type ParticipantBoxProps = {
  videoTrack: any;
  user: any;
  isMuteVideo: boolean;
  character: string;
  setMainUser: (id: string) => void;
  getUserName: (user: any) => string;
};

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = (props: ParticipantBoxProps) => {
  const { videoTrack, user, isMuteVideo, setMainUser, getUserName, character } =
    props;
  const stream = videoTrack && videoTrack.getOriginalStream();

  const content = canUseStream ? (
    stream && !isMuteVideo ? (
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
      style={styles.container}
      onPress={() => setMainUser(user.id)}
    >
      <View style={styles.videoArea}>{content}</View>
      <View style={styles.nameArea}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
          {getUserName(user)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 104,
    height: 120,
    display: 'flex',
    marginHorizontal: 10
    // marginLeft: 10
  },
  videoArea: {
    flex: 1,
    width: 104,
    height: 120,
    backgroundColor: '#707070',
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
    width: 104,
    height: 120,
    borderRadius: 6,
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
