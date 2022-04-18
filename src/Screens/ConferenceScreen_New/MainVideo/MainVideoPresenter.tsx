import { View, Text, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, SafeAreaView, ImageBackground } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { MainVideoPresenterProps } from '../types';
import { RTCView } from 'react-native-webrtc';
import LinearGradient from 'react-native-linear-gradient';

import icMan1 from '@assets/icons/ic_man1.png';
import icWoman1 from '@assets/icons/ic_woman1.png';
import icWoman2 from '@assets/icons/ic_woman2.png';
import icWoman3 from '@assets/icons/img_character_woman1.png';
import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';

const MainVideoPresenter: React.FC<MainVideoPresenterProps> = ({
  insets,
  isScreenShare,
  presenter,
  character,
  isMuteVideo,
  stream,
  onPressShareStop
}) => {
  const mainUser = { status: '' };
  // return (
  //   <View style={{ flex: 1, backgroundColor: '#ccc' }}>
  //     <Image
  //       source={
  //         character === 'jessie'
  //           ? icWoman1
  //           : character === 'suzy'
  //           ? icWoman2
  //           : icMan1
  //       }
  //       style={{ width: '100%'}}
  //       resizeMode={'contain'}
  //     />
  //   </View>
  // );
  const key = useRef(null)
  // useEffect(() => {
  //   debugger
  
    
  // }, [key])
  
  const test = () => {
    console.log(key);
    
    debugger
  }
  return (
    <KeyboardAvoidingView style={[styles.avoidingContainer]}>
      <SafeAreaView style={{ flex: 1 }}>
      <Image
            source={icWoman3}
            style={{ flex: 1, backgroundColor: 'red' }}
            resizeMode={'cover'}
          />
        {/* {isScreenShare ? (
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
        ) : // <RTCView
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
        mainUser.status === 'interrupted' ? (
          <View style={styles.networkErrView}>
            <Text
              style={styles.networkErrText}
            >{`네트워크가 불안정해요 :(`}</Text>
          </View>
        ) : (
          // <ImageBackground source={icWoman3} resizeMode="cover">
          <Image
            source={icWoman3}
            style={{ flex: 1, backgroundColor: 'red' }}
            resizeMode={'cover'}
          />
          // </ImageBackground>
        )} */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
  
  
};

const styles = StyleSheet.create({
  avoidingContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 0,
    // elevation: 0
  },
  RTCVideo: {
    flex: 1,
    backgroundColor: '#000'
  },
  imageContainer: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-start',
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
