import { ParticipantsTypes } from '@redux/participants';
import React, { Component, Fragment } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
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
import { getT } from '@utils/translateManager';
import { ConferenceBottomPopupProps } from '@screens/ConferenceScreen/Content/ContentContainer';

const { width, height } = Dimensions.get('window');

type UserListPresenter = {
  onHandleSwipe: (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    i: number
  ) => void;
  onHandelResetSwipe: (e: GestureResponderEvent, i: number) => void;
  // clickDeleteUser: () => void;
  scrollRef: any;
  fadeInAnimated: () => void;
  fadeInValue: Animated.Value;
  swipeList: ParticipantsTypes[];
  handelProfileTouch: (item: ParticipantsTypes) => void;
};

const UserListPresenter = (props: UserListPresenter) => {
  const {
    onHandleSwipe,
    onHandelResetSwipe,
    // clickDeleteUser,
    scrollRef,
    fadeInAnimated,
    fadeInValue,
    swipeList,
    handelProfileTouch
  } = props;

  const t = getT();

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      bounces={true}
      contentContainerStyle={{ flex: 1 }}
      data={swipeList}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }: any) => {
        // console.log('item : ', item);

        const { isMaster, userInfo } = item;
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
        const { userName } = userInfo;

        return (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ref={el => (scrollRef.current[index] = el)}
            // scrollEnabled={item.user_no !== auth.user_no}
            onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
              onHandleSwipe(e, index);
            }}
            // onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
            //   onHandleSwipe(e, index);
            // }}
          >
            <View
              style={[
                styles.itemBox,
                item.direction !== 'NONE' && { paddingHorizontal: 0 }
              ]}
            >
              {item.direction === 'LEFT' && (
                <Animated.View
                  onLayout={fadeInAnimated}
                  style={[
                    styles.leftSideAniStyle,
                    {
                      transform: [
                        {
                          translateX: fadeInValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-100, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.userTouchView}
                    onPress={(e: GestureResponderEvent) => {
                      handelProfileTouch(item);
                      onHandelResetSwipe(e, index);
                    }}
                    activeOpacity={0.2}
                  >
                    <Image
                      source={icUserW}
                      style={styles.imageSize}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.masterTouchView}
                    onPress={(e: GestureResponderEvent) => {
                      onHandelResetSwipe(e, index);
                    }}
                    activeOpacity={0.2}
                  >
                    <Image
                      source={icMaster}
                      style={styles.imageSize}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
              <View style={{flexDirection:'row', alignItems:'center'}}>
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
                <TouchableHighlight
                  style={styles.infoBoxView}
                  activeOpacity={1}
                  // onPress={(e: GestureResponderEvent) => {
                  //   scrollRef.current[index]?.scrollTo({
                  //     x: 0,
                  //     animated: true
                  //   });
                  //   onHandelResetSwipe(e, index);
                  // }}
                  // underlayColor="transparent"
                >
                  <View style={styles.infoBox}>
                    <Fragment>
                      <Text style={styles.nameText}>{userName}</Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.treeText}
                      >
                        {fullPath}
                      </Text>
                    </Fragment>
                  </View>
                </TouchableHighlight>
                <View
                  style={[
                    styles.roleView,
                    isMaster && { backgroundColor: '#febc2c' },
                    userInfo?.isExternalParticipant === 'true' && {
                      backgroundColor: '#75b7cb'
                    }
                    // && { backgroundColor: '#1c90fb'}
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
              {item.direction === 'RIGHT' && (
                <Animated.View
                  onLayout={fadeInAnimated}
                  style={[
                    styles.rightSideAniStyle,
                    {
                      transform: [
                        {
                          translateX: fadeInValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [56, 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.kickView}
                    activeOpacity={0.2}
                    onPress={(e: GestureResponderEvent) => {
                      onHandelResetSwipe(e, index);
                    }}
                  >
                    <Image
                      source={icOut}
                      style={styles.imageSize}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </ScrollView>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16
  },
  leftSideAniStyle: {
    flexDirection: 'row',
    width: 112,
    height: '100%',
    marginRight: 15,
    opacity: 1
  },
  rightSideAniStyle: {
    width: 70,
    opacity: 1
  },
  infoBoxView: {
    width: width * 0.51,
    height: 34,
    marginLeft: 8,
    marginRight: 16
  },
  infoBox: {
    width: width * 0.51,
    height: 34,
    justifyContent: 'center'
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
