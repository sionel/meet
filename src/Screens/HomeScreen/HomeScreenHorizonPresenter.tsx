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

import CalendarPicker from '../../custom_modules/react-native-calendar-picker';

// import {
//   ListItemComp,
//   CustomAlert,
//   Placeholder,
//   SectionListHeader
// } from '../../components';
import AddButton from './AddButton';
import { getT } from '../../utils/translateManager';
import ConferenceCard from './Component/ConferenceCard';
import FinishedCard from './Component/FinishedCard';
import ReservationCard from './Component/ReservationCard';
import BottomPopup from './Component/BottomPopup';
import ParticipantsList from '../../components/renewal/ParticipantsList';
import { presenterProps } from './HomeScreenPresenter';
// import { Text } from '../../components/StyledText';
const loginLogo = require('../../../assets/new/logos/logo.png');
const icSet = require('../../../assets/new/icons/ic_set.png');
const icCalendar = require('../../../assets/new/icons/ic_calendar.png');
const icVideo = require('../../../assets/new/icons/ic_video.png');
const icKeyboard = require('../../../assets/new/icons/ic_keyboard.png');
const icArrowDownBlack = require('../../../assets/new/icons/ic_arrow_down_black.png');
const icChange = require('../../../assets/new/icons/ic_change.png');
const icCancel = require('../../../assets/new/icons/ic_cancel.png');

{
  /*
 <TouchableOpacity
   style={{
     position: 'absolute',
     width: 100,
     height: 100,
     top: 250,
     backgroundColor: '#1322fa',
     zIndex: 9
   }}
   onPress={setTest}
 />
 */
}

const HomeScreenPresenter = (props: presenterProps) => {
  const {
    isTablet,
    userName,
    ongoingConference,
    reservationConference,
    finishedConference,
    highlight,
    setHighlight,
    onClickSetting,
    companyName,
    userImg,
    createConference,
    enterInviteCode,
    bottomPopup,
    participantsList,
    isHorizon,
    onConpanyChange,
    onChangeMonth,
    calendarView,
    setCalendarView,
    finishDate,
    onEndReached,
    finishCount
  } = props;
  const t = getT();
  return (
    <Fragment>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F7F8FA'} />
      <SafeAreaView style={{ flex: 0, backgroundColor: '#F7F8FA' }} />
      <View style={styles.safeContainer}>
        {participantsList.show && (
          <ParticipantsList {...participantsList} isHorizon={isHorizon} />
        )}
        <View
          style={{
            width: 250,
            paddingHorizontal: 30,
            borderRightWidth: 2,
            borderRightColor: '#E6E6E6'
          }}
        >
          <Image
            source={loginLogo}
            resizeMode={'contain'}
            style={{
              marginTop: 30,
              width: '100%'
            }}
          />
          <View
            style={{
              marginTop: 30,
              width: '100%',
              height: 40,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Image
              source={{ uri: userImg }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: 5,
                backgroundColor: '#939393'
              }}
              resizeMode={'contain'}
            />
            <Text style={styles.name}>{userName}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.setting} onPress={onClickSetting}>
              <Image source={icSet} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.selectConpany}
            onPress={onConpanyChange}
          >
            <Text style={styles.companyText}>{companyName}</Text>
            <Image
              source={icArrowDownBlack}
              style={styles.downArrow}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity
              style={styles.topButtons}
              onPress={createConference}
            >
              <Image
                source={icVideo}
                style={styles.topButtonImg}
                resizeMode={'cover'}
              />
              <Text>{'회의생성'}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.topButtons}
              onPress={createConference}
            >
              <Image
                source={icCalendar}
                style={styles.topButtonImg}
                resizeMode={'cover'}
              />
              <Text>{'회의일정'}</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.topButtons}
              onPress={enterInviteCode}
            >
              <Image
                source={icKeyboard}
                style={styles.topButtonImg}
                resizeMode={'cover'}
              />
              <Text>{'참여코드'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, paddingVertical: 50 }}>
          {/* 진행중인 화상회의 */}
          {ongoingConference.length > 0 && (
            <View
              style={[
                styles.ongoingContainer,
                ,
                { paddingHorizontal: isTablet ? 40 : 20 }
              ]}
            >
              <View style={styles.goingTextContainer}>
                <Text style={styles.goingText}>{'진행중인 화상회의'}</Text>
                <Text
                  style={[
                    styles.goingText,
                    {
                      color: '#1c90fb'
                    }
                  ]}
                >
                  {ongoingConference.length}
                </Text>
              </View>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                data={ongoingConference}
                renderItem={conference => {
                  return (
                    <ConferenceCard
                      index={conference.index}
                      conference={conference.item}
                    />
                  );
                }}
                windowSize={2}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          <View
            style={{
              width: '100%',
              flex: 1,
              marginVertical: '2%',
              paddingHorizontal: isTablet ? 40 : 20
              // backgroundColor: 'red'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10
              }}
            >
              {reservationConference.length > 0 && (
                <Fragment>
                  <TouchableOpacity
                    style={{ flexDirection: 'row' }}
                    onPress={() => {
                      setHighlight('reservation');
                    }}
                  >
                    <Text
                      style={[
                        { color: '#939393', fontSize: 16, paddingRight: 5 },
                        highlight === 'reservation' && {
                          fontWeight: 'bold',
                          color: '#000'
                        }
                      ]}
                    >
                      {'예약회의'}
                    </Text>
                    <Text
                      style={[
                        { color: '#939393', fontSize: 16 },
                        highlight === 'reservation' && {
                          fontWeight: 'bold',
                          color: '#1c90fb'
                        }
                      ]}
                    >
                      {reservationConference.length}
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#aaa',
                      height: '100%',
                      marginHorizontal: 10
                    }}
                  />
                </Fragment>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1
                }}
              >
                <TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    setHighlight('finished');
                  }}
                >
                  <Text
                    style={[
                      { color: '#939393', fontSize: 16, paddingRight: 5 },

                      highlight === 'finished' && {
                        fontWeight: 'bold',
                        color: '#000'
                      }
                    ]}
                  >
                    {'회의기록'}
                  </Text>
                  <Text
                    style={[
                      {
                        color: '#939393',
                        fontSize: 16,
                        paddingRight: 20
                      },
                      highlight === 'finished' && {
                        fontWeight: 'bold',
                        color: '#1c90fb'
                      }
                    ]}
                  >
                    {finishCount}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCalendarView(true)}
                  style={{
                    height: '100%',
                    borderColor: '#939393',
                    borderWidth: 1,
                    padding: 5,
                    borderRadius: 10
                  }}
                >
                  <Text>{`${finishDate.getMonth() + 1}월`}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              numColumns={isTablet ? 2 : 1}
              keyExtractor={(item, index) => index.toString()}
              data={
                highlight === 'reservation'
                  ? reservationConference
                  : finishedConference
              }
              renderItem={data => {
                const { item } = data;

                return highlight === 'reservation' ? (
                  <ReservationCard {...item} isTablet={isTablet} />
                ) : (
                  <FinishedCard {...item} isTablet={isTablet} />
                );
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={onEndReached}
              onEndReachedThreshold={1}
              {...(isTablet && {
                columnWrapperStyle: { justifyContent: 'space-between' }
              })}
            />
          </View>
        </View>

        {bottomPopup.show && (
          <BottomPopup {...bottomPopup} isHorizon={isHorizon} />
        )}
      </View>
      {calendarView && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgb(255,255,255)',
            bottom: 0,
            width: '100%',
            height: '100%',
            borderRadius: 20,
            shadowRadius: 10,
            shadowColor: '#aaa',
            shadowOpacity: 10,
            borderWidth: 1,
            paddingBottom: '5%'
          }}
        >
          <View style={{ flex: 1, backgroundColor: '#666', zIndex: 2 }}></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '5%',
              marginBottom: '3%',
              paddingHorizontal: '4%'
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setCalendarView(false);
              }}
            >
              <Image
                source={icCancel}
                style={{
                  resizeMode: 'cover',
                  width: 18,
                  height: 18
                }}
              />
            </TouchableOpacity>
          </View>
          <CalendarPicker
            weekdays={['일', '월', '화', '수', '목', '금', '토']}
            months={[
              '1월',
              '2월',
              '3월',
              '4월',
              '5월',
              '6월',
              '7월',
              '8월',
              '9월',
              '10월',
              '11월',
              '12월'
            ]}
            previousTitle="<"
            nextTitle=">"
            minDate={new Date('2020-01-01')}
            // selectedStartDate={startTime.current}
            selectedDayTextColor="#fff"
            selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
            todayBackgroundColor="#febc2c"
            dayShape="square"
            onMonthChange={onChangeMonth}
            selectYearTitle={t('년도 선택')}
            selectMonthTitle={t('년')}
            textStyle={{ fontSize: isTablet ? 18 : 14 }}
            disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
            calendarMode={'months'}
          />
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'flex-start',
    flexDirection: 'row'
    // alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20
  },
  logo: {
    width: 200
  },
  setting: {
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  companyText: { fontSize: 15, textAlign: 'right' },
  selectConpany: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40
  },
  settingImg: { width: 30, height: 30, borderRadius: 24, marginRight: 10 },
  downArrow: { width: 30, height: 30, borderRadius: 24 },
  helloContainer: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  helloTextContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20
    // marginVertical: '1%',
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    marginRight: 10,
    textAlign: 'center'
  },
  greeting: {
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#583',
    paddingBottom: 20
  },
  topButtons: {
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#fff',
    width: '100%',
    height: 100,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
    shadowColor: 'rgb(0,0,0)',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 8
    },
    marginVertical: 20
  },
  topButtonImg: { width: 40, height: 40 },
  ongoingContainer: {
    width: '100%',
    // height: '28%',
    paddingVertical: 20,
    paddingHorizontal: 40
  },
  goingTextContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20
  },
  goingText: { fontSize: 16, fontWeight: 'bold', marginRight: 5 }
  // container: {
  //   flex: 1,
  //   backgroundColor: '#F7F8FA',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center'
  // },
  // imageContainer: {}

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

{
  /* {(props.started.length < 1 || started.length < 1) &&
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
       /> */
}
