import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  ScrollView
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ButtonCameraOff from '../../../../../assets/buttons/btn_vc_camera_off.png';
import ButtonCameraOff2 from '../../../../../assets/icons/icoCameraWhLargeOff_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn.jpg';
import ProfileImage from '../../../../../assets/icons/imgVcNophoto_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn2.png';
import { CustomLottie } from '../../../../components';

/**
 * MainVideoPresenter
 */
const MainVideoPresenter = props => {
  const {
    isMuteVideo,
    stream,
    videoType,
    mainUser,
    callType,
    isVideoReverse
  } = props;
  const displayTime = (
    <View
      // onTouchEnd={props.onChangeObjectFit}
      style={{
        top: 50,
        left: 25,
        position: 'absolute',
        zIndex: 5
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
          textAlign: 'center'
        }}
      >
        {second2String(props.time)}
      </Text>
    </View>
  );

  const muteView = (
    <View
      style={{
        position: 'absolute',
        top: 36,
        // bottom: 0,
        height: 41,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'rgba(255,255,255, .67)',
        // backgroundColor: '#F15F5F',
        zIndex: 4
      }}
    >
      <Text
        style={{
          // backgroundColor: 'black',
          backgroundColor: '#F15F5F',
          // width: '100%',
          padding: 10,
          color: '#fff',
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 14
        }}
      >
        네트워크가 불안정해요 :(
      </Text>
    </View>
  );

  const userInfo = mainUser.userInfo;
  if (!isMuteVideo && stream && callType != 2) {
    return (
      <View style={{ flex: 1 }}>
        {/* RTCVideo 를 메인화면으로 설정하고 */}

        <RTCView
          style={styles.RTCVideo}
          // mirror={true}
          mirror={isVideoReverse}
          objectFit={
            videoType && videoType === 'desktop' ? 'contain' : props.objectFit
          }
          streamURL={stream.toURL()}
        />

        {/* Video 화면 위에 있는 요소들을 absolute 로 띄운다 */}
        {displayTime}
        {mainUser.status === 'interrupted' && muteView}
        {/* {muteView} */}
        <View style={styles.videoContainer}>
          {/* {displayTime} */}
          {/* {mainUser.status === 'interrupted' && muteView} */}
          {/* {muteView} */}
          {props.children}
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.muteContainer}>
        {callType == 2 ? (
          // {callType != 2 ? (
          <View style={{ ...styles.imageContainer }}>
            <View style={{ display: 'flex' }}>
              <CustomLottie source="voiceBroadcast" width={280} height={280}>
                <View
                  style={{
                    position: 'absolute',
                    top: -205,
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#c0c0c0',
                      textAlign: 'center'
                    }}
                  >
                    통화중
                  </Text>
                  <Text
                    style={{
                      fontSize: 25,
                      color: '#c0c0c0',
                      textAlign: 'center'
                    }}
                  >
                    {second2String(props.time)}
                  </Text>
                </View>
                <Image style={styles.profileImage} source={ProfileImage} />
                <View
                  style={{
                    position: 'absolute',
                    top: 180,
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{ fontSize: 25, fontWeight: 'bold', color: '#fff' }}
                  >
                    {mainUser.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#fff', paddingTop: 10 }}>
                    {userInfo && userInfo.companyFullpath
                      ? userInfo.companyFullpath
                      : ''}
                  </Text>
                </View>
              </CustomLottie>
            </View>
          </View>
        ) : (
          <Fragment>
            {displayTime}
            <View style={styles.imageContainer}>
              {mainUser.status === 'interrupted' && muteView}
              <Image
                source={ButtonCameraOff2}
                style={{ width: 60, height: 55 }}
              />
            </View>
          </Fragment>
        )}
        {props.children}
      </View>
    );
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  RTCVideo: {
    flex: 1,
    // height: '100%',
    backgroundColor: '#1D1D1D'
    // backgroundColor: 'gray'
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  rrr: {
    transform: [{ rotateY: '180deg' }] // 좌우반전
  },
  muteContainer: {
    flex: 1,
    backgroundColor: '#1D1D1D'
    // backgroundColor: 'gray'
  },
  imageContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  profileImage: {
    marginTop: -7,
    marginLeft: 7,
    padding: 0,
    width: 150,
    height: 150,
    borderRadius: 145 / 2,
    borderWidth: 2,
    backgroundColor: '#1D1D1D',
    borderColor: '#d1d1d1'
    // borderColor: '#1C90FB'
  }
});

function second2String(second) {
  var hours = Math.floor(second / 3600);
  var minutes = Math.floor((second - hours * 3600) / 60);
  var seconds = second - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
}

export default MainVideoPresenter;
