import { ParticipantsTypes } from '@redux/participants';
import React, { Component, Fragment, MutableRefObject, useMemo } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';
import icUserW from '@assets/icons/ic_user_w3.png';
import icMaster from '@assets/icons/ic_master.png';
import icOut from '@assets/icons/ic_out_w.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icHandW from '@assets/icons/ic_hand_w.png';
import { getT } from '@utils/translateManager';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { FlatList, gestureHandlerRootHOC } from 'react-native-gesture-handler';

import Device from 'react-native-device-info';
import { getConferenceManager } from '@utils/ConferenceManager';

const isPad = Device.isTablet();
const { width } = Dimensions.get('window');
const rightSwipeWidth = Platform.OS === 'ios' ? width * 0.185 : width * 0.175;
const leftSwipeWidth = width * 0.3;

type UserListPresenter = {
  userList: ParticipantsTypes[];
  isMasterControl: boolean;
  swipeRef: MutableRefObject<any>;
  handelProfileTouch: (item: ParticipantsTypes) => void;
  handleKickUser: (id: string, userName: string) => void;
  isRoomMaster: boolean;
  authName: string;
};

const UserListPresenter = gestureHandlerRootHOC((props: UserListPresenter) => {
  const {
    userList,
    isMasterControl,
    handelProfileTouch,
    swipeRef,
    isRoomMaster,
    handleKickUser,
    authName
  } = props;

  const t = getT();

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      data={userList}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }: any) => {
        // console.log('UserList_Item : ', item);

        const { isMaster, userInfo, id } = item;
        // 마이크음소거여부
        const isMuteMic = item.isLocal
          ? item.isMuteMic
          : item.audioTrack === null
          ? true
          : item.audioTrack?.muted;
        // 회사 조직경로
        const fullPath = userInfo.companyFullpath;
        // 프로필뷰
        const profileUrl = userInfo.profile_url
          ? wehagoMainURL + userInfo.profile_url
          : wehagoDummyImageURL;
        // 이름
        const userName = item.name ? item.name : userInfo.userName;

        const renderLeftActions = (
          progress: any,
          dragX: Animated.AnimatedInterpolation
        ) => {
          const trans = isPad
            ? dragX.interpolate({
                inputRange: [0, 56, 112],
                outputRange: [-112, -56, 0]
              })
            : dragX.interpolate({
                inputRange: [0, leftSwipeWidth / 2, leftSwipeWidth],
                outputRange: [-leftSwipeWidth, -(leftSwipeWidth / 2), 0]
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
                }
              ]}
            >
              <TouchableOpacity
                style={styles.userTouchView}
                activeOpacity={0.2}
                onPress={(e: GestureResponderEvent) => {
                  handelProfileTouch(item);
                }}
              >
                <Image
                  source={icUserW}
                  style={styles.imageSize}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.masterTouchView}
                activeOpacity={0.2}
                onPress={() => swipeRef.current[index].close()}
              >
                <Image
                  source={icMaster}
                  style={styles.imageSize}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </Animated.View>
          );
        };

        const renderRightActions = (
          progress: any,
          dragX: Animated.AnimatedInterpolation
        ) => {
          let conferenceManager = getConferenceManager();

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
                  handleKickUser(id, userName);
                  // conferenceManager.kickUserFromMaster(id, userName)
                  swipeRef.current[index].close();
                }}
              >
                <Image
                  source={icOut}
                  style={styles.imageSize}
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
                {fullPath && (
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
                  },
                  !isMaster &&
                    isMasterControl &&
                    !isMuteMic && { backgroundColor: '#1c90fb' }
                ]}
              >
                {isMaster && (
                  <Fragment>
                    <Image
                      style={{ width: 14, height: 14, marginRight: '5%' }}
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
                {!isMaster && isMasterControl && !isMuteMic && (
                  <Fragment>
                    <Image
                      style={{ width: 14, height: 14, marginRight: '5%' }}
                      source={icHandW}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.roleText}>{t('발언중')}</Text>
                  </Fragment>
                )}
              </View>
              <TouchableHighlight style={styles.micView}>
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
  );
});

const styles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16
  },
  userRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginHorizontal: 16,
    paddingVertical: 8
  },
  leftSwipeView: {
    flexDirection: 'row',
    width: isPad ? 112 : leftSwipeWidth
    // marginRight: 15
  },
  rightSwipeView: {
    width: isPad ? 56 : rightSwipeWidth,
    opacity: 1
  },
  infoBox: {
    flex: 1,
    height: 34,
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 16
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
  imageSize: {
    width: 18,
    height: 18
  },
  profileSize: {
    width: 40,
    height: 40,
    borderRadius: 20
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
  kickView: {
    backgroundColor: '#fc5356',
    width: 56,
    height: '100%',
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default UserListPresenter;
