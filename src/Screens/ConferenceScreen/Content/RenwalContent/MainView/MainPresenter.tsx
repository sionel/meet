import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import icMan1 from '@assets/icons/ic_man1.png';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import LinearGradient from 'react-native-linear-gradient';

import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';
import Device from 'react-native-device-info';

const { height, width } = Dimensions.get('screen');
const isTablet = Device.isTablet();

type MainPresenterProps = {
  isMuteVideo: boolean;
  stream: any;
  videoType: any;
  isVideoReverse: boolean;
  drawing: any;
  localPipMode: any;
  objectFit: any;
  mainUser: any;
  isMultipleView: boolean;
  isScreenShare: boolean;
  toggleScreenFlag: ()=>void;
};

const MainPresenter = (props: MainPresenterProps) => {
  const {
    isMuteVideo,
    stream,
    videoType,
    isVideoReverse,
    drawing,
    localPipMode,
    objectFit,
    mainUser,
    isMultipleView,
    isScreenShare,
    toggleScreenFlag
  } = props;

  const muteView = (
    <View
      style={{
        position: 'absolute',
        top: '45%',
        height: 41,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4
      }}
    >
      <Text
        style={{
          backgroundColor: '#F15F5F',
          padding: 10,
          color: '#fff',
          textAlign: 'center',
          fontSize: 14,
          fontFamily: 'DOUZONEText50'
        }}
      >
        {`네트워크가 불안정해요 :(`}
      </Text>
    </View>
  );

  //zindex:0
  return isScreenShare ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Image source={icoScreenShagre} style={{width: 70, height: 70}} resizeMode={'cover'}/>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
          marginVertical: 20,
          color: 'white'
        }}
      >
        {'화면을 공유 중 입니다.'}
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 15,
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        {'현재 참석자들이 알림을 포함한 모든화면을\n확인할 수 있습니다'}
      </Text>
      <TouchableOpacity
        style={{
          width: 200,
          marginVertical: 40,
          backgroundColor: 'red',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50
        }}
        onPress={toggleScreenFlag}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            color: 'white'
          }}
        >
          {'공유중지'}
        </Text>
      </TouchableOpacity>
    </View>
  ) : isMultipleView ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        elevation: 0,
        backgroundColor: '#000'
      }}
    />
  ) : !isMuteVideo && stream && !drawing ? (
    <RTCView
      style={styles.RTCVideo}
      mirror={videoType !== 'desktop' && !isVideoReverse}
      objectFit={
        localPipMode || isTablet ? 'cover' : videoType === undefined ? 'contain' : objectFit
      }
      streamURL={stream.toURL()}
      zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
    />
  ) : mainUser.status === 'interrupted' ? (
    muteView
  ) : (
    <LinearGradient
      start={{ x: 0.5, y: 0.3 }}
      end={{ x: 0.5, y: 0 }}
      colors={['rgb(187,197,208)', 'rgb(161,173,180)']}
      style={styles.imageContainer}
    >
      {!drawing && (
        <Image source={icMan1} style={{ width: '100%', height: '150%' }} resizeMode={'contain'}/>
      )}
    </LinearGradient>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  RTCVideo: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    elevation: 0,
    backgroundColor: '#000'
  },
  imageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    elevation: 0
  }
});

export default MainPresenter;
