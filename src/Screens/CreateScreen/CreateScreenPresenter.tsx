import React, { Dispatch, Fragment, SetStateAction } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  Animated,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
  Platform
} from 'react-native';

import {
  ListItemComp,
  SearchForm,
  Placeholder,
  CustomAlert
} from '@components/index';
import { getT } from '@utils/translateManager';

import {
  ic_back as icBack,
  ic_cancel as icCancel,
  ic_search as icSearch,
  ic_cancel2 as icCancel2
} from '@assets/index';

import btnArrowDown from '@oldassets/buttons/btnArrowDown.png';
import { useTranslation } from 'react-i18next';

export interface section {
  title: string;
  data: any[];
  type: 'personal' | 'group' | 'semu';
  collapse: boolean;
  height: Animated.Value;
  zIndex?: number;
}

interface createProps {
  // onSearch: (key: string) => void;
  onEditingSearching: () => void;
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
    onEditingSearching,
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
  const a = new Animated.Value(100);
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
        <View
          style={{
            height: 52,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f7f8fa',
            paddingHorizontal: 20,
            paddingVertical: 6
          }}
        >
          <View style={styles.search}>
            <TextInput
              style={styles.input}
              returnKeyType="search"
              value={keyword}
              onChangeText={setKeyword}
              onSubmitEditing={() => {
                onEditingSearching();
              }}
              placeholder={t('대화방 명을 검색하세요.')}
              placeholderTextColor={'rgb(147,147,147)'}
              // ref={searchRef}
            />
            {keyword ? (
              <TouchableOpacity onPress={() => setKeyword('')}>
                <View style={styles.cancelIcon}>
                  <Image source={icCancel} style={styles.icCancel} />
                </View>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity onPress={onEditingSearching}>
              <View style={styles.searchIcon}>
                <Image
                  source={icSearch}
                  resizeMode={'cover'}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            borderColor: '#e6e6e6',
            borderBottomWidth: 1,
            paddingHorizontal: 20,
          }}
        >
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
            style={[styles.roomNameContainer]}
            data={
              tabType === 'group'
                ? group
                : tabType === 'personal'
                ? personal
                : semu
            }
            renderItem={({
              item: { profile, uri, first_char, room_title },
              item
            }) => {
              return (
                <TouchableOpacity
                  style={styles.roomNameRowTouch}
                  onPress={() => {
                    onClickStartButton(item);
                  }}
                >
                  <View style={styles.roomNameRow}>
                    {profile ? (
                      <Image
                        source={{ uri: uri }}
                        resizeMode={'cover'}
                        style={styles.userImage}
                      />
                    ) : (
                      <Text style={styles.roomFirstWord}>{first_char}</Text>
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'DOUZONEText30' }}>
                      {room_title}
                    </Text>
                  </View>
                  {/* <View style={styles.startButton}>
                    <Text style={styles.startText}>
                      {t('create_room_start')}
                    </Text>
                  </View> */}
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          //   <SectionList
          //   refreshing={false}
          //   onRefresh={onRefresh}
          //   keyExtractor={(item, index) => index.toString()}
          //   sections={[group, personal, semu, suim]}
          //   renderSectionHeader={({ section }) => (
          //     <TouchableOpacity
          //       activeOpacity={1}
          //       onPress={() => {
          //         onClickHeader(section);
          //       }}
          //       style={[
          //         styles.roomSectionRow,
          //         { display: section.data.length > 0 ? 'flex' : 'none' }
          //       ]}
          //     >
          //       <Text style={styles.textStyle}>{section.title}</Text>
          //       <TouchableOpacity>
          //         <Image source={btnArrowDown} style={styles.icArrowDown} />
          //       </TouchableOpacity>
          //     </TouchableOpacity>
          //   )}
          //   renderSectionFooter={({ section: { data, height } }) => {
          //     return (
          //       <Animated.FlatList
          //         keyExtractor={(item, index) => index.toString()}
          //         initialNumToRender={30}
          //         style={[styles.roomNameContainer, { height }]}
          //         data={data}
          //         renderItem={({
          //           item: { profile, uri, first_char, room_title },
          //           item
          //         }) => {
          //           return (
          //             <TouchableOpacity
          //               style={styles.roomNameRowTouch}
          //               onPress={() => {
          //                 onClickStartButton(item);
          //               }}
          //             >
          //               <View style={styles.roomNameRow}>
          //                 {profile ? (
          //                   <Image
          //                     source={{ uri: uri }}
          //                     resizeMode={'cover'}
          //                     style={styles.userImage}
          //                   />
          //                 ) : (
          //                   <Text style={styles.roomFirstWord}>
          //                     {first_char}
          //                   </Text>
          //                 )}
          //               </View>
          //               <View style={{ flex: 1 }}>
          //                 <Text style={{ fontFamily: 'DOUZONEText30' }}>
          //                   {room_title}
          //                 </Text>
          //               </View>
          //               <View style={styles.startButton}>
          //                 <Text style={styles.startText}>
          //                   {t('create_room_start')}
          //                 </Text>
          //               </View>
          //             </TouchableOpacity>
          //           );
          //         }}
          //       />
          //     );
          //   }}
          //   renderItem={() => <Fragment />}
          // />
          <Placeholder
            mainText={t('create_room_noneresult')}
            subText={t('create_room_nonetext')}
          />
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
    flex: 0,
    backgroundColor: '#fff'
  },
  header: {
    width: '100%',
    height: '6%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '#1c90fb'
  },
  listContainer: {
    width: '100%',
    fontFamily: 'DOUZONEText30'
  },
  sectionHeader: {
    paddingTop: 3,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 3,
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgba(0,0,0, 0.10)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
    paddingHorizontal: 12
  },
  roomNameRowTouch: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  roomNameRow: {
    backgroundColor: '#c1c1c1',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginVertical: 5,
    marginRight: 15
  },
  roomFirstWord: {
    fontSize: 15,
    fontFamily: 'DOUZONEText50'
  },
  startButton: {
    width: 60,
    height: 30,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c1c1c1'
  },
  startText: {
    color: '#717171',
    fontSize: 12,
    fontFamily: 'DOUZONEText30'
  },
  search: {
    height: 40,
    backgroundColor: 'rgb(250,250,250)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? 30 : 50,
    paddingLeft: 15
  },
  cancelIcon: {
    backgroundColor: '#1c90fb',
    width: 18,
    height: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  icCancel: {
    resizeMode: 'cover',
    width: 14,
    height: 14
  },
  searchIcon: {
    // paddingTop: 2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabText: {
    flex: 1,
    // width: 111,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
    // borderColor: '#e6e6e6',
    // borderBottomWidth: 1
  },
  selectedTab: {
    borderColor: '#1c90fb',
    borderBottomWidth: 2
  }
});

export default CreateScreenPresenter;
