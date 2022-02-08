import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import icMan1 from '@assets/icons/ic_man1.png';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import LinearGradient from 'react-native-linear-gradient';

const { height, width } = Dimensions.get('screen');

type MainPresenterProps = {
  isMuteVideo: boolean;
  stream: any;
  videoType: any;
  //   isVideoReverse: any;
  drawing: any;
  localPipMode: any;
};

const MainPresenter = (props: MainPresenterProps) => {
  const {
    isMuteVideo,
    stream,
    videoType,
    // isVideoReverse,
    drawing,
    localPipMode
  } = props;

  //zindex:0
  return !isMuteVideo && stream && !drawing ? (
    <RTCView
      style={styles.RTCVideo}
      mirror={videoType !== 'desktop'}
      //   && !isVideoReverse}
      objectFit={'cover'}
      streamURL={stream.toURL()}
      zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
    />
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
    backgroundColor: '#000'
  },
  imageContainer: {
    position: 'absolute',
    display: 'flex',
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
