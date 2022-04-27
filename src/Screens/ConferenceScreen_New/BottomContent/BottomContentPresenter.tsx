import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView
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

const BottomContentPresenter: React.FC<BottomContentPresenterProps> = ({
  onPressSpeaker,
  onPressMike,
  onPressVideo,
  onPressEndCall,
  isVideoOn,
  isMikeOn,
  isSpeakerOn,
  mode
}) => {
  return (
    <SafeAreaView style={styles.BotContentSAV}>
      <View style={styles.bottomArea}>
        <View style={{ flexDirection: 'row', marginTop: 24 }}>
          {/* 스피커 */}
          {!isTablet && (
            <TouchableOpacity
              style={styles.bottonTouch}
              onPressOut={onPressSpeaker}
            >
              <Image
                source={isSpeakerOn ? icSpeakerOn : icSpeakerOff}
                style={styles.buttonImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          )}
          {/* 마이크 */}
          <TouchableOpacity style={styles.bottonTouch} onPressOut={onPressMike}>
            <Image
              source={isMikeOn ? icMicOn : icMicOff}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
          {/* 카메라 */}

          {!(mode === 'screen') ? (
            <TouchableOpacity
              style={styles.bottonTouch}
              onPressOut={onPressVideo}
            >
              <Image
                source={isVideoOn ? icVideoOn : icVideoOff}
                style={styles.buttonImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.bottonTouch} onPress={() => {}}>
              <Image
                source={icVideoOff}
                style={styles.buttonImage}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          )}
          {/* 회의종료 */}
          <TouchableOpacity
            style={[styles.bottonTouch, { backgroundColor: '#ef5334' }]}
            onPressOut={onPressEndCall}
          >
            <Image
              source={icCallEnd}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  BotContentSAV: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 1
  },
  bottomArea: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 14,
    justifyContent: 'flex-end',
    alignItems: 'center'
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
