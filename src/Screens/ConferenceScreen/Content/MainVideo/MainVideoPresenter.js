import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
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
    isVideoReverse,
    pipMode
  } = props;

  // const dispatch = useDispatch();
  const localPipMode = useSelector(state => state.local.pipMode);
  // if (localPipMode !== pipMode) {
  //   dispatch({ type: 'CONFERENCE_PIP_MODE', pipMode });
  // }

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
          textAlign: 'center',
          fontFamily: 'DOUZONEText30'
        }}
      >
        {conferenceMode !== 'control'
          ? selectedRoomName || (mainUser.id !== 'localUser' && mainUser.name)
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
          // fontWeight: '700',
          fontSize: 14,
          fontFamily: 'DOUZONEText50'
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
      {!isMuteVideo &&
      stream &&
      (callType == 1 || callType == 3) &&
      !props.drawing ? (
        <RTCView
          style={styles.RTCVideo}
          // mirror={true}
          mirror={isVideoReverse}
          objectFit={
            localPipMode
              ? 'cover'
              : videoType && videoType === 'desktop'
              ? 'contain'
              : props.objectFit
          }
          streamURL={stream.toURL()}
          zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
        />
      ) : callType == 2 ? (
        localPipMode ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              통화중
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              {mainUser.id !== 'localUser' && mainUser.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              {second2String(props.time)}
            </Text>
          </View>
        ) : (
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
                      fontSize: 24,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    통화중
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    {second2String(props.time)}
                  </Text>
                </View>
                <Image
                  style={styles.profileImage}
                  source={
                    userInfo
                      ? {
                          uri: 'https://www.wehago.com' + userInfo.profile_url
                        }
                      : ProfileImage
                  }
                />
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
                      // fontWeight: 'bold',
                      color: '#fff',
                      width: Math.min(height, width) * 0.8,
                      textAlign: 'center',
                      fontFamily: 'DOUZONEText50'
                    }}
                  >
                    {mainUser.id !== 'localUser' && mainUser.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#fff',
                      paddingTop: 10,
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    {userInfo && userInfo.companyFullpath
                      ? userInfo.companyFullpath
                      : ''}
                  </Text>
                </View>
              </CustomLottie>
            </View>
          </View>
        )
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
      {callType != 2 && !localPipMode && displayTime}

      {/* 네트워크 불안정 */}
      {mainUser.status === 'interrupted' && muteView}

      {/* 서브 비디오 */}
      {props.children && !localPipMode && (
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
  let hours = Math.floor(second / 3600);
  let minutes = Math.floor((second - hours * 3600) / 60);
  let seconds = Math.floor(second - hours * 3600 - minutes * 60);

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
