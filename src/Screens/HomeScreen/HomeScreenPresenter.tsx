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
import BottomPopup, { content } from './Component/BottomPopup';
import ParticipantsList, {
  participantsListProps
} from '../../components/renewal/ParticipantsList';
// import ParticipantBox from '../ConferenceScreen/Content/BottomArea/SubVideoBox/ParticipantBox';

// import { isWehagoV } from '../../utils';
// import { Text } from '../../components/StyledText';
const loginLogo = require('../../../assets/new/logos/logo.png');
const icSet = require('../../../assets/new/icons/ic_set.png');
const icCalendar = require('../../../assets/new/icons/ic_calendar.png');
const icVideo = require('../../../assets/new/icons/ic_video.png');
const icKeyboard = require('../../../assets/new/icons/ic_keyboard.png');
const icArrowDownBlack = require('../../../assets/new/icons/ic_arrow_down_black.png');
const icChange = require('../../../assets/new/icons/ic_change.png');
const icEmptyConference = require('../../../assets/new/icons/ic_empty_conference.png');
const icEmpty = require('../../../assets/new/icons/ic_empty.png');
const icChat = require('../../../assets/new/icons/ic_chat_w.png');
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

export interface presenterProps {
  isTablet: boolean;
  userName: string;
  ongoingConference: any[];
  reservationConference: any[];
  finishedConference: any[];
  highlight: 'reservation' | 'finished' | null;
  setHighlight: (type: 'reservation' | 'finished') => void;
  onClickSetting: () => void;
  companyName: string;
  userImg: string | undefined;
  createConference: () => void;
  enterInviteCode: () => void;
  bottomPopup: {
    show: boolean;
    contentList: content[];
    title: string;
    onClickOutside: () => void;
  };
  participantsList: participantsListProps & { show: boolean };
  isHorizon: boolean;
  onConpanyChange: () => void;
  onChangeMonth: (date: any) => void;
  calendarView: boolean;
  setCalendarView: (flag: boolean) => void;
  finishDate: Date;
  onEndReached: () => void;
  finishCount: number;
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
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: bottomPopup.show ? 'rgba(0,0,0,0.5)' : '#F7F8FA'
        }}
      />
   
      <View style={styles.safeContainer}>
        <View
          style={[styles.header, { paddingHorizontal: isTablet ? 40 : 20 }]}
        >
          <Image
            source={loginLogo}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.setting} onPress={onClickSetting}>
            <Image source={icSet} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>

        {/* 프로필, 이름 , 회사*/}
        <View
          style={[
            styles.helloContainer,
            { paddingHorizontal: isTablet ? 40 : 20 }
          ]}
        >
          <View style={styles.helloTextContainer}>
            <Image source={{ uri: userImg }} style={styles.settingImg} />
            <Text style={styles.name}>{userName}</Text>
            <TouchableOpacity
              style={styles.selectConpany}
              onPress={onConpanyChange}
            >
              <Text style={styles.companyText}>{companyName}</Text>
              <Image
                source={icArrowDownBlack}
                style={styles.downArrow}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.topButtons}
              onPress={createConference}
            >
              <Image
                source={icVideo}
                style={styles.topButtonImg}
                resizeMode={'cover'}
              />
              <Text style={styles.ImageText}>
                {t('renewal.main_create_conference')}
              </Text>
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
              <Text style={styles.ImageText}>
                {t('renewal.main_participation_code')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 진행중인 화상회의 */}
        {ongoingConference.length > 0 && (
          <View style={styles.ongoingContainer}>
            <View
              style={[
                styles.goingTextContainer,
                { paddingHorizontal: isTablet ? 40 : 20 }
              ]}
            >
              <Text style={styles.goingText}>
                {t('renewal.main_going_conference')}
              </Text>
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
                    isHorizon={isHorizon}
                  />
                );
              }}
              windowSize={2}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View
          style={[
            styles.ConferenceListContainer,
            { paddingHorizontal: isTablet ? 40 : 20 }
          ]}
        >
          <View style={styles.ConferenceListTitle}>
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
                      styles.UnFocusText,
                      highlight === 'reservation' && styles.FocusText
                    ]}
                  >
                    {t('renewal.main_reservation_conference')}
                  </Text>
                  <Text
                    style={[
                      styles.unFocusReCount,
                      highlight === 'reservation' && styles.FocusReCount
                    ]}
                  >
                    {reservationConference.length}
                  </Text>
                </TouchableOpacity>
                <View style={styles.GraySplitBar} />
              </Fragment>
            )}
            <View style={styles.FinishedCotainer}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  setHighlight('finished');
                }}
              >
                <Text
                  style={[
                    styles.UnFocusText,
                    highlight === 'finished' && styles.FocusText
                  ]}
                >
                  {t('renewal.main_conference_record')}
                </Text>
                <Text
                  style={[
                    styles.unFocusFinCount,
                    highlight === 'finished' && styles.FocusFinCount
                  ]}
                >
                  {finishCount}
                </Text>
              </TouchableOpacity>
              {highlight === 'finished' && (
                <TouchableOpacity
                  onPress={() => setCalendarView(true)}
                  style={styles.monthTouchContainer}
                >
                  <Text style={styles.selectedMonth}>{`${
                    finishDate.getMonth() + 1
                  }${t('renewal.common_month')}`}</Text>
                </TouchableOpacity>
              )}
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

        {bottomPopup.show && (
          <BottomPopup {...bottomPopup} isHorizon={isHorizon} />
        )}
      </View>
      {participantsList.show && (
        <ParticipantsList {...participantsList} isHorizon={isHorizon} />
      )}

      {calendarView && (
        <View style={styles.calendarView}>
          <View style={{ flex: 1, backgroundColor: '#666', zIndex: 2 }}></View>
          <View style={styles.calendarTopView}>
            <TouchableOpacity
              style={styles.icCancel}
              onPress={() => {
                setCalendarView(false);
              }}
            >
              <Image
                source={icCancel}
                resizeMode="cover"
                style={styles.icCancel}
              />
            </TouchableOpacity>
          </View>
          <CalendarPicker
            weekdays={[
              t('renewal.calendar_sun'),
              t('renewal.calendar_mon'),
              t('renewal.calendar_tue'),
              t('renewal.calendar_wed'),
              t('renewal.calendar_thur'),
              t('renewal.calendar_fri'),
              t('renewal.calendar_sat')
            ]}
            months={[
              t('renewal.calendar_jan'),
              t('renewal.calendar_feb'),
              t('renewal.calendar_mar'),
              t('renewal.calendar_apr'),
              t('renewal.calendar_may'),
              t('renewal.calendar_jun'),
              t('renewal.calendar_jul'),
              t('renewal.calendar_aug'),
              t('renewal.calendar_sep'),
              t('renewal.calendar_oct'),
              t('renewal.calendar_nov'),
              t('renewal.calendar_dec')
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
            selectYearTitle={t('renewal.main_select_year')}
            selectMonthTitle={t('renewal.common_year')}
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
    elevation: 1
    // alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0
  },
  logo: {
    width: 180
  },
  setting: {
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  companyText: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'DOUZONEText30',
    color: '#333'
  },
  selectConpany: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center'
  },
  settingImg: { width: 30, height: 30, borderRadius: 24, marginRight: 10 },
  downArrow: { width: 25, height: 25 },
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
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
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
    width: '45%',
    height: 100,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5,
    shadowColor: 'rgb(0,0,0)',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 8
    }
  },
  topButtonImg: { width: 40, height: 40 },
  ongoingContainer: {
    width: '100%',
    // height: '28%',
    paddingVertical: 20
  },
  goingTextContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20
  },
  goingText: {
    fontSize: 16,
    fontFamily: 'DOUZONEText30',
    marginRight: 5
  },
  calendarTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginBottom: '3%',
    paddingHorizontal: '4%'
  },
  calendarView: {
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
  },
  monthTouchContainer: {
    height: '100%',
    borderColor: '#939393',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10
  },
  icCancel: {
    width: 18,
    height: 18
  },
  UnFocusText: {
    color: '#939393',
    fontSize: 14,
    fontFamily: 'DOUZONEText30',
    paddingRight: 5
  },
  FocusText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'DOUZONEText50'
  },
  unFocusReCount: {
    color: '#939393',
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  FocusReCount: {
    color: '#1c90fb',
    fontSize: 14,
    fontFamily: 'DOUZONEText50'
  },
  unFocusFinCount: {
    color: '#939393',
    fontSize: 14,
    fontFamily: 'DOUZONEText30',
    paddingRight: 20
  },
  FocusFinCount: {
    color: '#1c90fb',
    fontSize: 14,
    fontFamily: 'DOUZONEText50'
  },
  FinishedCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  GraySplitBar: {
    borderWidth: 1,
    borderColor: '#aaa',
    height: '100%',
    marginHorizontal: 10
  },
  ConferenceListContainer: {
    width: '100%',
    flex: 1,
    marginVertical: '2%'
    // backgroundColor: 'red'
  },
  ConferenceListTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  ImageText: {
    fontSize: 13,
    fontFamily: 'DOUZONEText30',
    color: '#333'
  },
  selectedMonth: {
    fontFamily: 'DOUZONEText30',
    fontSize: 11,
    color: '#333'
  }
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
