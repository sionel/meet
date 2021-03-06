import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RTCView, ScreenCapturePickerView } from 'react-native-webrtc';
import ButtonCameraOff from '../../../../../assets/buttons/btn_vc_camera_off.png';
import ButtonCameraOff2 from '../../../../../assets/icons/icoCameraWhLargeOff_2x.png';
import imgCharacter01 from '../../../../../assets/icons/imgCharacter01_2x.png';
import imgCharacter02 from '../../../../../assets/icons/imgCharacter02_2x.png';
import imgCharacter03 from '../../../../../assets/icons/imgCharacter03_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn.jpg';
import ProfileImage from '../../../../../assets/icons/imgVcNophoto_2x.png';
// import ProfileImage from '../../../../../assets/smapleImages/nnn2.png';
import { wehagoMainURL } from '../../../../utils';
import { CustomIcon } from '../../../../components';

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
    pipMode,
    setRef,
    test,
    drawing,
    isScreenShare,
    setScreenFlag,
    toggleScreenFlag
  } = props;

  const localPipMode = useSelector(state => state.local.pipMode);

  const getUserName = user => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  const displayTime = (
    <View
      style={{
        position: 'absolute',
        top: props.hasNotch && props.orientation === 'vertical' ? 50 : 25,
        left: props.hasNotch && props.orientation !== 'vertical' ? 45 : 25,
        height: 36,
        zIndex: 5,
        justifyContent: 'center'
      }}
    >
      <Text
        style={{
          fontSize: 18,
          color: '#fff',
          textAlign: 'center',
          fontFamily: 'DOUZONEText30'
        }}
        onPress={() => console.warn(mainUser)}
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
        ??????????????? ??????????????? :(
      </Text>
    </View>
  );
  const maxSize = Math.min(width, height);
  const pictureSize = maxSize < 680 ? maxSize / 3 : maxSize / 4;
  const userInfo = mainUser.userInfo;
  let character = '';
  if (props?.mainUser?.userInfo?.avatar) {
    character = JSON.parse(props?.mainUser?.userInfo?.avatar)?.value;
  }
  character = props?.mainUser?.videoTrack?.isMuted() ? 'jangok' : character;

  return (
    <View style={{ flex: 1 }}>
      {isScreenShare ? (
        <View
          style={{
            position: 'absolute',
            top: 250,
            bottom: 250,
            left: 50,
            right: 50,
            // backgroundColor: '#f5353a',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <CustomIcon name={'icoScreenShagre'} height={70} width={70} />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              marginVertical: 20,
              color: 'white'
            }}
          >
            {'????????? ?????? ??? ?????????.'}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            {'?????? ??????????????? ????????? ????????? ???????????????\n????????? ??? ????????????'}
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
              {'????????????'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : !isMuteVideo && stream && !drawing ? (
        <RTCView
          style={styles.RTCVideo}
          mirror={videoType !== 'desktop' && !isVideoReverse}
          objectFit={
            localPipMode
              ? 'cover'
              : videoType && videoType === 'desktop'
              ? 'contain'
              : props.objectFit
          }
          streamURL={stream.toURL()}
          zOrder={0} // zOrder ??? [0, 1] ??? ???????????? (???????)
        />
      ) : (
        <View style={styles.imageContainer}>
          {!drawing && (
            <Image
              source={
                character === 'jessie'
                  ? imgCharacter03
                  : character === 'suzy'
                  ? imgCharacter02
                  : imgCharacter01
              }
              style={{ width: pictureSize, height: pictureSize }}
            />
          )}
        </View>
      )}

      {/* ????????? (??????) */}
      <View
        style={{
          position: 'absolute',
          // zIndex: 5,
          top:
            props.orientation === 'vertical'
              ? 75 + (props.hasNotch ? 25 : 0) // ????????????
              : 25, // ????????????
          // left: props.hasNotch && props.orientation !== 'vertical' ? 45 : 25
          left: 0,
          right: 0,
          height: 36,
          zIndex: 5,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={{ color: '#fff', fontSize: 18, fontFamily: 'DOUZONEText30' }}
        >
          {getUserName(mainUser)}
        </Text>
      </View>

      {/* ???????????? ??? ????????? ???????????? */}
      {Number(callType) !== 2 && !localPipMode && displayTime}

      {/* ???????????? ????????? */}
      {mainUser.status === 'interrupted' && muteView}

      {/* ?????? ????????? */}
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
    transform: [{ rotateY: '180deg' }] // ????????????
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
