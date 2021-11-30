import React, { Fragment } from 'react';
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
  ActivityIndicator
} from 'react-native';

import {
  ListItemComp,
  SearchForm,
  Placeholder,
  CustomAlert,
  SectionListHeader
} from '../../components';
import { getT } from '../../utils/translateManager';

import icBack from '../../../assets/new/icons/ic_back_w.png';
import btnArrowDown from '../../../assets/buttons/btnArrowDown.png';

export interface section {
  title: string;
  data: any[];
  type: 'personal' | 'group' | 'semu' | 'suim' | '';
  collapse: boolean;
  height: Animated.Value;
  zIndex?: number;
}

interface createProps {
  onSearch: (key: string) => void;
  group: section;
  personal: section;
  semu: section;
  suim: section;
  loaded: boolean;
  indicatorFlag: boolean;
  onRefresh: () => void;
  onClickBack: () => void;
  onClickHeader: (section: section) => void;
  onClickStartButton: (conference: any) => void;
}

function CreateScreenPresenter(props: createProps) {
  const {
    indicatorFlag,
    onSearch,
    loaded,
    onRefresh,
    group,
    personal,
    semu,
    suim,
    onClickBack,
    onClickHeader,
    onClickStartButton
  } = props;
  const a = new Animated.Value(100);
  const t = getT();

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea} />
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          animating={indicatorFlag}
          size={'large'}
          color={'#1c90fb'}
          style={{ position: 'absolute', margin: '50%', zIndex: 10 }}
        />
        <View style={styles.header}>
          <TouchableOpacity style={{ width: '10%' }} onPress={onClickBack}>
            <Image
              source={icBack}
              resizeMode={'contain'}
              style={{ width: '90%' }}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              color: '#fff',
              fontSize: 18,
              marginHorizontal: 12,
              fontFamily: 'DOUZONEText50',
              textAlign: 'center'
            }}
          >
            {'화상회의 생성하기'}
          </Text>
          <View style={{ width: '10%' }} />
        </View>
        <SearchForm onChange={onSearch} />
        {loaded ? (
          <SectionList
            refreshing={false}
            onRefresh={onRefresh}
            keyExtractor={(item, index) => index.toString()}
            sections={[group, personal, semu, suim]}
            renderSectionHeader={({ section }) => (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  onClickHeader(section);
                }}
                style={{
                  flex: 1,
                  display: section.data.length > 0 ? 'flex' : 'none',
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  borderColor: 'rgba(0,0,0, 0.10)',
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text style={styles.textStyle}>{section.title}</Text>
                <TouchableOpacity>
                  <Image
                    source={btnArrowDown}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            renderSectionFooter={({ section: { data, height } }) => {
              return (
                <Animated.FlatList
                  keyExtractor={(item, index) => index.toString()}
                  initialNumToRender={30}
                  style={{
                    height,
                    overflow: 'hidden',
                    paddingVertical: 3,
                    paddingHorizontal: 12
                  }}
                  data={data}
                  renderItem={({
                    item: { profile, uri, first_char, room_title },
                    item
                  }) => {
                    return (
                      <TouchableOpacity
                        style={{
                          height: 50,
                          justifyContent: 'center',
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                        onPress={() => {
                          onClickStartButton(item);
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: '#c1c1c1',
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 25,
                            marginVertical: 5,
                            marginRight: 15
                          }}
                        >
                          {profile ? (
                            <Image
                              source={{ uri: uri }}
                              resizeMode={'cover'}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 25
                              }}
                            />
                          ) : (
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: 'DOUZONEText50'
                              }}
                            >
                              {first_char}
                            </Text>
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text>{room_title}</Text>
                        </View>
                        <View
                          style={{
                            width: 60,
                            height: 30,
                            borderRadius: 7,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#c1c1c1'
                          }}
                        >
                          <Text
                            style={{
                              color: '#717171',
                              fontSize: 12,
                              fontFamily: 'DOUZONEText30'
                            }}
                          >
                            {t('create_room_start')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              );
            }}
            renderItem={() => <Fragment />}
          />
        ) : (
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
  safeArea: { flex: 0, backgroundColor: '#1c90fb' },
  container: { flex: 1, backgroundColor: '#fff' },
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
  }
});

export default CreateScreenPresenter;

// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   SectionList,
//   Animated
// } from 'react-native';
// import {
//   ListItemComp,
//   SearchForm,
//   Placeholder,
//   CustomAlert,
//   SectionListHeader
// } from '../../components';

// import { getT } from '../../utils/translateManager';

// const CreateScreenPresenter = props => {
//   const personalList = props.list.filter(
//     item => item.room_type === '1' && item.is_video_access === 'F'
//   );
//   const groupList = props.list.filter(
//     item => item.room_type === '2' && item.is_video_access === 'F'
//   );
//   const semuList = props.list.filter(
//     item => item.room_type === '4' && item.is_video_access === 'F'
//   );
//   const suimList = props.list.filter(
//     item =>
//       item.room_type === '5' &&
//       item.is_video_access === 'F' &&
//       !item.unpaid_status
//   );

//   const t = getT();
//   const personalHeight = new Animated.Value(54 * personalList.length);
//   const groupHeight = new Animated.Value(54 * groupList.length);
//   const semuHeight = new Animated.Value(54 * semuList.length);
//   const suimHeight = new Animated.Value(54 * suimList.length);
//   const SectionFooter = ({ section }) => {
//     const items = section.data.map((item, index) => (
//       <ListItemComp
//         key={item.room_id}
//         title={item.room_title}
//         personnel={item.receiver_user_count}
//         updated={item.update_timestamp}
//         room_profile_url={item.room_profile_url}
//         lottie={false}
//         customLottie={true}
//         underline={index < section.length ? true : false}
//         active={item.is_video_access === 'T' ? true : false}
//         disable={
//           item.receiver_user_count === 1 && item.room_type === '1'
//             ? true
//             : false
//         }
//         onClick={() => props.onActivateModal(item.room_id, item.room_title)}
//       />
//     ));

//     return (
//       <Animated.View
//         style={{
//           overflow: 'hidden',
//           height:
//             section.type === 'group'
//               ? groupHeight
//               : section.type === 'personal'
//               ? personalHeight
//               : section.type === 'semu'
//               ? semuHeight
//               : suimHeight,
//           justifyContent: 'flex-start'
//         }}
//       >
//         {items}
//       </Animated.View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* 검색바 */}
//       <SearchForm onChange={props.onSearch} />

//       {props.list.length < 1 ? (
//         <ScrollView
//           refreshControl={
//             <RefreshControl refreshing={false} onRefresh={props.onRefresh} />
//           }
//         >
//           <Placeholder
//             mainText={t('create_room_noneresult')}
//             subText={t('create_room_nonetext')}
//           />
//         </ScrollView>
//       ) : (
//         <SectionList
//           keyExtractor={(item, index) => index.toString()}
//           refreshing={false}
//           onRefresh={props.onRefresh}
//           style={[
//             styles.listContainer,
//             props.hasNotch && {
//               paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
//               paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
//             }
//           ]}
//           sections={[
//             {
//               title: `${t('create_room_group')}(${groupList.length})`,
//               data: groupList,
//               length: groupList.length - 1,
//               type: 'group'
//             },
//             {
//               title: `${t('create_room_oneonone')}(${personalList.length})`,
//               data: personalList,
//               length: personalList.length - 1,
//               type: 'personal'
//             },
//             {
//               title: `${t('create_room_semu')}(${semuList.length})`,
//               data: semuList,
//               length: semuList.length - 1,
//               type: 'semu'
//             },
//             {
//               title: `${t('create_room_suim')}(${suimList.length})`,
//               data: suimList,
//               length: suimList.length - 1,
//               type: 'suim'
//             }
//           ]}
//           renderSectionHeader={({ section }) =>
//             section.data.length > 0 && (
//               <SectionListHeader
//                 title={section.title}
//                 section={section}
//                 collapse={true}
//                 onPress={() => {
//                   section.type === 'group'
//                     ? Animated.timing(groupHeight, {
//                         toValue:
//                           groupHeight._value === 0
//                             ? 54 * section.data.length
//                             : 0,
//                         duration: 400
//                       }).start()
//                     : section.type === 'personal'
//                     ? Animated.timing(personalHeight, {
//                         toValue:
//                           personalHeight._value === 0
//                             ? 54 * section.data.length
//                             : 0,
//                         duration: 400
//                       }).start()
//                     : section.type === 'semu'
//                     ? Animated.timing(semuHeight, {
//                         toValue:
//                           semuHeight._value === 0
//                             ? 54 * section.data.length
//                             : 0,
//                         duration: 400
//                       }).start()
//                     : Animated.timing(suimHeight, {
//                         toValue:
//                           suimHeight._value === 0
//                             ? 54 * section.data.length
//                             : 0,
//                         duration: 400
//                       }).start();
//                 }}
//               />
//             )
//           }
//           renderSectionFooter={SectionFooter}
//           renderItem={({ item, index, section }) => null}
//         />
//       )}

//       <CustomAlert
//         visible={props.modal}
//         title={t('alert_title_create')}
//         width={320}
//         description={t('alert_text_createroom')}
//         actions={[
//           {
//             name: t('alert_button_cancel'),
//             action: () => props.onActivateModal(null)
//           },
//           {
//             name: t('alert_button_confirm'),
//             action: () => props.onCreateConference()
//           }
//         ]}
//         onClose={() => props.onActivateModal(null)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },

//   listContainer: {
//     width: '100%',
//     fontFamily: 'DOUZONEText30'
//   },

//   notResult: {
//     height: '10%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },

//   modalWrap: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0, .75)'
//   },

//   modalContentWrap: {
//     backgroundColor: '#fff',
//     width: '100%',
//     maxWidth: 300,
//     padding: 0,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5
//   },

//   modalMessage: {
//     paddingTop: 20,
//     paddingBottom: 30,
//     paddingLeft: 20,
//     paddingRight: 20
//   },

//   modalButtons: { flexDirection: 'row' },
//   modalButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 15,
//     paddingBottom: 15,
//     marginBottom: -1
//   },
//   modalButtonCancel: { backgroundColor: '#f1f1f1' },
//   modalButtonConfirm: { backgroundColor: '#1C90FB' }
// });

// export default CreateScreenPresenter;
