import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  Dimensions
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ButtonCameraOff from '../../../../../assets/buttons/btn_vc_camera_off.png';
import ButtonCameraOff2 from '../../../../../assets/icons/icoCameraWhLargeOff_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn.jpg';
import ProfileImage from '../../../../../assets/icons/imgVcNophoto_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn2.png';
import { CustomLottie } from '../../../../components';

const { height, width } = Dimensions.get('window');

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
    selectedRoomName,
    conferenceMode,
    isVideoReverse
  } = props;

  const displayTime = (
    <View
      // onTouchEnd={props.onChangeObjectFit}
      style={{
        top: props.hasNotch && props.orientation === 'vertical' ? 50 : 25,
        left: props.hasNotch && props.orientation !== 'vertical' ? 45 : 25,
        // left: 25,
        position: 'absolute',
        zIndex: 5
      }}
    >
      <Text
        style={{
          fontSize: Platform.OS === 'ios' ? 22 : 20,
          color: '#fff',
          textAlign: 'center'
        }}
      >
        {conferenceMode !== 'control'
          ? selectedRoomName
          : second2String(props.time)}
      </Text>
    </View>
  );

  const muteView = (
    <View
      style={{
        position: 'absolute',
        top: '45%',
        // bottom: 0,
        height: 41,
        left: 0,
        // width: '50%',
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

  return (
    <View style={{ flex: 1, backgroundColor: '#1D1D1D' }}>
      {/* 정상적인 화상대화 일 때 */}
      {!isMuteVideo && stream && callType == 1 && !props.drawing ? (
        <RTCView
          style={styles.RTCVideo}
          // mirror={true}
          mirror={isVideoReverse}
          objectFit={
            videoType && videoType === 'desktop' ? 'contain' : props.objectFit
          }
          streamURL={stream.toURL()}
        />
      ) : callType == 2 ? (
        <View style={{ ...styles.imageContainer }}>
          {/* 음성대화 일 때 */}
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
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#fff',
                    width: Math.min(height, width) * 0.8,
                    textAlign: 'center'
                  }}
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
        <View style={styles.imageContainer}>
          {!props.drawing && (
            <Image
              source={ButtonCameraOff2}
              style={{ width: 60, height: 55 }}
            />
          )}
        </View>
      )}

      {/* 화상대화 중 나오는 통화시간 */}
      {callType != 2 && displayTime}

      {/* 네트워크 불안정 */}
      {mainUser.status === 'interrupted' && muteView}

      {/* 서브 비디오 */}
      {props.children && (
        <View style={styles.videoContainer}>{props.children}</View>
      )}
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  RTCVideo: {
    // flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // height: '100%',
    backgroundColor: '#1D1D1D'
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
