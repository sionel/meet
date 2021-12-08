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

const HomeScreenPresenter = (props: any) => {
  const {
    isTablet,
    test,
    setTest,
    userName,
    indicator,
    ongoingConference,
    reservationConference,
    finishedConference,
    highlight,
    setHighlight,

    onClickSetting,
    companyName,
    userImg,
    createTalkConference,
    createConference,
    enterInviteCode,
    bottomPopup,
    participantsList,
    isHorizon,
    onConpanyChange,
    onChangeMonth,
    month
  } = props;
  const t = getT();

  return (
    <Fragment>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#F7F8FA'} />
      <SafeAreaView style={styles.safeContainer}>
        {participantsList.show && (
          <ParticipantsList {...participantsList} isHorizon={isHorizon} />
        )}
        {/* <TouchableOpacity
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            top: 250,
            backgroundColor: '#1322fa',
            zIndex: 9
          }}
          onPress={setTest}
        /> */}
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

        {/* 진행중인 화상회의 */}
        {ongoingConference.length > 0 && (
          <View style={styles.ongoingContainer}>
            <View
              style={[
                styles.goingTextContainer,
                { paddingHorizontal: isTablet ? 40 : 20 }
              ]}
            >
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

        {ongoingConference.length === 0 &&
        reservationConference.length === 0 &&
        finishedConference.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              style={{ width: 150, height: 120 }}
              source={icEmptyConference}
              resizeMode={'contain'}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                letterSpacing: -0.21
              }}
            >
              {
                '진행중인 화상회의가 없습니다.\n회의생성을 통해 회의를 생성해보세요'
              }
            </Text>
          </View>
        ) : reservationConference.length === 0 &&
          finishedConference.length === 0 ? (
          <View
            style={{
              flex: 1,
              marginVertical: '2%',
              paddingHorizontal: isTablet ? 40 : 20
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text style={styles.goingText}>{'회의기록'}</Text>
              <TouchableOpacity
                onPress={onChangeMonth}
                style={{
                  height: '100%',
                  borderColor: '#000',
                  borderWidth: 1,
                  padding: 5
                }}
              >
                <Text>{`${month}월`}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
              }}
            >
              <Image
                style={{ width: 150, height: 120 }}
                source={icEmpty}
                resizeMode={'contain'}
              />
              <Text>{'회의기록이 없습니다'}</Text>
            </View>
          </View>
        ) : (
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
              )}
              {reservationConference.length > 0 &&
                finishedConference.length > 0 && (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#aaa',
                      height: '100%',
                      marginHorizontal: 10
                    }}
                  />
                )}
              {finishedConference.length > 0 && (
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
                      { color: '#939393', fontSize: 16, paddingRight: 20 },
                      highlight === 'finished' && {
                        fontWeight: 'bold',
                        color: '#1c90fb'
                      }
                    ]}
                  >
                    {finishedConference.length}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {isTablet ? (
              <FlatList
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                data={
                  highlight === 'reservation'
                    ? reservationConference
                    : finishedConference
                }
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={data => {
                  const { item } = data;

                  return highlight === 'reservation' ? (
                    <ReservationCard {...item} isTablet={isTablet} />
                  ) : (
                    // <FinishedCard {...{item}} />
                    <FinishedCard {...item} isTablet={isTablet} />
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <FlatList
                numColumns={1}
                keyExtractor={(item, index) => index.toString()}
                data={
                  highlight === 'reservation'
                    ? reservationConference
                    : finishedConference
                }
                // { isTablet && columnWrapperStyle={{ justifyContent: 'space-between' }}}
                renderItem={data => {
                  const { item } = data;

                  return highlight === 'reservation' ? (
                    <ReservationCard {...item} isTablet={isTablet} />
                  ) : (
                    // <FinishedCard {...{item}} />
                    <FinishedCard {...item} isTablet={isTablet} />
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}

        {bottomPopup.show && (
          <BottomPopup {...bottomPopup} isHorizon={isHorizon} />
        )}
        {true && (
          <CalendarPicker
            weekdays={['일', '월', '화', '수', '목', '금', '토']}
            months={['1','2','3','4','5','6','7','8','9','10','11','12']}
            previousTitle="<"
            nextTitle=">"
            // selectedStartDate={startTime.current}
            selectedDayTextColor="#fff"
            selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
            todayBackgroundColor="#febc2c"
            dayShape="square"
            scaleFactor={isHorizon ? 740 : isTablet ? 450 : 370}
            onDateChange={() => {}}
            selectYearTitle={t('년도 선택')}
            selectMonthTitle={''}
            textStyle={{ fontSize: isTablet ? 18 : 14 }}
            disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
            previousTitleStyle={{ paddingLeft: '30%' }}
            nextTitleStyle={{ paddingRight: '30%' }}
            currentView={'months'}
          />
        )}
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'flex-start'
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
  companyText: { fontSize: 15, textAlign: 'right' },
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
    fontSize: 20,
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
