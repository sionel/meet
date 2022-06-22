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
// } from '@components';
import AddButton from './AddButton';
import { getT } from '@utils/translateManager';
import ConferenceCard from './Component/ConferenceCard';
import FinishedCard from './Component/FinishedCard';
import ReservationCard from './Component/ReservationCard';
import BottomPopup from './Component/BottomPopup';
import ParticipantsList from '@components/renewal/ParticipantsList';
import { presenterProps } from './HomeScreenPresenter';
import DatePicker from 'react-native-date-picker';


const loginLogo = require('@assets/logos/logo.png');
const icSet = require('@assets/icons/ic_set.png');
const icCalendar = require('@assets/icons/ic_calendar.png');
const icVideo = require('@assets/icons/ic_video.png');
const icKeyboard = require('@assets/icons/ic_keyboard.png');
const icArrowDownBlack = require('@assets/icons/ic_arrow_down_black.png');
const icChange = require('@assets/icons/ic_change.png');
const icCancel = require('@assets/icons/ic_cancel.png');
const icEmpty = require('@assets/icons/ic_empty.png');

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
    // onChangeMonth,
    // calendarView,
    // setCalendarView,
    finishDate,
    onEndReached,
    finishCount,
    datePickerView,
    setDatePickerView,
    date,
    onChanageDate,
    onPressConfirm
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
        <View style={styles.PadHorizonLeftContainter}>
          <Image
            source={loginLogo}
            resizeMode={'contain'}
            style={{
              marginTop: 30,
              width: '100%'
            }}
          />
          <View style={styles.PadHorizonProfileView}>
            <Image
              source={{ uri: userImg }}
              style={styles.userImageView}
              resizeMode={'contain'}
            />
            <Text style={styles.name}>{userName}</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.setting} onPress={onClickSetting}>
              <Image source={icSet} style={{ width: 18, height: 18 }} />
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

        <View style={{ flex: 1, paddingVertical: 50 }}>
          {/* 진행중인 화상회의 */}
          {ongoingConference.length > 0 && (
            <View
              style={[
                styles.ongoingContainer,
                ,
                { paddingHorizontal: isTablet ? 30 : 20 }
              ]}
            >
              <View style={styles.goingTextContainer}>
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
              { paddingHorizontal: isTablet ? 30 : 20 }
            ]}
          >
            <View style={styles.ConferenceListTitle}>
              {reservationConference.length > 0 && (
                <Fragment>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', marginVertical: 5 }}
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
                    onPress={() => setDatePickerView(true)}
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
              windowSize={10}
              renderItem={data => {
                const { item } = data;

                return highlight === 'reservation' ? (
                  <ReservationCard {...item} isTablet={isTablet} />
                ) : (
                  <FinishedCard {...item} isTablet={isTablet} />
                );
              }}
              showsVerticalScrollIndicator={false}
              onEndReached={({ distanceFromEnd }) => {
                distanceFromEnd > 0 && onEndReached();
              }}
              onEndReachedThreshold={0.5}
              {...(isTablet && {
                columnWrapperStyle: { justifyContent: 'space-between' }
              })}
            />
            {highlight === 'finished' && finishedConference.length === 0 && (
              <View style={styles.finConferenceNone}>
                <Image source={icEmpty} style={{ width: 134, height: 110 }} />
                <Text style={styles.noConferenceText}>
                  {'회의기록이 없습니다.'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {bottomPopup.show && (
          <BottomPopup {...bottomPopup} isHorizon={isHorizon} />
        )}
      </View>
      {datePickerView && (
        <View style={styles.datePickerView}>
          <View
            style={{
              width: 300,
              height: 342,
              borderRadius: 16,
              backgroundColor: '#fff',
              paddingBottom: 30
            }}
          >
            <View style={styles.dateTimePickerHeader}>
              <Text style={styles.selectedTimeText}>{t('조회 월 변경')}</Text>
            </View>
            <View style={styles.timePickerView}>
              <DatePicker
                onDateChange={onChanageDate}
                mode={'date'}
                date={date}
                androidVariant={'nativeAndroid'}
              />
            </View>
            <TouchableOpacity
              style={styles.selectedTimeButton}
              onPress={onPressConfirm}
            >
              <Text style={styles.selectedButtonText}>{`적용`}</Text>
            </TouchableOpacity>
          </View>
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
  companyText: {
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'DOUZONEText30',
    letterSpacing: -0.24
  },
  selectConpany: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 28
  },
  selectedMonth: {
    fontFamily: 'DOUZONEText30',
    fontSize: 11,
    color: '#333'
  },
  // settingImg: { width: 30, height: 30, borderRadius: 24, marginRight: 10 },
  downArrow: {
    width: 18,
    height: 18
  },
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
    color: '#333',
    textAlign: 'center',
    fontFamily: 'DOUZONEText50'
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
    paddingTop: 20,
    paddingBottom: 40
  },
  goingTextContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14
  },
  goingText: {
    fontSize: 14,
    fontFamily: 'DOUZONEText50',
    letterSpacing: -0.28,
    marginRight: 5,
    color: 'rgba(0,0,0, 0.87)'
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
  unFocusReCount: {
    color: '#939393',
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  FocusReCount: {
    color: '#1c90fb',
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  FinishedCotainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  GraySplitBar: {
    borderWidth: 0.7,
    borderColor: '#aaa',
    height: 14,
    marginHorizontal: 10
  },
  ConferenceListContainer: {
    width: '100%',
    flex: 1
    // marginVertical: '2%'
    // backgroundColor: 'red'
  },
  ConferenceListTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14
  },
  ImageText: {
    fontSize: 13,
    fontFamily: 'DOUZONEText30',
    color: '#333'
  },
  PadHorizonLeftContainter: {
    width: 250,
    paddingHorizontal: 30,
    borderRightWidth: 2,
    borderRightColor: '#E6E6E6'
  },
  PadHorizonProfileView: {
    marginTop: 30,
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  userImageView: {
    height: 24,
    width: 24,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: '#939393'
  },
  finConferenceNone: {
    alignItems: 'center',
    paddingTop: 120,
    height: '100%'
  },
  noConferenceText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)'
  },
  datePickerView: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.15)',
    width: '100%',
    height: '100%',
    shadowRadius: 10,
    shadowColor: '#aaa',
    shadowOpacity: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1
  },
  dateTimePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: '5%',
    // marginBottom: '3%',
    height: 48,
    marginTop: 16,
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1
  },
  selectedTimeButton: {
    backgroundColor: '#127eff',
    height: 48,
    marginHorizontal: 20,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedButtonText: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 14
  },
  selectedTimeText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'DOUZONEText50',
    letterSpacing: -0.36
  },
  timePickerView: {
    flex: 1,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default HomeScreenPresenter;
