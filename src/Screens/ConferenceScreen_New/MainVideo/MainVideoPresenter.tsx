import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  ImageBackground,
  StatusBar
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MainVideoPresenterProps } from '../types';
import { RTCView } from 'react-native-webrtc';
import LinearGradient from 'react-native-linear-gradient';

import icMan1 from '@assets/icons/ic_man1.png';
import icWoman1 from '@assets/icons/ic_woman3.png';
import icWoman2 from '@assets/icons/ic_woman2.png';
import icWoman3 from '@assets/icons/img_character_woman1.png';
import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';

const MainVideoPresenter: React.FC<MainVideoPresenterProps> = ({
  isScreenShare,
  presenter,
  character,
  isMuteVideo,
  stream,
  onPressShareStop
}) => {
  return (
    <SafeAreaView style={styles.mainVideoSAV}>
      <KeyboardAvoidingView style={styles.avoidingContainer} enabled={false} behavior={'height'}>
        {isScreenShare ? (
          <View style={styles.shareContainer}>
            <Image
              source={icoScreenShagre}
              style={{ width: 70, height: 70 }}
              resizeMode={'contain'}
            />
            <Text style={styles.sharingText}>{'화면을 공유 중 입니다.'}</Text>
            <Text style={styles.introText}>
              {'현재 참석자들이 알림을 포함한 모든화면을\n확인할 수 있습니다'}
            </Text>
            <TouchableOpacity
              style={styles.sharingStopButton}
              onPress={onPressShareStop}
            >
              <Text style={styles.sharingStopText}>{'공유중지'}</Text>
            </TouchableOpacity>
          </View>
        ) : !isMuteVideo && stream && !presenter ? (
          <View style={styles.RTCVideo} />
        ) : (
          // <RTCView
          //   style={styles.RTCVideo}
          //   mirror={videoType !== 'desktop' && !isVideoReverse}
          //   objectFit={
          //     localPipMode || isTablet
          //       ? 'cover'
          //       : videoType === undefined
          //       ? 'contain'
          //       : objectFit
          //   }
          //   streamURL={stream.toURL()}
          //   zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
          // />
          // <View style={styles.imageContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={icWoman2}
              style={{ width: '100%', height: '100%' }}
              // , backgroundColor: 'rgba(243,216,119,0.6)' }
              resizeMode={'cover'}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainVideoSAV: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 0
  },
  avoidingContainer: {
    flex: 1
  },
  RTCVideo: {
    flex: 1,
    backgroundColor: '#000'
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgb(187,197,208)'
  },
  shareContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250
  },
  sharingText: {
    fontSize: 20,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white',
    marginVertical: 20
  },
  introText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white'
  },
  sharingStopButton: {
    width: 200,
    marginVertical: 40,
    backgroundColor: 'red',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  sharingStopText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white'
  },
  networkErrView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  networkErrText: {
    backgroundColor: '#F15F5F',
    padding: 10,
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'DOUZONEText50'
  }
});

export default MainVideoPresenter;
