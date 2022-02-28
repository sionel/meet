import React, { Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import imgCharacter01 from '@assets/icons/img_character_man.png';
import imgCharacter02 from '@assets/icons/img_character_woman.png';
import imgCharacter03 from '@assets/icons/img_character_woman2.png';
import icMaster from '@assets/icons/ic_master.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';

import CustomIcon from '@components/CustomIcon';
import { ParticipantsTypes } from '@redux/participants';
import { getT } from '@utils/translateManager';
import deviceInfoModule from 'react-native-device-info';

const canUseStream = true;
const isTablet = deviceInfoModule.isTablet();

const { OS } = Platform;

type ParticipantBoxProps = {
  videoTrack: any;
  user: ParticipantsTypes & { isMuteMic?: boolean };
  isMuteVideo: boolean;
  character: string;
  setMainUser: (id: string) => void;
  isMultipleView: boolean;
  handleTouchView: () => void;
  index: any;
  multiView: { width: number, height: number}
  orientation: 'vertical' | 'horizontal'
};

/**
 * ContentPresenter
 */
const ParticipantBoxPresenter = (props: ParticipantBoxProps) => {
  const {
    videoTrack,
    user,
    isMuteVideo,
    setMainUser,
    character,
    isMultipleView,
    handleTouchView,
    index,
    multiView,
    orientation
  } = props;

  const t = getT();
  const stream = videoTrack && videoTrack.getOriginalStream();

  const isMuteMic = user.isLocal
    ? user.isMuteMic
    : user.audioTrack === null
    ? true
    : user.audioTrack?.muted;

  const content = canUseStream ? (
    stream && !isMuteVideo ? (
      <View style={[styles.video, isMultipleView && multiView]}>
        <RTCView
          style={styles.rtcSize}
          mirror={false}
          objectFit={'cover'}
          streamURL={stream.toURL()}
          zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
        />
      </View>
    ) : (
      <View style={[styles.video, isMultipleView && multiView]}>
        <Image
          source={
            character === 'jessie'
              ? imgCharacter03
              : character === 'suzy'
              ? imgCharacter02
              : imgCharacter01
          }
          resizeMode={'cover'}
          style={[styles.imageCameraOff, orientation === 'horizontal' && isMultipleView && {width: '50%'}]}
        />
      </View>
    )
  ) : (
    <View style={[styles.video, { backgroundColor: '#00000030' }]}>
      <CustomIcon name={'personIcon'} width={60} height={60} />
    </View>
  );

  /**
   * 닉네임 표기 방법
   * 닉네임(이름) > 이름
   * @param {*} user
   */
  const getUserName = (user: any) => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isMultipleView && {
          ...multiView,
          marginHorizontal: 0
        },
        index % 2 === 0 && { marginRight: 10 }
      ]}
      onPress={handleTouchView}
    >
      <View style={[styles.videoArea, isMultipleView && multiView]}>
        {isMultipleView && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: 36,
              paddingHorizontal: '5%',
              paddingVertical: '5%',
              zIndex: 3,
              elevation: 3
            }}
          >
            <TouchableHighlight
              style={{
                width: 29,
                height: 29,
                borderRadius: 14.5,
                backgroundColor: '#03030333',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={isMuteMic ? icMicOff : icMicOn}
                resizeMode={'cover'}
                style={[
                  { width: 20, height: 20 },
                  isMuteMic && { opacity: 0.5 }
                ]}
              />
            </TouchableHighlight>
          </View>
        )}
        {content}
        <View
          style={[
            styles.nameArea,
            isMultipleView && {height: '15%'},
            OS === 'android' && !isMultipleView && { bottom: 10 }
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {isMultipleView && (
              <Fragment>
                {user.isLocal && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 29,
                      backgroundColor: '#6767f7',
                      borderRadius: 14
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'DOUZONEText50',
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      {t('나')}
                    </Text>
                  </View>
                )}
                {user.userInfo?.isExternalParticipant === 'true' && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 37,
                      height: 29,
                      backgroundColor: '#75b7cb',
                      borderRadius: 14
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'DOUZONEText50',
                        color: '#fff',
                        fontSize: 13
                      }}
                    >
                      {t('외부')}
                    </Text>
                  </View>
                )}
                {user.isMaster && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 29,
                      height: 29,
                      borderRadius: 14.5,
                      backgroundColor: '#febc2c',
                      marginLeft: 2
                    }}
                  >
                    <Image
                      source={icMaster}
                      resizeMode={'cover'}
                      style={{ width: 20, height: 20 }}
                    />
                  </View>
                )}
              </Fragment>
            )}

            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
              {getUserName(user)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 104,
    height: 120,
    display: 'flex',
    marginHorizontal: 10,
    marginVertical: '2%'
  },
  videoArea: {
    flex: 1,
    width: 104,
    height: 120,
    borderWidth: 0,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  videoAreaSelected: {
    borderWidth: 3,
    borderColor: '#039BE5'
  },
  video: {
    flex: 1,
    backgroundColor: 'rgb(187,197,208)',
    justifyContent: 'center',
    alignItems: 'center',
    width: 105,
    height: 120
  },
  profile: {
    color: '#DDD',
    fontSize: 32
  },
  nameArea: {
    position: 'absolute',
    width: '100%',
    height: isTablet ? '25%' : '20%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  name: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 15,
    marginLeft: 2
  },
  imageCameraOff: {
    width: '100%',
    height: '100%'
  },
  rtcSize: {
    width: '100%',
    height: '100%'
  }
});

export default ParticipantBoxPresenter;
