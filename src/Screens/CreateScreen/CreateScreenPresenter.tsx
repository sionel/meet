import React, { Dispatch, Fragment, SetStateAction } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';

import { Placeholder } from '@components/index';

import {
  ic_user_blue as icUserBlue,
  ic_cancel2 as icCancel2,
  ic_lock_w as icLock_W
} from '@assets/index';

import { useTranslation } from 'react-i18next';
import { wehagoMainURL } from '@utils/index';
import SearchTextInputBox from '@components/renewal/SearchTextInputBox';

import deviceInfoModule from 'react-native-device-info';
const isPad = deviceInfoModule.isTablet();

// export interface section {
//   title: string;
//   data: any[];
//   type: 'personal' | 'group' | 'semu';
//   collapse: boolean;
//   height: Animated.Value;
//   zIndex?: number;
// }
interface createProps {
  // onSearch: (key: string) => void;
  onPressSearching: () => void;
  group: any[];
  personal: any[];
  semu: any[];
  // suim: section;
  loaded: boolean;
  indicatorFlag: boolean;
  keyword: string;
  tabType: 'personal' | 'group' | 'semu';
  onRefresh: () => void;
  onClickBack: () => void;
  // onClickHeader: (section: section) => void;
  onClickStartButton: (conference: any) => void;
  setKeyword: Dispatch<SetStateAction<string>>;
  setTabType: Dispatch<SetStateAction<'personal' | 'group' | 'semu'>>;
}

function CreateScreenPresenter(props: createProps) {
  const {
    indicatorFlag,
    onPressSearching,
    loaded,
    onRefresh,
    group,
    personal,
    semu,
    // suim,
    keyword,
    tabType,
    onClickBack,
    // onClickHeader,
    onClickStartButton,
    setKeyword,
    setTabType
  } = props;
  const { t } = useTranslation();

  return (
    <Fragment>
      {/* <SafeAreaView style={styles.safeArea} /> */}
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          animating={indicatorFlag}
          size={'large'}
          color={'#1c90fb'}
          style={styles.indicatoer}
        />
        <View style={styles.topTitle}>
          <TouchableOpacity onPress={onClickBack}>
            <Image
              source={icCancel2}
              style={styles.icBack}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text style={styles.HeaderTitleText}>
            {t('renewal.main_create_messenger')}
          </Text>
          <TouchableOpacity disabled={true}>
            <Text style={styles.emptyText}>확인</Text>
          </TouchableOpacity>
        </View>
        <SearchTextInputBox
          keyword={keyword}
          inputboxPlaceholder={t('대화방 명을 검색하세요.')}
          setKeyword={setKeyword}
          onSearchSubmitEditing={onPressSearching}
        />
        <View style={styles.roomTabContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setTabType('group');
              // focusOut();
            }}
            style={[styles.tabText, tabType === 'group' && styles.selectedTab]}
          >
            <Text
              style={{
                color: tabType === 'group' ? '#1c90fb' : '#8c8c8c',
                fontFamily:
                  tabType === 'group' ? 'DOUZONEText50' : 'DOUZONEText30',
                fontSize: 14
              }}
            >
              {t('renewal.create_room_group')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setTabType('personal');
              // focusOut();
            }}
            style={[
              styles.tabText,
              tabType === 'personal' && styles.selectedTab
            ]}
          >
            <Text
              style={{
                color: tabType === 'personal' ? '#1c90fb' : '#8c8c8c',
                fontFamily:
                  tabType === 'personal' ? 'DOUZONEText50' : 'DOUZONEText30',
                fontSize: 14
              }}
            >
              {t('renewal.create_room_oneonone')}
            </Text>
          </TouchableOpacity>
          {semu.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setTabType('semu');
                // focusOut();
              }}
              style={[styles.tabText, tabType === 'semu' && styles.selectedTab]}
            >
              <Text
                style={{
                  color: tabType === 'semu' ? '#1c90fb' : '#8c8c8c',
                  fontFamily:
                    tabType === 'semu' ? 'DOUZONEText50' : 'DOUZONEText30',
                  fontSize: 14
                }}
              >
                {t('renewal.create_room_semu')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {loaded ? (
          <Animated.FlatList
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={30}
            style={styles.roomNameContainer}
            data={
              tabType === 'group'
                ? group
                : tabType === 'personal'
                ? personal
                : semu
            }
            // ListEmptyComponent
            renderItem={({
              item: {
                profile,
                uri,
                first_char,
                room_title,
                receiver_user_count,
                group_room_profile_url: group_profile
              },
              item
            }) => {
              const profileList = group_profile?.filter(
                (item: string) => item !== ''
              );
              const profileUri = profileList?.map(
                (item: string) => item != '' && wehagoMainURL + item
              );
              const uriArrayLng = profileUri?.length;

              return (
                <TouchableOpacity
                  style={styles.roomNameRowTouch}
                  onPress={() => {
                    onClickStartButton(item);
                  }}
                >
                  <View
                    style={
                      !uriArrayLng
                        ? styles.personalThumbnailRow
                        : styles.groupThumbnailRow
                    }
                  >
                    {
                      profile ? (
                        <Image
                          source={{ uri: uri }}
                          resizeMode={'cover'}
                          style={styles.userImage}
                        />
                      ) : uriArrayLng === 0 ? (
                        <Image
                          source={icLock_W}
                          resizeMode={'cover'}
                          style={{
                            width: 24,
                            height: 24
                          }}
                        />
                      ) : uriArrayLng === 4 ? (
                        <FlatList
                          keyExtractor={(item, index) => index.toString()}
                          data={profileUri}
                          bounces={false}
                          numColumns={2}
                          renderItem={({ item }) => {
                            return (
                              <Image
                                source={{ uri: item }}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 10
                                }}
                              />
                            );
                          }}
                        />
                      ) : uriArrayLng === 3 ? (
                        <View>
                          <View
                            style={{ flex: 1, alignItems: 'center', zIndex: 2 }}
                          >
                            <Image
                              source={{ uri: profileUri[0] }}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10
                              }}
                            />
                          </View>
                          <View style={{ flexDirection: 'row' }}>
                            <Image
                              source={{ uri: profileUri[1] }}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                zIndex: 0
                              }}
                            />
                            <Image
                              source={{ uri: profileUri[2] }}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                zIndex: 1
                              }}
                            />
                          </View>
                        </View>
                      ) : uriArrayLng === 2 ? (
                        <View style={{ flex: 1 }}>
                          <View style={{ alignItems: 'flex-start' }}>
                            <Image
                              source={{ uri: profileUri[0] }}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12
                              }}
                            />
                          </View>
                          <View style={{ alignItems: 'flex-end', zIndex: 1 }}>
                            <Image
                              source={{ uri: profileUri[1] }}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 12
                              }}
                            />
                          </View>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: profileUri[0] }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20
                          }}
                        />
                      )

                      // <Text style={styles.roomFirstWord}>{first_char}</Text>
                    }
                  </View>
                  <View>
                    <Text
                      style={styles.roomTitleText}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {room_title}
                    </Text>
                  </View>

                  {tabType === 'group' && (
                    <View style={styles.roomCountContainer}>
                      <Image
                        source={icUserBlue}
                        style={{ width: 12, height: 12 }}
                        resizeMode={'cover'}
                      />
                      <Text style={styles.roomCountText}>
                        {receiver_user_count > 99 ? '99+' : receiver_user_count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={styles.indicatorContainer}>
            <ActivityIndicator
              // animating={!loaded}
              size={'large'}
              color={'#1c90fb'}
            />
          </View>
          // <Placeholder
          //   mainText={t('create_room_noneresult')}
          //   subText={t('create_room_nonetext')}
          // />
        )}
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: '#1c90fb'
  },
  indicatoer: {
    position: 'absolute',
    margin: '50%',
    zIndex: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  listContainer: {
    width: '100%',
    fontFamily: 'DOUZONEText30'
  },
  roomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    paddingHorizontal: isPad ? 30 : 20
  },
  textStyle: {
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 11,
    lineHeight: 14,
    color: 'rgb(140, 140, 140)',
    fontFamily: 'DOUZONEText30'
  },
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50
  },
  HeaderTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#00ff0000'
  },
  icBack: {
    width: 24,
    height: 24
  },
  icArrowDown: {
    width: 20,
    height: 20
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25
  },
  roomSectionRow: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderColor: 'rgba(0,0,0, 0.10)',
    backgroundColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  roomNameContainer: {
    overflow: 'hidden',
    paddingVertical: 3,
    paddingHorizontal: isPad ? 30 : 20
  },
  roomNameRowTouch: {
    height: 56,
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  groupThumbnailRow: {
    width: 40,
    height: 40,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  personalThumbnailRow: {
    backgroundColor: '#c1c1c1',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginRight: 10
  },
  roomTitleText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 15,
    letterSpacing: -0.3
  },
  roomCountContainer: {
    marginLeft: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgb(233,245,255)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roomCountText: {
    marginLeft: 2,
    fontFamily: 'DOUZONEText50',
    fontSize: 10,
    letterSpacing: -0.2,
    color: 'rgb(28,144,251)'
  },
  // roomFirstWord: {
  //   fontSize: 15,
  //   fontFamily: 'DOUZONEText50'
  // },
  // startButton: {
  //   width: 60,
  //   height: 30,
  //   borderRadius: 7,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: '#c1c1c1'
  // },
  // startText: {
  //   color: '#717171',
  //   fontSize: 12,
  //   fontFamily: 'DOUZONEText30'
  // },
  indicatorContainer: {
    flex: 1,
    zIndex: 100,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabText: {
    flex: 1,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedTab: {
    borderColor: '#1c90fb',
    borderBottomWidth: 2
  }
});

export default CreateScreenPresenter;
