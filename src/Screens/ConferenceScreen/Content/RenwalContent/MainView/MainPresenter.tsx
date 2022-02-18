import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import icMan1 from '@assets/icons/ic_man1.png';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('screen');

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
    isMultipleView
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
  return isMultipleView ? (
    <View style={{ width: '100%', height: '100%', backgroundColor: '#000' }} />
  ) : !isMuteVideo && stream && !drawing ? (
    <RTCView
      style={styles.RTCVideo}
      mirror={videoType !== 'desktop' && !isVideoReverse}
      objectFit={
        localPipMode ? 'cover' : videoType === undefined ? 'contain' : objectFit
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
        <Image source={icMan1} style={{ width: '100%', height: '100%' }} />
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    backgroundColor: '#000'
  },
  imageContainer: {
    position: 'absolute',
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0
  }
});

export default MainPresenter;
