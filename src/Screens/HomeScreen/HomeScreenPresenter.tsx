/**
 * HomeScreenPresenter
 * 화상회의 히스토리 프레젠터
 */

import React, { Dispatch, Fragment, SetStateAction } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  SectionList
} from 'react-native';

import { getT } from '@utils/translateManager';
import ConferenceCard from './Component/ConferenceCard';
import FinishedCard from './Component/FinishedCard';
import ReservationCard from './Component/ReservationCard';
import BottomPopup, { content } from './Component/BottomPopup';
import ParticipantsList, {
  participantsListProps
} from '@components/renewal/ParticipantsList';
import DatePicker from 'react-native-date-picker';

import {
  ic_set as icSet,
  ic_video as icVideo,
  ic_keyboard as icKeyboard,
  ic_empty as icEmpty,
  home_logo as homeLogo
} from '@assets/index';

const icArrowDownBlack = require('@assets/icons/ic_arrow_down_black.png');

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
  // onChangeMonth: (date: any) => void;
  datePickerView: boolean;
  setDatePickerView: (flag: boolean) => void;
  finishDate: Date;
  onEndReached: () => void;
  finishCount: number;
  onPressConfirm: () => void;
  date: Date;
  onChanageDate: (time: Date) => void;
  reservationCount: number;
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
    // onChangeMonth,
    datePickerView,
    setDatePickerView,
    finishDate,
    onEndReached,
    finishCount,
    onPressConfirm,
    date,
    onChanageDate,
    reservationCount
  } = props;
  const t = getT();

  // console.log('reservationConference : ', reservationConference);

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
          style={[styles.header, { paddingHorizontal: isTablet ? 30 : 20 }]}
        >
          <Image source={homeLogo} style={styles.logo} resizeMode={'contain'} />
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.setting} onPress={onClickSetting}>
            <Image source={icSet} style={{ width: 18, height: 18 }} />
          </TouchableOpacity>
        </View>

        {/* 프로필, 이름 , 회사*/}
        <View
          style={[
            styles.helloContainer,
            { paddingHorizontal: isTablet ? 30 : 20 }
          ]}
        >
          <View style={styles.helloTextContainer}>
            <Image source={{ uri: userImg }} style={styles.userImageView} />
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
              style={[
                styles.topButtons,
                { marginRight: 15 },
                Platform.select({
                  ios: {
                    shadowColor: 'rgb(0,0,0)',
                    shadowOpacity: 0.08,
                    shadowOffset: {
                      width: 0,
                      height: 8
                    }
                  }
                  // android: {
                  //   elevation: 10
                  // }
                })
              ]}
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
              style={[
                styles.topButtons,
                Platform.select({
                  ios: {
                    shadowColor: 'rgb(0,0,0)',
                    shadowOpacity: 0.08,
                    shadowOffset: {
                      width: 0,
                      height: 8
                    }
                  }
                  // android: {
                  //   elevation: 10
                  // }
                })
              ]}
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
                { paddingHorizontal: isTablet ? 30 : 20 }
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
                    key={conference.index}
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
                    {reservationCount}
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
          {highlight === 'reservation' ? (
            <SectionList
              sections={reservationConference}
              refreshing={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Fragment />}
              renderSectionHeader={({ section: { title, data } }) => (
                <View style={styles.reservationTitleView}>
                  <Text style={styles.reservationTitleText}>{`${title} `}</Text>
                  <Text
                    style={[
                      styles.reservationTitleText,
                      {
                        color: '#1c90fb'
                      }
                    ]}
                  >
                    {data.length}
                  </Text>
                  <View style={styles.reservationSplitLine} />
                </View>
              )}
              renderSectionFooter={({ section: { data } }) => {
                return (
                  <FlatList
                    numColumns={isTablet ? 2 : 1}
                    keyExtractor={(item, index) => index.toString()}
                    data={data}
                    windowSize={10}
                    renderItem={({ item }) => {
                      return <ReservationCard {...item} isTablet={isTablet} />;
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
                );
              }}
            />
          ) : (
            <FlatList
              numColumns={isTablet ? 2 : 1}
              keyExtractor={(item, index) => index.toString()}
              data={finishedConference}
              windowSize={10}
              renderItem={({ item }) => {
                return <FinishedCard {...item} isTablet={isTablet} />;
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
          )}

          {highlight === 'finished' && finishedConference.length === 0 && (
            <View
              style={[
                styles.finConferenceNone,
                { paddingTop: isTablet ? 120 : 40 }
              ]}
            >
              <Image source={icEmpty} style={{ width: 134, height: 110 }} />
              <Text style={styles.noConferenceText}>
                {'회의기록이 없습니다.'}
              </Text>
            </View>
          )}
        </View>

        {bottomPopup.show && (
          <BottomPopup
            {...bottomPopup}
            isHorizon={isHorizon}
            isTablet={isTablet}
          />
        )}
      </View>
      {participantsList.show && (
        <ParticipantsList {...participantsList} isHorizon={isHorizon} />
      )}

      {datePickerView && (
        <View
          style={[
            styles.datePickerView,
            isTablet && { justifyContent: 'center', alignItems: 'center' }
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, zIndex: 2 }}
            onPress={() => setDatePickerView(false)}
            activeOpacity={1}
          />
          <View
            style={[
              isTablet
                ? styles.tabletDatePickerContainer
                : styles.datePickerContainer
            ]}
          >
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerHeaderText}>
                {t('조회 월 변경')}
              </Text>
            </View>
            <View style={styles.datePickerBody}>
              <DatePicker
                onDateChange={onChanageDate}
                mode={'date'}
                date={date}
                androidVariant={'nativeAndroid'}
              />
            </View>
            <TouchableOpacity
              style={[styles.datePickerButton, isTablet && { marginBottom: 0 }]}
              onPress={onPressConfirm}
            >
              <Text style={styles.datePickerButtonText}>{`적용`}</Text>
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
  userImageView: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4
  },
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
    fontFamily: 'DOUZONEText50',
    marginRight: 10,
    textAlign: 'center',
    color: '#333'
  },
  greeting: {
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#583',
    marginBottom: 40
  },
  topButtons: {
    borderRadius: 12,
    // borderWidth: 1,
    backgroundColor: '#fff',
    // borderColor: '#fff',
    // width: 102,
    flex: 1,
    height: 90,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 5
  },
  topButtonImg: {
    width: 32,
    height: 32
  },
  ongoingContainer: {
    // width: '100%',
    // height: '28%',
    marginBottom: 28
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
    paddingHorizontal: '4%',
    backgroundColor: '#fff'
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
    justifyContent: 'flex-end',
    zIndex: 1,
    elevation: 1
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
  selectedMonth: {
    fontFamily: 'DOUZONEText30',
    fontSize: 11,
    color: '#333'
  },
  finConferenceNone: {
    alignItems: 'center',
    height: '100%'
  },
  noConferenceText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 14,
    color: 'rgba(0,0,0,0.6)'
  },
  //메인화면 월 변경 하단팝업 스타일
  datePickerContainer: {
    height: 400,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: '#fff'
  },
  tabletDatePickerContainer: {
    width: 300,
    height: 342,
    borderRadius: 16,
    backgroundColor: '#fff',
    paddingBottom: 30
  },
  datePickerHeader: {
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
  datePickerButton: {
    backgroundColor: '#127eff',
    height: 48,
    marginHorizontal: 20,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50
  },
  datePickerButtonText: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 14
  },
  datePickerHeaderText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'DOUZONEText50'
  },
  datePickerBody: {
    flex: 1,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reservationTitleView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14
  },
  reservationTitleText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 14,
    letterSpacing: -0.28,
    color: '#000'
  },
  reservationSplitLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(60,60,67, 0.12)',
    marginLeft: 8
  }
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
