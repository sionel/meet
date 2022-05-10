import React, { Fragment } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';

import icUserW from '@assets/icons/ic_user_w3.png';
import icMaster from '@assets/icons/ic_master.png';
import icOut from '@assets/icons/ic_out_w.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icHandW from '@assets/icons/ic_hand_w.png';
import { getT } from '@utils/translateManager';
import { ParticipantCardPros } from '@screens/ConferenceScreen_New/types';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';

const { width } = Dimensions.get('window');

const rightSwipeWidth = Platform.OS === 'ios' ? width * 0.185 : width * 0.175;
const leftSwipeWidth = width * 0.3;

const ParticipantCard: React.FC<ParticipantCardPros> = ({
  participants,
  swipeRef,
  isRoomMaster,
  isPad,
  onPressProfile,
  onPressMaster,
  onPressKick
}) => {
  const t = getT();
  const { masterContorl } = useSelector((state: RootState) => ({
    masterContorl: state.master.isMasterControl
  }));
  
  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      data={participants}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }: any) => {
        const {
          audioTrack,
          companyFullpath,
          profileUrl,
          name,
          isMaster,
          wehagoId
        } = item;
        // 마이크음소거여부
        const isMuteMic = audioTrack ? audioTrack.isMuted() : true;
        // 프로필뷰
        const profile_Url = profileUrl
          ? wehagoMainURL + profileUrl
          : wehagoDummyImageURL;
        // 외부참여자
        const external = wehagoId ? false : true;

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
                  outputRange: [-leftSwipeWidth, -(leftSwipeWidth / 2), 0]
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
                },
                { width: isPad ? 56 : rightSwipeWidth }
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
          >
            <View style={styles.userRow}>
              <View style={{ width: 40, height: 40 }}>
                {index === 0 && (
                  <View style={styles.myTextView}>
                    <Text style={styles.myText}>
                      {t('renewal.chatting_me')}
                    </Text>
                  </View>
                )}
                <Image
                  style={styles.profileSize}
                  source={{
                    uri: profile_Url
                  }}
                  resizeMode={'cover'}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.nameText}>{name}</Text>
                {companyFullpath !== '' && (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.treeText}
                  >
                    {companyFullpath}
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.roleView,
                  isMaster && { backgroundColor: '#febc2c' },
                  external && {
                    backgroundColor: '#75b7cb'
                  },
                  !isMaster &&
                    masterContorl &&
                    !isMuteMic && { backgroundColor: '#1c90fb' }
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
                {external && (
                  <Text style={styles.roleText}>
                    {t('renewal.chatting_external')}
                  </Text>
                )}
                {!isMaster && masterContorl && !isMuteMic && (
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
              <TouchableHighlight
                activeOpacity={0.5}
                style={styles.micView}
                onPress={() => {}}
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
  );
};

export default ParticipantCard;

const styles = StyleSheet.create({
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
  },
  rightSwipeView: {
    opacity: 1
  },
  profileSize: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  iconSize18: {
    width: 18,
    height: 18
  }
});
