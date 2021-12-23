import React, { Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import CustomIcon from '../../../../../components/CustomIcon';
import { wehagoMainURL } from '../../../../../utils';
import { getT } from '../../../../../utils/translateManager';

const UserListPresenter = props => {
  const {
    userList,
    presenter,
    speaker,
    toggleMuteMic,
    // toggleMuteSpeaker,
    onChangeSpeaker // 스피커폰
  } = props;
  const t = getT();
  /**
   * 닉네임 표기 방법
   * 닉네임(이름) > 이름
   * @param {*} user
   */
  const getUserName = user => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
      style={{ height: '100%' }}
      showsVerticalScrollIndicator={false}
    >
      <FlatList
        data={userList}
        style={styles.userList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemBox}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View
              style={{
                flex: 5,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {item.isMaster && (
                <CustomIcon
                  name={'labelMaster'}
                  width={15}
                  height={15}
                  style={{
                    zIndex: 10,
                    bottom: 0,
                    left: 20,
                    position: 'absolute'
                  }}
                />
              )}
              <View style={styles.profileCover}>
                <Image
                  style={styles.profileImg}
                  source={
                    item.userInfo
                      ? {
                          uri: wehagoMainURL + item.userInfo.profile_url
                        }
                      : null
                  }
                  resizeMode={'center'}
                />
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.nameField}
              >
                {getUserName(item)}
                {/* ({item.userInfo.wehagoId || '외부참여자'}) */}
              </Text>
              {item.id === 'localUser' && (
                <View style={[styles.presenter, { backgroundColor: '#fb0' }]}>
                  <Text style={styles.presenterText}>{t('chatting_me')}</Text>
                </View>
              )}
              {item.id === presenter && (
                <View style={styles.presenter}>
                  <Text style={styles.presenterText}>
                    {t('chatting_presenter')}
                  </Text>
                </View>
              )}
              {!item.userInfo.wehagoId && (
                <View
                  style={[
                    styles.presenter,
                    { backgroundColor: 'rgb(112,172,196)' }
                  ]}
                >
                  <Text style={styles.presenterText}>
                    {t('chatting_external')}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end'
              }}
            >
              {/* 스피커폰 컨트롤 */}
              <TouchableOpacity
                onPress={onChangeSpeaker}
                style={{ padding: 6 }}
              >
                {speaker === 1 && item.id === 'localUser' && (
                  <CustomIcon name={'speakerOn'} width={24} height={24} />
                )}
                {speaker === 2 && item.id === 'localUser' && (
                  <CustomIcon name={'speakerOff'} width={24} height={24} />
                )}
              </TouchableOpacity>

              {/* 마이크 컨트롤 */}
              {item.id === 'localUser' ? (
                <TouchableOpacity
                  onPress={toggleMuteMic}
                  style={{ padding: 6 }}
                >
                  <CustomIcon
                    name={item.isMuteMic ? 'mikeOff' : 'mikeOn'}
                    width={24}
                    height={24}
                  />
                </TouchableOpacity>
              ) : // <CustomIcon
              //   name={item.isMuteAudio ? 'mikeOff' : 'mikeOn'}
              //   width={30}
              //   height={24}
              // />
              null}
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  userList: {
    paddingTop: 16,
    paddingBottom: 16
  },
  itemBox: {
    flexDirection: 'row',
    width: '100%',
    height: 60,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 7,
    paddingLeft: 14,
    paddingRight: 14
  },
  profileCover: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor: '#ccc',
    overflow: 'hidden'
  },
  profileImg: {
    width: 32,
    height: 32,
    zIndex: -1
  },
  nameField: {
    maxWidth: '50%',
    marginLeft: 10,
    fontSize: 18,
    fontFamily: 'DOUZONEText30'
  },
  presenter: {
    marginLeft: 5,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#690',
    borderRadius: 20,
    borderWidth: 0
  },
  presenterText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'DOUZONEText30'
  }
});

export default UserListPresenter;


{/* <FlatList
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={{ flex: 1 }}
            data={selectedEmployee.member}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }: any) => {
              const isMaster = item.is_master;

              return (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ref={el => (scrollRef.current[index] = el)}
                  scrollEnabled={item.user_no !== auth.user_no}
                  onScrollEndDrag={(
                    e: NativeSyntheticEvent<NativeScrollEvent>
                  ) => {
                    onHandleSwipe(e, index);
                  }}
                >
                  <View
                    style={[styles.participantList, { width: width * 0.9 }]}
                  >
                    {item.direction === 'LEFT' && (
                      <Animated.View
                        onLayout={fadeInAnimated}
                        style={{
                          width: 50,
                          marginRight: 15,
                          opacity: 1,
                          transform: [
                            {
                              translateX: fadeInValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-50, 0]
                              })
                            }
                          ]
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'rgb(28,144,251)',
                            width: 50,
                            height: '100%',
                            // marginRight: 15,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onPress={(e: GestureResponderEvent) => {
                            onHandelResetSwipe(e, index);
                          }}
                        >
                          <Image
                            source={icUserW}
                            style={{
                              width: 45,
                              height: 45
                            }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.profileView,
                        isTablet && { width: 46, height: 46 }
                      ]}
                      onPress={() => {
                        clickDeleteUser(item, index);
                      }}
                      disabled={item.user_no === auth.user_no}
                    >
                      <View
                        style={[
                          styles.myView,
                          isNormal &&
                            item.user_no !== auth.user_no && {
                              backgroundColor: '#00ff0000'
                            },
                          !isNormal &&
                            item.user_no !== auth.user_no && {
                              backgroundColor: '#1c90fb'
                            }
                        ]}
                      >
                        {item.user_no === auth.user_no ? (
                          <Text style={styles.myText}>
                            {t('renewal.chatting_me')}
                          </Text>
                        ) : isNormal ? (
                          <Fragment />
                        ) : (
                          <Image
                            source={icCancel_W}
                            style={styles.icCancelUser}
                          />
                        )}
                      </View>
                      <Image
                        style={styles.profile}
                        source={{
                          uri: item.profile_url
                        }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.infoBox}
                      activeOpacity={1}
                      onPress={(e: GestureResponderEvent) => {
                        scrollRef.current[index]?.scrollTo({
                          x: 0,
                          animated: true
                        });
                        onHandelResetSwipe(e, index);
                      }}
                    >
                      <View style={styles.infoBox}>
                        {item.full_path !== '' ? (
                          <Fragment>
                            <Text style={styles.name}>
                              {item.user_name}{' '}
                              {item.rank_name ? item.rank_name : ''}
                            </Text>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={styles.tree}
                            >
                              {item.full_path}
                            </Text>
                          </Fragment>
                        ) : (
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[styles.tree, { fontSize: 15 }]}
                          >
                            {item.user_name}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleContainer,
                        isMaster && { borderColor: '#01acc1' },
                        !item.user_no && { borderColor: '#fff' },
                        isTablet && { width: 140 }
                      ]}
                      onPress={() => {
                        clickChangeRole(item, index);
                      }}
                      disabled={item.user_no === auth.user_no}
                      activeOpacity={isNormal ? 1 : 0.6}
                    >
                      {isMaster ? (
                        <Fragment>
                          <Text
                            style={[
                              styles.maseterText,
                              isTablet && { fontSize: 14 }
                            ]}
                          >
                            {t('renewal.chatting_master')}
                          </Text>
                          <Image
                            style={[
                              styles.icMaster,
                              isTablet && styles.icTabletMaster
                            ]}
                            source={icMasterCircle}
                            resizeMode={'contain'}
                          />
                        </Fragment>
                      ) : item.user_no ? (
                        <Fragment>
                          <Image
                            style={[
                              styles.icMaster,
                              isTablet && styles.icTabletMaster
                            ]}
                            source={icAttdCircle}
                            resizeMode={'contain'}
                          />

                          <Text
                            style={[
                              styles.attendantText,
                              isTablet && { fontSize: 14 }
                            ]}
                          >
                            {t('renewal.direct_create_participants')}
                          </Text>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Text style={styles.extText}>
                              {t('외부참여자')}
                            </Text>
                        </Fragment>
                      )}
                    </TouchableOpacity>
                    {item.direction === 'RIGHT' && (
                      <Animated.View
                        onLayout={fadeInAnimated}
                        style={{
                          width: 50,
                          marginRight: 15,
                          opacity: 1,
                          transform: [
                            {
                              translateX: fadeInValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0]
                              })
                            }
                          ]
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: 'rgb(252, 76, 96)',
                            width: 50,
                            height: '100%',
                            marginLeft: 15,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onPress={(e: GestureResponderEvent) => {
                            clickDeleteUser(item, index);
                          }}
                        >
                          <Image
                            source={icOut}
                            style={{ width: 40, height: 40 }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </Animated.View>
                    )}
                  </View>
                </ScrollView>
              );
            }}
          /> */}