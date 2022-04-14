import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  GestureResponderEvent,
  Platform,
  Dimensions
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ParticipantsProps } from '../types';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';
import deviceInfoModule from 'react-native-device-info';

import icPersonPlusW from '@assets/icons/ic_person_plus_w.png';
import icUserW from '@assets/icons/ic_user_w3.png';
import icMaster from '@assets/icons/ic_master.png';
import icOut from '@assets/icons/ic_out_w.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icHandW from '@assets/icons/ic_hand_w.png';
import icBackW from '@assets/icons/ic_back_w.png';
import { getT } from '@utils/translateManager';
import Profile from './Profile';
import InviteList from './InviteList';

const isPad = deviceInfoModule.isTablet();
const { width } = Dimensions.get('window');

const rightSwipeWidth = Platform.OS === 'ios' ? width * 0.185 : width * 0.175;
const leftSwipeWidth = width * 0.3;

const Participant: React.FC<ParticipantsProps> = ({
  insets,
  isRoomMaster,
  isProfile,
  isInviteList,
  swipeRef,
  userInfo,
  onPressInvite,
  onPressProfile,
  onPressMaster,
  ToggleSpeakerClick,
  onPressKick,
  setIsProfile,
  // InviteList
  onClickEmail,
  onClickSms,
  onClickShare,
  onClickLink,
  onClickCode
}) => {
  const t = getT();
  const userList = [
    {
      name: '김연길',
      isMaster: true,
      userInfo: {
        companyFullpath: '플랫폼사업부문 | 서비스개발2센터 | 설..',
        profileUrl: '',
        userName: '김연길',
        user_email: 'kimdouzone@wehago.com',
        user_contact: '010-1234-5678'
      }
    },
    {
      name: '김연길',
      userInfo: {
        companyFullpath: '플랫폼사업부문 | 서비스개발2센터 | 설..',
        profileUrl: '',
        userName: '김연길'
      }
    },
    {
      name: '김연길',
      userInfo: {
        companyFullpath: '플랫폼사업부문 | 서비스개발2센터 | 설..',
        profileUrl: '',
        userName: '김연길'
      }
    },
    {
      name: '김연길',
      userInfo: {
        companyFullpath: '플랫폼사업부문 | 서비스개발2센터 | 설..',
        profileUrl: '',
        userName: '김연길'
      }
    },
    {
      name: '김연길',
      userInfo: {
        companyFullpath: '플랫폼사업부문 | 서비스개발2센터 | 설..',
        profileUrl: '',
        userName: '김연길',
        isExternalParticipant: 'true'
      }
    }
  ];

  return isInviteList ? (
    <InviteList
      insets={insets}
      onClickEmail={onClickEmail}
      onClickSms={onClickSms}
      onClickShare={onClickShare}
      onClickLink={onClickLink}
      onClickCode={onClickCode}
    />
  ) : (
    <BlurView
      style={[styles.popupContainer, { bottom: insets.bottom }]}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <View style={styles.popupHeader}>
          <View style={styles.popupHeaderRow}>
            {isProfile ? (
              <TouchableHighlight
                activeOpacity={0.5}
                onPress={() => setIsProfile(false)}
                underlayColor="transparent"
              >
                <Image source={icBackW} style={styles.iconSize24} />
              </TouchableHighlight>
            ) : (
              <View style={styles.iconSize24} />
            )}
            <Text style={styles.headerText}>
              {isProfile ? `프로필` : `참석자 리스트`}
            </Text>
            {isProfile ? (
              <View style={styles.iconSize24} />
            ) : (
              <TouchableHighlight
                activeOpacity={0.5}
                onPress={() => onPressInvite()}
                underlayColor="transparent"
              >
                <Image source={icPersonPlusW} style={styles.iconSize24} />
              </TouchableHighlight>
            )}
          </View>
        </View>
        <View>
          {isProfile ? (
            <Profile user={userInfo} />
          ) : (
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={userList}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }: any) => {
                const { isMaster, userInfo, id } = item;

                // 마이크음소거여부
                const isMuteMic = item.isLocal
                  ? item.isMuteMic
                  : item.audioTrack === null
                  ? true
                  : item.audioTrack?.muted;
                // 회사 조직경로
                const fullPath = userInfo?.companyFullpath;
                // 프로필뷰
                const profileUrl = userInfo.profile_url
                  ? wehagoMainURL + userInfo.profile_url
                  : wehagoDummyImageURL;
                // 이름
                const userName = item.name ? item.name : userInfo.userName;
                const external = userInfo?.isExternalParticipant === 'true';

                const renderLeftActions = (
                  progress: any,
                  dragX: Animated.AnimatedInterpolation
                ) => {
                  const trans = isPad
                    ? dragX.interpolate({
                        inputRange: [0, 56, 112],
                        outputRange: [-112, -56, 0]
                      })
                    : isRoomMaster
                    ? external || index === 0
                      ? dragX.interpolate({
                          inputRange: [0, leftSwipeWidth / 2],
                          outputRange: [-leftSwipeWidth / 2, 0]
                        })
                      : dragX.interpolate({
                          inputRange: [0, leftSwipeWidth / 2, leftSwipeWidth],
                          outputRange: [
                            -leftSwipeWidth,
                            -(leftSwipeWidth / 2),
                            0
                          ]
                        })
                    : dragX.interpolate({
                        inputRange: [0, leftSwipeWidth / 2],
                        outputRange: [-leftSwipeWidth / 2, 0]
                      });

                  return (
                    <Animated.View
                      style={[
                        styles.leftSwipeView,
                        {
                          transform: [
                            {
                              translateX: trans
                            }
                          ]
                        },
                        {
                          width: isPad
                            ? 112
                            : isRoomMaster
                            ? external || index === 0
                              ? leftSwipeWidth / 2
                              : leftSwipeWidth
                            : leftSwipeWidth / 2
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.userTouchView}
                        activeOpacity={0.2}
                        onPress={(e: GestureResponderEvent) => {
                          onPressProfile(item);
                        }}
                      >
                        <Image
                          source={icUserW}
                          style={styles.iconSize18}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      {isRoomMaster && index !== 0 && !external && (
                        <TouchableOpacity
                          style={styles.masterTouchView}
                          activeOpacity={0.2}
                          onPress={() => {
                            // updateRolefromMaster(userInfo.wehagoId);
                            onPressMaster();
                            swipeRef.current[index].close();
                          }}
                        >
                          <Image
                            source={icMaster}
                            style={styles.iconSize18}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      )}
                    </Animated.View>
                  );
                };

                const renderRightActions = (
                  progress: any,
                  dragX: Animated.AnimatedInterpolation
                ) => {
                  const trans = isPad
                    ? dragX.interpolate({
                        inputRange: [-40, 0],
                        outputRange: [0, 40]
                      })
                    : dragX.interpolate({
                        inputRange: [-rightSwipeWidth, 0],
                        outputRange: [0, rightSwipeWidth]
                      });

                  return isRoomMaster && index !== 0 ? (
                    <Animated.View
                      style={[
                        styles.rightSwipeView,
                        {
                          transform: [
                            {
                              translateX: trans
                            }
                          ]
                        }
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.kickView}
                        activeOpacity={0.2}
                        onPress={() => {
                          //   handleKickUser(id, userName);
                          onPressKick();
                          swipeRef.current[index].close();
                        }}
                      >
                        <Image
                          source={icOut}
                          style={styles.iconSize18}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    </Animated.View>
                  ) : null;
                };

                return (
                  <Swipeable
                    ref={el => (swipeRef.current[index] = el)}
                    renderLeftActions={renderLeftActions}
                    renderRightActions={renderRightActions}
                    // onSwipeableLeftOpen={() => console.log('left!!!')}
                    // onSwipeableRightOpen={() => console.log('right!!!')}
                  >
                    <View style={styles.userRow}>
                      <View style={{ width: 40, height: 40 }}>
                        {item.isLocal && (
                          <View style={styles.myTextView}>
                            <Text style={styles.myText}>
                              {t('renewal.chatting_me')}
                            </Text>
                          </View>
                        )}
                        <Image
                          style={styles.profileSize}
                          source={{
                            uri: profileUrl
                          }}
                          resizeMode={'cover'}
                        />
                      </View>

                      <View style={styles.infoBox}>
                        <Text style={styles.nameText}>{userName}</Text>
                        {fullPath !== '' && (
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={styles.treeText}
                          >
                            {fullPath}
                          </Text>
                        )}
                      </View>

                      <View
                        style={[
                          styles.roleView,
                          isMaster && { backgroundColor: '#febc2c' },
                          userInfo?.isExternalParticipant === 'true' && {
                            backgroundColor: '#75b7cb'
                          }
                          //   !isMaster &&
                          //     isMasterControl &&
                          //     !isMuteMic && { backgroundColor: '#1c90fb' }
                        ]}
                      >
                        {isMaster && (
                          <Fragment>
                            <Image
                              style={{
                                width: 14,
                                height: 14,
                                marginRight: '5%'
                              }}
                              source={icMaster}
                              resizeMode={'contain'}
                            />
                            <Text style={styles.roleText}>
                              {t('renewal.chatting_master')}
                            </Text>
                          </Fragment>
                        )}
                        {userInfo?.isExternalParticipant === 'true' && (
                          <Text style={styles.roleText}>
                            {t('renewal.chatting_external')}
                          </Text>
                        )}
                        {/* {!isMaster && isMasterControl && !isMuteMic && (
                      <Fragment>
                        <Image
                          style={{ width: 14, height: 14, marginRight: '5%' }}
                          source={icHandW}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.roleText}>{t('발언중')}</Text>
                      </Fragment>
                    )} */}
                      </View>
                      <TouchableHighlight
                        activeOpacity={0.5}
                        style={styles.micView}
                        onPress={ToggleSpeakerClick}
                      >
                        <Image
                          source={isMuteMic ? icMicOff : icMicOn}
                          resizeMode={'cover'}
                          style={[
                            { width: 17, height: 17 },
                            isMuteMic && { opacity: 0.5 }
                          ]}
                        />
                      </TouchableHighlight>
                    </View>
                  </Swipeable>
                );
              }}
            />
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    elevation: 2,
    flex: 1
  },
  popupHeader: {
    flex: 1,
    height: 48,
    marginTop: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  popupHeaderRow: {
    height: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginHorizontal: 16,
    paddingVertical: 8
  },
  userTouchView: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 56,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  masterTouchView: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 56,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  myTextView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 19,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6767f7',
    zIndex: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  myText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 10,
    color: '#fff'
  },
  infoBox: {
    flex: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 16
  },
  nameText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'DOUZONEText30'
  },
  treeText: {
    fontSize: 12,
    color: '#939393',
    fontFamily: 'DOUZONEText30'
  },
  kickView: {
    backgroundColor: '#fc5356',
    width: 56,
    height: '100%',
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleView: {
    width: 57,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  roleText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 11,
    color: '#fff'
  },
  micView: {
    backgroundColor: '#000',
    width: 25,
    height: 25,
    borderRadius: 13,
    opacity: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeView: {
    flexDirection: 'row'
    // marginRight: 15
  },
  rightSwipeView: {
    width: isPad ? 56 : rightSwipeWidth,
    opacity: 1
  },
  profileSize: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  iconSize24: {
    width: 24,
    height: 24
  },
  iconSize18: {
    width: 18,
    height: 18
  }
});

export default Participant;
