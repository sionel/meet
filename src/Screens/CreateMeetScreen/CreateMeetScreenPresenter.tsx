import React, { Fragment, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Switch
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import CalendarPicker from '../../custom_modules/react-native-calendar-picker/CalendarPicker';

import { getT } from '../../utils/translateManager';

import { wehagoMainURL, wehagoDummyImageURL } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { add, last, parseInt } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';
import { RootState } from '../../redux/configureStore';
import { length } from '../../../webpack.config';
import { stubTrue } from 'lodash';

const icCode = require('../../../assets/new/icons/ic_code.png');
const icLock_W = require('../../../assets/new/icons/ic_lock_w.png');
const icPersonPlus = require('../../../assets/new/icons/ic_person_plus.png');
const icCancel_W = require('../../../assets/new/icons/ic_cancel_w.png');
const icCancel = require('../../../assets/new/icons/ic_cancel.png');
const icCheck = require('../../../assets/new/icons/ic_check.png');
const icMasterCircle = require('../../../assets/new/icons/ic_master_circle.png');
const icAttdCircle = require('../../../assets/new/icons/ic_attd_circle.png');

interface PresenterProps {
  roomName: string;
  timeType: string;
  sendMessage: string;
  timePicker: 'start' | 'end' | 'none';
  datePicker: 'start' | 'end' | 'none';
  time: Date;
  startTime: { date: string; time: string; current: Date };
  endTime: { date: string; time: string; current: Date };
  selectedEmployee: { member: any[]; group: {} };
  isPublic: boolean;
  switchReserve: boolean;
  switchDelAlram: boolean;
  textLess2: boolean;
  isHorizon: boolean;
  isTablet: boolean;
  dateTimeSeleted: boolean;
  timeChangeDetect: boolean;
  sendMsgRef: RefObject<any>;
  titleRef: RefObject<any>;
  auth: any;
  createConference: () => void;
  onHandleBack: () => void;
  onTimeConfirm: () => void;
  onFocusOut: () => void;
  exitDateTime: () => void;
  onSwitchDelAlramChange: () => void;
  togglePublic: () => void;
  onDateChange: (date: Date) => void;
  setTime: (date: Date) => void;
  clickChangeRole: (item: any) => void;
  clickDeleteUser: (item: any) => void;
  timeChange: (time: any) => void;
  onSwitchReserveChange: (reserve: boolean) => void;
  setSelectMode: (toggle: boolean) => void;
  roomNameChange: (roomName: string) => void;
  sendMessageChange: (msg: string) => void;
  openDatePicker: (type: 'start' | 'end' | 'none') => void;
  openTimePicker: (type: 'start' | 'end' | 'none') => void;
}

const CreateMeetScreenPresenter = (props: PresenterProps) => {
  const {
    roomName,
    isPublic,
    timeType,
    startTime,
    endTime,
    timePicker,
    datePicker,
    sendMessage,
    setSelectMode,
    roomNameChange,
    togglePublic,
    openTimePicker,
    openDatePicker,
    // onSelectDate,
    // onSelectTime,
    sendMessageChange,
    createConference,
    //신규Props
    switchReserve,
    switchDelAlram,
    onSwitchReserveChange,
    onSwitchDelAlramChange,
    onHandleBack,
    onDateChange,
    onTimeConfirm,
    time,
    setTime,
    auth,
    // participantList,
    textLess2,
    sendMsgRef,
    titleRef,
    onFocusOut,
    timeChange,
    timeChangeDetect,
    exitDateTime,
    clickChangeRole,
    clickDeleteUser,
    selectedEmployee,
    isHorizon,
    isTablet,
    dateTimeSeleted
  } = props;
  const t = getT();
  const CalendarPickerComponent = (
    <CalendarPicker
      weekdays={[t('일'), t('월'), t('화'), t('수'), t('목'), t('금'), t('토')]}
      months={[
        t('1월'),
        t('2월'),
        t('3월'),
        t('4월'),
        t('5월'),
        t('6월'),
        t('7월'),
        t('8월'),
        t('9월'),
        t('10월'),
        t('11월'),
        t('12월')
      ]}
      previousTitle="<"
      nextTitle=">"
      minDate={new Date()}
      selectedStartDate={startTime.current}
      selectedDayTextColor="#fff"
      selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
      todayBackgroundColor="#febc2c"
      dayShape="square"
      width={isTablet ? 500 : 360}
      onDateChange={onDateChange}
      selectYearTitle={t('년도 선택')}
      selectMonthTitle={t('년')}
      textStyle={{ fontSize: isTablet ? 18 : 14 }}
      disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
    />
  );

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea} onTouchStart={onFocusOut}>
        <View style={[styles.topTitle]}>
          <TouchableOpacity onPress={onHandleBack}>
            <Text style={styles.ft14Dou30}>
              {t('renewal.alert_button_cancel')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.TitleText}>
            {t('renewal.main_create_conference')}
          </Text>
          <TouchableOpacity disabled={textLess2} onPress={createConference}>
            <Text style={[styles.confirmText, !textLess2 && { color: '#000' }]}>
              {t('생성')}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={togglePublic}
          style={[styles.privateContainer]}
        >
          <LinearGradient
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            colors={isPublic ? ['#a460ff', '#5d5dff'] : ['#1cc8fb', '#1c90fb']}
            style={styles.codeContainer}
          >
            <Image
              source={isPublic ? icCode : icLock_W}
              style={styles.icCode}
            />
          </LinearGradient>

          <View style={styles.privateTextContainer}>
            <Text style={styles.privateMainText}>
              {isPublic ? t('공개 회의') : t('비공개 회의')}
            </Text>
            <Text style={styles.privateSubText}>
              {isPublic
                ? t('공유 URL과 참여코드를 통해 초대 및 입장이 가능합니다.')
                : t('지정된 참여자 이외엔 접속 불가능합니다.')}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={[
            { backgroundColor: '#F7F8FA', height: 9 },
            isHorizon && { height: 6 }
          ]}
        />

        <View style={[{ backgroundColor: '#fff', height: '30%' }]}>
          <View style={styles.middleContainer}>
            <View style={styles.directionColTitle}>
              <Text style={styles.textHeader}>{t('회의명')}</Text>
              <TextInput
                onChangeText={roomNameChange}
                value={roomName}
                maxLength={20}
                style={[
                  styles.roomNameStyle,
                  roomName !== '' && { borderColor: '#1c90fb' },
                  textLess2 && roomName !== '' && { borderColor: '#fc4c60' }
                ]}
                ref={titleRef}
              />
              <View
                style={[
                  styles.countContainer,
                  textLess2 &&
                    roomName !== '' && { justifyContent: 'space-between' }
                ]}
              >
                {textLess2 && roomName != '' && (
                  <Text style={styles.lengthError}>
                    {t('두글자 이상 입력해주세요.')}
                  </Text>
                )}
                <View style={styles.countContainer}>
                  <Text style={styles.ft12}>{roomName.length}</Text>
                  <Text style={styles.maxLength}>/20</Text>
                </View>
              </View>
            </View>
            <View style={styles.directionColMessage}>
              <Text style={styles.textHeader}>{t('초대메세지')}</Text>
              <TextInput
                onChangeText={sendMessageChange}
                value={sendMessage}
                maxLength={200}
                multiline
                style={[
                  styles.sendStyle,
                  sendMessage !== '' && { borderColor: '#1c90fb' },
                  isHorizon && { paddingTop: '1%' }
                ]}
                ref={sendMsgRef}
              />
              <View style={styles.countContainer}>
                <Text style={styles.ft12}>{sendMessage.length}</Text>
                <Text style={styles.maxLength}>/200</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            { backgroundColor: '#F7F8FA', height: 9 },
            isHorizon && { height: 6 }
          ]}
        />

        <View
          style={[styles.reserveContainer, switchReserve && { height: '15%' }]}
        >
          <View style={styles.rowContainer}>
            <Text style={[styles.ft14Dou50, { fontSize: 15 }]}>
              {t('예약회의')}
            </Text>
            <Switch
              onValueChange={onSwitchReserveChange}
              value={switchReserve}
              trackColor={{ false: '', true: '#1c90fb' }}
            />
          </View>
          {switchReserve && (
            <Fragment>
              <View style={styles.dateTimeRow}>
                <Text style={styles.timeText}>{t('시작시간')}</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                >
                  <TouchableOpacity
                    style={[
                      styles.datetimeBox,
                      datePicker === 'start' && {
                        borderColor: 'rgb(28, 144, 251)'
                      },
                      isTablet && { width: '20%' }
                    ]}
                    onPress={() => {
                      openDatePicker('start');
                    }}
                  >
                    <Text
                      style={[
                        styles.datetimeText,
                        datePicker === 'start' && {
                          color: 'rgb(28, 144, 251)'
                        }
                      ]}
                    >
                      {`${startTime.date}`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.datetimeBox,
                      timePicker === 'start' && {
                        borderColor: 'rgb(28, 144, 251)'
                      },
                      isTablet && { width: '30%' }
                    ]}
                    onPress={() => {
                      openTimePicker('start');
                    }}
                  >
                    <Text
                      style={[
                        styles.datetimeText,
                        timePicker === 'start' && {
                          color: 'rgb(28, 144, 251)'
                        }
                      ]}
                    >
                      {`${startTime.time}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.dateTimeRow}>
                <Text style={styles.timeText}>{t('종료시간')}</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                >
                  <TouchableOpacity
                    style={[
                      styles.datetimeBox,
                      datePicker === 'end' && {
                        borderColor: 'rgb(28, 144, 251)'
                      },
                      isTablet && { width: '20%' }
                    ]}
                    onPress={() => {
                      openDatePicker('end');
                    }}
                  >
                    <Text
                      style={[
                        styles.datetimeText,
                        datePicker === 'end'
                          ? { color: 'rgb(28, 144, 251)' }
                          : {}
                      ]}
                    >
                      {`${endTime.date}`}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.datetimeBox,
                      timePicker === 'end' && {
                        borderColor: 'rgb(28, 144, 251)'
                      },
                      isTablet && { width: '30%' }
                    ]}
                    onPress={() => {
                      openTimePicker('end');
                    }}
                  >
                    <Text
                      style={[
                        styles.datetimeText,
                        timePicker === 'end'
                          ? { color: 'rgb(28, 144, 251)' }
                          : {}
                      ]}
                    >
                      {`${endTime.time}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Fragment>
          )}
        </View>

        <View
          style={[
            { backgroundColor: '#F7F8FA', height: 9 },
            isHorizon && { height: 6 }
          ]}
        />

        <View style={[styles.conferenceMember]}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.ft14Dou50}>{t('참석자')} </Text>
            <Text style={[styles.ft14Dou50, { color: '#1c90fb' }]}>
              {selectedEmployee.member.length}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setSelectMode(true);
            }}
          >
            <Image source={icPersonPlus} style={styles.icPersonPlus} />
          </TouchableOpacity>
        </View>

        <View style={[styles.deleteAlram]}>
          <View>
            <Text
              style={[styles.ft12, { letterSpacing: -0.18, lineHeight: 18 }]}
            >
              {isHorizon
                ? t('화상회의가 변경 또는 삭제될 경우, 알림 이메일을 보냅니다.')
                : t(
                    '화상회의가 변경 또는 삭제될 경우, \n알림 이메일을 보냅니다.'
                  )}
            </Text>
          </View>

          <Switch
            onValueChange={onSwitchDelAlramChange}
            value={switchDelAlram}
            trackColor={{ false: '', true: '#1c90fb' }}
          />
        </View>

        <View style={{ flex: 1 }}>
          {selectedEmployee.member[0].user_no !== undefined && (
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={[
                {
                  flexGrow: 1,
                  paddingHorizontal: '5%'
                }
              ]}
              data={selectedEmployee.member}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }: any) => {
                const isMaster = item.is_master;
                return (
                  <View style={styles.participantList}>
                    <TouchableOpacity
                      style={[
                        styles.profileView,
                        isTablet && { width: 46, height: 46 }
                      ]}
                      onPress={() => {
                        clickDeleteUser(item);
                      }}
                      disabled={item.user_no === auth.user_no}
                    >
                      <View
                        style={[
                          styles.myView,
                          item.user_no !== auth.user_no && {
                            backgroundColor: '#1c90fb'
                          }
                        ]}
                      >
                        {item.user_no === auth.user_no ? (
                          <Text style={styles.myText}>
                            {t('renewal.chatting_me')}
                          </Text>
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
                            ? item.profile_url
                            : wehagoDummyImageURL
                        }}
                        resizeMode={'cover'}
                      />
                    </TouchableOpacity>
                    <View
                      style={[styles.infoBox, isHorizon && { width: '70%' }]}
                    >
                      {!item.value && (
                        <Text style={styles.name}>
                          {item.user_name
                            ? item.user_name
                            : item.address_name
                            ? item.address_name
                            : ''}{' '}
                          {item.rank_name
                            ? item.rank_name
                            : item.position_rank_name
                            ? item.position_rank_name
                            : ''}
                        </Text>
                      )}
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.tree, item.value && { fontSize: 16 }]}
                      >
                        {item.full_path
                          ? item.full_path
                          : item.address_service_no
                          ? item.emailinfolist[0].email_address
                          : item.value}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.roleContainer,
                        isMaster && { borderColor: '#01acc1' },
                        !item.user_no && { borderColor: '#fff' },
                        isTablet && { width: 140 }
                      ]}
                      onPress={() => {
                        clickChangeRole(item);
                      }}
                      disabled={item.user_no === auth.user_no || !item.user_no}
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
                            {t('참석자')}
                          </Text>
                        </Fragment>
                      ) : (
                        <Fragment></Fragment>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>

      {(timePicker !== 'none' || datePicker !== 'none') && (
        <View
          style={[
            styles.bottomComponent,
            isHorizon && { width: '66%', left: '17%' }
          ]}
        >
          <View style={{ flex: 1, backgroundColor: '#666', zIndex: 2 }} />
          <View style={styles.dateTimePickerHeader}>
            <TouchableOpacity onPress={exitDateTime}>
              <Image source={icCancel} style={styles.icCancel} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onTimeConfirm}>
              {timePicker !== 'none' && (
                <Image source={icCheck} style={styles.icCancel} />
              )}
            </TouchableOpacity>
          </View>
          {timePicker !== 'none' && (
            <View style={styles.timePickerView}>
              <DatePicker
                onDateChange={time => timeChange(time)}
                mode={'time'}
                date={
                  timeChangeDetect
                    ? time
                    : timeType === 'start'
                    ? startTime.current
                    : endTime.current
                }
              />
            </View>
          )}
          {datePicker !== 'none' && CalendarPickerComponent}
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  //상단
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff'
  },
  TitleText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    color: '#000'
  },
  privateContainer: {
    height: '8%',
    paddingHorizontal: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  privateTextContainer: {
    flexDirection: 'column',
    paddingLeft: '3%'
  },
  privateMainText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#000'
  },
  privateSubText: {
    fontSize: 12,
    color: 'rgb(147,147,147)',
    fontFamily: 'DOUZONEText30'
  },
  ft14Dou30: {
    fontSize: 14,
    fontFamily: 'DOUZONEText30',
    color: '#000'
  },
  confirmText: {
    fontSize: 14,
    fontFamily: 'DOUZONEText30',
    color: '#d3d3d3'
  },
  ft14Dou50: {
    fontSize: 14,
    fontFamily: 'DOUZONEText50',
    color: '#000'
  },
  //중단
  directionColTitle: {
    flexDirection: 'column',
    height: '25%'
  },
  directionColMessage: {
    flexDirection: 'column',
    paddingVertical: 5,
    height: '60%'
    // backgroundColor: 'red'
  },
  middleContainer: {
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingVertical: '1%'
    // height: '40%'
  },
  textHeader: {
    fontSize: 12,
    marginVertical: 5,
    color: '#000',
    fontFamily: 'DOUZONEText30'
  },
  roomNameStyle: {
    borderWidth: 1,
    paddingHorizontal: '3.5%',
    height: 44,
    borderColor: '#E6E6E6',
    fontSize: 14,
    borderRadius: 10,
    fontFamily: 'DOUZONEText30'
  },
  sendStyle: {
    borderWidth: 1,
    paddingTop: '2%',
    paddingHorizontal: '3.5%',
    height: 84,
    letterSpacing: -0.28,
    borderColor: '#E6E6E6',
    fontSize: 14,
    lineHeight: 20,
    borderRadius: 15
  },
  countContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 2,
    height: 17
  },
  ft12: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'DOUZONEText30'
  },
  maxLength: {
    fontSize: 12,
    color: '#939393',
    fontFamily: 'DOUZONEText30'
  },
  //예약회의
  reserveContainer: {
    paddingHorizontal: '5%',
    paddingVertical: 5,
    height: '6%'
  },
  datetimeBox: {
    width: '35%',
    alignItems: 'flex-end'
    // marginRight: 5,
  },
  datetimeText: {
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  //하단
  botContainer: {
    flex: 1.4
  },
  deleteAlram: {
    height: '6%',
    backgroundColor: '#e9f5ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },
  conferenceMember: {
    height: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%'
  },
  //이미지(icCode)
  codeContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icCode: {
    resizeMode: 'cover',
    width: 19.5,
    height: 17
  },
  icPersonPlus: {
    resizeMode: 'cover',
    width: 24,
    height: 24
  },
  icCancel: {
    resizeMode: 'cover',
    width: 18,
    height: 18
  },
  icCancelUser: {
    resizeMode: 'cover',
    width: 14,
    height: 14
  },
  icMaster: {
    width: 20,
    height: 20
  },
  icTabletMaster: {
    width: 20,
    height: 20
  },
  roleContainer: {
    flexDirection: 'row',
    // backgroundColor: '#febc2c',
    borderColor: '#f49750',
    borderWidth: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 61,
    borderRadius: 15
  },
  maseterText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.22,
    color: '#01acc1',
    fontFamily: 'DOUZONEText50',
    paddingLeft: '5%'
  },
  attendantText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.22,
    color: '#f49750',
    fontFamily: 'DOUZONEText50',
    paddingRight: '5%'
  },
  extText: {
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: -0.22,
    color: '#000',
    fontWeight: '800'
  },
  graybar1: {
    backgroundColor: '#F7F8FA',
    height: '2%'
  },
  participantList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingTop: '1%',
    paddingBottom: '1%'
  },
  profileView: {
    width: 40,
    height: 40,
    position: 'relative',
    zIndex: 1
  },
  profile: {
    flex: 1,
    borderRadius: 25,
    zIndex: 2
    // position: 'absolute',
  },
  infoBox: { width: '67%' },
  myView: {
    width: 19,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6767f7',
    zIndex: 3,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  myText: {
    color: '#fff',
    fontSize: 10,
    lineHeight: 18,
    letterSpacing: -0.2,
    fontFamily: 'DOUZONEText50'
  },
  name: {
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: -0.3,
    paddingBottom: '0.5%',
    color: '#000',
    fontFamily: 'DOUZONEText30'
  },
  tree: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.24,
    color: '#939393',
    fontFamily: 'DOUZONEText30'
  },
  bottomComponent: {
    position: 'absolute',
    backgroundColor: '#fff',
    bottom: 0,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    shadowRadius: 10,
    shadowColor: '#aaa',
    shadowOpacity: 10,
    borderWidth: 1,
    paddingBottom: 50
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  dimmed: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateTimePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginBottom: '3%',
    paddingHorizontal: '4%'
  },
  timePickerView: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  lengthError: {
    color: '#fc4c60',
    fontSize: 12,
    lineHeight: 17,
    letterSpacing: -0.24,
    fontFamily: 'DOUZONEText30'
  },
  timeText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30'
  },
  dateTimeRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default CreateMeetScreenPresenter;
