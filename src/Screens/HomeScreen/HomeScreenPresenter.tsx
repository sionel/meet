/**
 * HomeScreenPresenter
 * 화상회의 히스토리 프레젠터
 */

import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  ScrollView,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  FlatList
} from 'react-native';

// import {
//   ListItemComp,
//   CustomAlert,
//   Placeholder,
//   SectionListHeader
// } from '../../components';
import AddButton from './AddButton';
import { getT } from '../../utils/translateManager';
import Card from './Component/ConferenceCard';
import Box from './Component/ConferenceBox';

// import { isWehagoV } from '../../utils';
// import { Text } from '../../components/StyledText';
const loginLogo = require('../../../assets/new/logos/logo.png');
const icSet = require('../../../assets/new/icons/ic_set.png');
const icCalendar = require('../../../assets/new/icons/ic_calendar.png');
const icVideo = require('../../../assets/new/icons/ic_video.png');
const icKeyboard = require('../../../assets/new/icons/ic_keyboard.png');

const HomeScreenPresenter = (props: any) => {
  const started = props.started;
  const reservation = props.reservation;
  const t = getT();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F7F8FA',
        justifyContent: 'flex-start',
        alignItems: 'center'
      }}
    >
      <StatusBar barStyle={'dark-content'} />
      {/* 헤더 */}
      <View
        style={{
          width: '100%',
          height: '6%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingHorizontal: 20
          // backgroundColor:"#a0a"
        }}
      >
        <Image
          source={loginLogo}
          style={{
            flex: 1,
            height: '100%'
            // backgroundColor:'#128'
          }}
          resizeMode={'contain'}
        />
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center'
          }}
        >
          <Image source={icSet} />
          <Text style={{ textAlign: 'right', marginRight: 5 }}>
            {'(주)더존비즈온'}
          </Text>
          <Image
            source={{
              uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
            }}
            style={{ width: 30, height: 30, borderRadius: 30, marginRight: 5 }}
          />
        </TouchableOpacity>
      </View>

      {/* 김더존님 ~~~ */}
      <View
        style={{
          width: '100%',
          height: '22%',
          paddingHorizontal: 20,
          // paddingTop: 30,
          // backgroundColor: '#930',
          justifyContent: 'space-between',
          alignItems: 'stretch'
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'flex-end'
            // backgroundColor:'#131'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}
          >
            {'김더존'}
          </Text>
          <Text
            style={{
              fontSize: 20
            }}
          >
            {'님, 좋은 아침입니다!'}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              backgroundColor: '#fff',
              borderColor: '#fff',
              width: 102,
              height: 90,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              padding: 5,
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOpacity: 1,
              shadowOffset: {
                width: 0,
                height: 8
              }
            }}
          >
            <Image
              source={icCalendar}
              style={{ width: 40, height: 40 }}
              resizeMode={'cover'}
            />
            <Text>{'회의생성'}</Text>
          </View>
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              backgroundColor: '#fff',
              borderColor: '#fff',
              width: 102,
              height: 90,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              padding: 5,
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOpacity: 1,
              shadowOffset: {
                width: 0,
                height: 8
              }
            }}
          >
            <Image
              source={icVideo}
              style={{ width: 40, height: 40 }}
              resizeMode={'cover'}
            />
            <Text>{'회의일정'}</Text>
          </View>
          <View
            style={{
              borderRadius: 12,
              borderWidth: 1,
              backgroundColor: '#fff',
              borderColor: '#fff',
              width: 102,
              height: 90,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              padding: 5,
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOpacity: 1,
              shadowOffset: {
                width: 0,
                height: 8
              }
            }}
          >
            <Image
              source={icKeyboard}
              style={{ width: 40, height: 40 }}
              resizeMode={'cover'}
            />
            <Text>{'참여코드'}</Text>
          </View>
        </View>
      </View>

      {/* 진행중인 화상회의 */}
      <View
        style={{
          width: '100%',
          height: '28%',
          paddingVertical: 10
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20
          }}
        >
          <Text
            style={{
              fontSize: 16
            }}
          >
            {'진행중인 화상회의'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10
            }}
          >
            {'15'}
          </Text>
        </View>
        <View style={{ flex: 3 }}>
          <FlatList
            horizontal={true}
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            renderItem={v => {
              return <Card index={v.index} />;
            }}
            windowSize={2}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>

      {/* 예약 회의  */}
      <View
        style={{
          width: '100%',
          flex: 1,
          paddingHorizontal: 20,
          marginTop: 10
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 16, paddingRight: 5 }}>{'예약회의'}</Text>
          <Text style={{ fontSize: 16 }}>{'10'}</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#aaa',
              height: '100%',
              marginHorizontal: 10
            }}
          />
          <Text style={{ fontSize: 16, paddingRight: 5 }}>{'회의기록'}</Text>
          <Text style={{ fontSize: 16, paddingRight: 20 }}>{'25'}</Text>
        </View>
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8]}
          renderItem={v => {
            return <Box></Box>;
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* {(props.started.length < 1 || started.length < 1) &&
      (props.reservation.length < 1 || reservation.length < 1) ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            props.memberType !== 1 && (
              <RefreshControl
                refreshing={props.refreshing}
                onRefresh={props.onRefresh}
              />
            )
          }
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#f1f2f5'
          }}
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
            flexGrow: 1
          }}
        >
          <Placeholder
            mainText={t('main_none')}
            subText={
              props.memberType === 1 || props.plan === 'WE'
                ? isWehagoV
                  ? t('main_wetext_V')
                  : t('main_wetext')
                : props.plan === 'SP'
                ? t('main_sptext')
                : t('main_start')
            }
          />
          <View style={{ flex: 1 }} />
        </ScrollView>
      ) : (
        <Fragment>
          <SectionList
            keyExtractor={(item, index) => index.toString()}
            refreshing={props.refreshing}
            onRefresh={props.onRefresh}
            style={[
              styles.listContainer,
              props.hasNotch && {
                paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
                paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
              }
            ]}
            sections={[
              {
                title: t('main_proceed'),
                data: started,
                length: started.length - 1
              },
              {
                title: t('main_scheduled'),
                data: reservation,
                length: reservation.length - 1
              }
            ]}
            renderSectionHeader={({ section }) =>
              section.data.length > 0 && (
                <SectionListHeader title={section.title} />
              )
            }
            renderItem={({ item, index, section }) => {
              return (
                <ListItemComp
                  key={item.room_id}
                  title={item.name}
                  personnel={item.receiver_user_count}
                  updated={item.start_date_time}
                  room_profile_url={''}
                  lottie={true}
                  underline={index < section.length ? true : false}
                  active={true}
                  disable={false}
                  onClick={() => {
                    props.setVideoId(item.room_id);
                    props.onRedirect('ConferenceState', {
                      item: {
                        roomId: item.room_id,
                        externalData: null,
                        from: 'meet'
                      }
                    });
                  }}
                />
              );
            }}
          />
        </Fragment>
      )}
      {props.memberType !== 1 &&
        props.permission &&
        props.plan !== 'WE' &&
        !isWehagoV && (
          <AddButton
            onClick={() =>
              props.onRedirect('Create', {
                onGetWetalkList: props.onGetWetalkList
              })
            }
          />
        )}

      <CustomAlert
        visible={props.alert.visible}
        title={props.alert.title}
        width={320}
        description={props.alert.message}
        actions={[
          {
            name: t('alert_button_confirm'),
            action: props.alert.onClose
          }
        ]}
        onClose={props.alert.onClose}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageContainer: {}

  // reloadButtonWrap: {
  //   marginTop: 10,
  //   borderWidth: 1,
  //   borderRadius: 18,
  //   borderColor: '#aaa'
  // },
  // reloadButton: {
  //   marginTop: 3,
  //   marginBottom: 3,
  //   marginLeft: 12,
  //   marginRight: 12,
  //   textAlign: ''
  // },

  // listContainer: {
  //   width: '100%'
  // },

  // notResult: {
  //   height: '10%',
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },

  // modalWrap: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0,0,0, .75)'
  // },

  // modalContentWrap: {
  //   backgroundColor: '#fff',
  //   width: '100%',
  //   maxWidth: 300,
  //   padding: 0,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5
  // },

  // modalMessage: {
  //   paddingTop: 20,
  //   paddingBottom: 30,
  //   paddingLeft: 20,
  //   paddingRight: 20
  // },

  // modalButtons: { flexDirection: 'row' },
  // modalButton: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingTop: 15,
  //   paddingBottom: 15,
  //   marginBottom: -1
  // },
  // modalButtonCancel: { backgroundColor: '#f1f1f1' },
  // modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default HomeScreenPresenter;
