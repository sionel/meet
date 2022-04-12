import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import React from 'react';
import { BottomContentPresenterProps } from '../types';

import icSpeakerOn from '@assets/icons/ic_speaker_on.png';
import icSpeakerOff from '@assets/icons/ic_speaker_off.png';
import icVideoOn from '@assets/icons/ic_video_on.png';
import icVideoOff from '@assets/icons/ic_video_off.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icCallEnd from '@assets/icons/ic_call_end.png';
import deviceInfoModule from 'react-native-device-info';

const isTablet = deviceInfoModule.isTablet();

const BottomContentPresenter: React.FC<BottomContentPresenterProps> = props => {
  const {
    ToggleSpeakerClick,
    ToggleMikeClick,
    ToggleVideoClick,
    EndCallClick
  } = props;

  return (
    <View style={styles.bottomArea}>
      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        {/* 스피커 */}
        {!isTablet && (
          <TouchableOpacity
            style={styles.bottonTouch}
            onPressOut={ToggleSpeakerClick}
          >
            <Image
              source={icSpeakerOn}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )}
        {/* 마이크 */}
        <TouchableOpacity
          style={styles.bottonTouch}
          onPressOut={ToggleMikeClick}
        >
          <Image
            source={icMicOn}
            style={styles.buttonImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        {/* 카메라 */}

        <TouchableOpacity
          style={styles.bottonTouch}
          onPressOut={ToggleVideoClick}
        >
          <Image
            source={icVideoOn}
            style={styles.buttonImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>

        {/* {isScreenShare && (
          <TouchableOpacity style={styles.bottonTouch} onPress={() => {}}>
            <Image
              source={icVideoOff}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )} */}
        {/* 회의종료 */}
        <TouchableOpacity
          style={[styles.bottonTouch, { backgroundColor: '#ef5334' }]}
          onPressOut={EndCallClick}
        >
          <Image
            source={icCallEnd}
            style={styles.buttonImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomArea: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
    left: 0,
    right: 0,
    bottom: 48
  },

  bottonTouch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonImage: {
    width: 24,
    height: 24
  }
});

export default BottomContentPresenter;
