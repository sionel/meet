import React, { Fragment, MutableRefObject, RefObject } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Switch,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  GestureResponderEvent,
  Animated,
  TextInputChangeEventData
} from 'react-native';

import DatePicker from 'react-native-date-picker';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getT } from '../../utils/translateManager';
import { CustomIcon } from '../../components';
// import { add, last, parseInt } from 'lodash';

const icCode = require('../../../assets/new/icons/ic_code.png');
const icLock_W = require('../../../assets/new/icons/ic_lock_w.png');
const icPersonPlus = require('../../../assets/new/icons/ic_person_plus.png');
const icCancel_W = require('../../../assets/new/icons/ic_cancel_w.png');
const icCancel = require('../../../assets/new/icons/ic_cancel.png');
const icCheck = require('../../../assets/new/icons/ic_check.png');
const icMasterCircle = require('../../../assets/new/icons/ic_master_circle.png');
const icAttdCircle = require('../../../assets/new/icons/ic_attd_circle.png');
const icModify = require('../../../assets/new/icons/ic_modify.png');
const icBack = require('../../../assets/new/icons/ic_back.png');
const icOut = require('../../../assets/new/icons/ic_out.png');
const icUserW = require('../../../assets/new/icons/ic_user_w.png');

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
  isNormal: boolean;
  isAuth: boolean;
  calendarError: boolean;
  nameduplication: boolean;
  isLoading: boolean;
  rezInfoLoading: boolean;
  sendMsgRef: RefObject<any>;
  titleRef: RefObject<any>;
  auth: any;
  width: number;
  spin: Animated.AnimatedInterpolation;
  modifyConference: () => void;
  onHandleBack: () => void;
  onTimeConfirm: () => void;
  onFocusOut: () => void;
  exitDateTime: () => void;
  onSwitchDelAlramChange: () => void;
  togglePublic: () => void;
  changeIsNormal: () => void;
  onDateChange: (date: any) => void;
  setTime: (date: Date) => void;
  clickChangeRole: (item: any, index: number) => void;
  clickDeleteUser: (item: any, index: number) => void;
  timeChange: (time: any) => void;
  onSwitchReserveChange: (reserve: boolean) => void;
  setSelectMode: (toggle: boolean) => void;
  roomNameChange: (roomName: string) => void;
  sendMessageChange: (msg: string) => void;
  openDatePicker: (type: 'start' | 'end' | 'none') => void;
  openTimePicker: (type: 'start' | 'end' | 'none') => void;
  handleBlurTitleInput: (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => void;
}

const ConferenceModfiyScreenPresenter = (props: PresenterProps) => {
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
    modifyConference,
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
    dateTimeSeleted,
    isNormal,
    isAuth,
    changeIsNormal,
    calendarError,
    width,
    nameduplication,
    isLoading,
    handleBlurTitleInput,
    rezInfoLoading,
    spin
  } = props;
  const t = getT();
  const DatePickerComponent = (
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
      minDate={new Date()}
      selectedStartDate={startTime.current}
      selectedDayTextColor="#fff"
      selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
      todayBackgroundColor="#febc2c"
      dayShape="square"
      width={isTablet ? 500 : 360}
      onDateChange={onDateChange}
      selectYearTitle={t('renewal.main_select_year')}
      selectMonthTitle={t('renewal.common_year')}
      textStyle={{ fontSize: isTablet ? 18 : 14 }}
      disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
    />
  );

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea} onTouchStart={onFocusOut}>
        <View style={[styles.topTitle]}>
          <TouchableOpacity onPress={onHandleBack}>
            <Image source={icBack} style={styles.img24} resizeMode="cover" />
          </TouchableOpacity>
          <Text style={styles.TitleText}>
            {isNormal
              ? t('renewal.conference_detail_title')
              : t('renewal.conference_modify_title')}
          </Text>
          <TouchableOpacity
            disabled={textLess2 || !isAuth}
            onPress={
              isAuth ? (isNormal ? changeIsNormal : modifyConference) : () => {}
            }
          >
            {isAuth ? (
              isNormal ? (
                <Image
                  source={icModify}
                  style={styles.img24}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  style={[
                    styles.updateText,
                    !textLess2 &&
                      !nameduplication &&
                      !isLoading && { color: '#000' }
                  ]}
                >
                  {t('renewal.conference_modify_button')}
                </Text>
              )
            ) : (
              <Fragment />
            )}
          </TouchableOpacity>
        </View>

        {rezInfoLoading ? (
          <View style={styles.dimmed}>
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CustomIcon name={'loading'} size={48} />
            </Animated.View>
            <Text style={styles.loadingText}>
              {t('예약정보를 불러오는중입니다.')}
            </Text>
          </View>
        ) : (
          <Fragment>
            <TouchableOpacity
              onPress={togglePublic}
              disabled={!isAuth || isNormal}
              activeOpacity={isAuth ? 0.6 : 1}
              style={[styles.privateContainer]}
            >
              <LinearGradient
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
                colors={
                  isPublic ? ['#a460ff', '#5d5dff'] : ['#1cc8fb', '#1c90fb']
                }
                style={styles.codeContainer}
              >
                <Image
                  source={isPublic ? icCode : icLock_W}
                  style={styles.icCode}
                />
              </LinearGradient>

              <View style={styles.privateTextContainer}>
                <Text style={styles.privateMainText}>
                  {isPublic
                    ? t('renewal.direct_create_public_conference')
                    : t('renewal.direct_create_private_conference')}
                </Text>
                <Text style={styles.privateSubText}>
                  {isPublic
                    ? t('renewal.direct_create_public_guide')
                    : t('renewal.direct_create_private_guide')}
                </Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.graySplitBar, isHorizon && { height: 6 }]} />

            <View
              style={styles.roomContantContainer}
              pointerEvents={isNormal ? 'none' : 'auto'}
            >
              <View
                style={[
                  styles.middleContainer,
                  isNormal && { justifyContent: 'space-evenly' }
                ]}
              >
                <View style={styles.directionColTitle}>
                  <Text style={styles.textHeader}>
                    {t('renewal.direct_create_conferenceName')}
                  </Text>
                  {isNormal ? (
                    <Text style={styles.roomNameTextStyle}>{roomName}</Text>
                  ) : (
                    <Fragment>
                      <TextInput
                        onChangeText={roomNameChange}
                        onBlur={handleBlurTitleInput}
                        value={roomName}
                        maxLength={20}
                        style={[
                          styles.roomNameTextInputStyle,
                          roomName !== '' && { borderColor: '#1c90fb' },
                          (textLess2 || nameduplication) &&
                            roomName !== '' && { borderColor: '#fc4c60' }
                        ]}
                        ref={titleRef}
                      />
                      <View
                        style={[
                          styles.countContainer,
                          (textLess2 || nameduplication) &&
                            roomName !== '' && {
                              justifyContent: 'space-between'
                            }
                        ]}
                      >
                        {textLess2 && roomName != '' && (
                          <Text style={styles.lengthError}>
                            {t('renewal.direct_create_length_warning')}
                          </Text>
                        )}

                        {nameduplication && roomName != '' && (
                          <Text style={styles.lengthError}>
                            {t(
                              '중복되는 회의명입니다. 회의명 변경 후 생성하세요'
                            )}
                          </Text>
                        )}

                        <View style={styles.countContainer}>
                          <Text style={styles.ft12}>{roomName.length}</Text>
                          <Text style={styles.maxLength}>/20</Text>
                        </View>
                      </View>
                    </Fragment>
                  )}
                </View>
                <View style={styles.directionColMessage}>
                  <Text style={styles.textHeader}>
                    {t('renewal.direct_create_inviteMessage')}
                  </Text>

                  {isNormal ? (
                    <Text style={styles.sendTextStyle}>{sendMessage}</Text>
                  ) : (
                    <Fragment>
                      <TextInput
                        onChangeText={sendMessageChange}
                        value={sendMessage}
                        maxLength={200}
                        multiline
                        style={[
                          styles.sendInputStyle,
                          sendMessage !== '' && { borderColor: '#1c90fb' },
                          isHorizon && { paddingTop: '1%' }
                        ]}
                        ref={sendMsgRef}
                      />
                      <View style={styles.countContainer}>
                        <Text style={styles.ft12}>{sendMessage.length}</Text>
                        <Text style={styles.maxLength}>/200</Text>
                      </View>
                    </Fragment>
                  )}
                </View>
              </View>
            </View>

            <View style={[styles.graySplitBar, isHorizon && { height: 6 }]} />

            <View
              pointerEvents={isNormal ? 'none' : 'auto'}
              style={[
                styles.reserveContainer,
                switchReserve && { height: '15%' }
              ]}
            >
              <View style={styles.rowBetweenContainer}>
                <Text style={[styles.ft14Dou50, { fontSize: 15 }]}>
                  {t('renewal.direct_create_reservation_conference')}
                </Text>
                {isNormal ? (
                  <Fragment />
                ) : (
                  <Switch
                    onValueChange={onSwitchReserveChange}
                    value={switchReserve}
                    trackColor={{ false: '', true: '#1c90fb' }}
                  />
                )}
              </View>
              {switchReserve && (
                <Fragment>
                  <View style={styles.rowBetweenContainer}>
                    <Text style={styles.timeText}>
                      {t('renewal.roomstate_reservation_starttime')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                      }}
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
                  <View style={styles.rowBetweenContainer}>
                    <Text style={styles.timeText}>
                      {t('renewal.roomstate_reservation_endtime')}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end'
                      }}
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

            <View style={[styles.graySplitBar, isHorizon && { height: 6 }]} />

            <View
              style={[styles.conferenceMember]}
              pointerEvents={isNormal ? 'none' : 'auto'}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.ft14Dou50}>
                  {t('renewal.direct_create_participants')}{' '}
                </Text>
                <Text style={[styles.ft14Dou50, { color: '#1c90fb' }]}>
                  {selectedEmployee.member.length}
                </Text>
              </View>
              {isNormal ? (
                <Fragment />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setSelectMode(true);
                  }}
                >
                  <Image source={icPersonPlus} style={styles.icPersonPlus} />
                </TouchableOpacity>
              )}
            </View>

            {isNormal ? (
              <Fragment />
            ) : (
              <View style={[styles.deleteAlram]}>
                <View>
                  <Text
                    style={[
                      styles.ft12,
                      { letterSpacing: -0.18, lineHeight: 18 }
                    ]}
                  >
                    {isHorizon
                      ? t('renewal.direct_create_update_alram1')
                      : t('renewal.direct_create_update_alram2')}
                  </Text>
                </View>

                <Switch
                  onValueChange={onSwitchDelAlramChange}
                  value={switchDelAlram}
                  trackColor={{ false: '', true: '#1c90fb' }}
                />
              </View>
            )}

            <View
              style={{ flex: 1, paddingHorizontal: '5%' }}
              pointerEvents={isNormal ? 'none' : 'auto'}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={{ flex: 1 }}
                data={selectedEmployee.member}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item, index }: any) => {
                  const isMaster = item.is_master;
                  return (
                    <View
                      style={[styles.participantList, { width: width * 0.9 }]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.profileView,
                          isTablet && { width: 46, height: 46 }
                        ]}
                        onPress={() => {
                          clickDeleteUser(item, index);
                        }}
                        disabled={item.user_no === auth.user_no}
                      >
                        <View
                          style={[
                            styles.myView,
                            isNormal &&
                              item.user_no !== auth.user_no && {
                                backgroundColor: '#00ff0000'
                              },
                            !isNormal &&
                              item.user_no !== auth.user_no && {
                                backgroundColor: '#1c90fb'
                              }
                          ]}
                        >
                          {item.user_no === auth.user_no ? (
                            <Text style={styles.myText}>
                              {t('renewal.chatting_me')}
                            </Text>
                          ) : isNormal ? (
                            <Fragment />
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
                          }}
                          resizeMode={'cover'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.infoBox}
                        activeOpacity={1}
                      >
                        <View style={styles.infoBox}>
                          {item.full_path !== '' ? (
                            <Fragment>
                              <Text style={styles.name}>
                                {item.user_name}{' '}
                                {item.rank_name ? item.rank_name : ''}
                              </Text>
                              <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={styles.tree}
                              >
                                {item.full_path}
                              </Text>
                            </Fragment>
                          ) : (
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[styles.tree, { fontSize: 15 }]}
                            >
                              {item.user_name}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.roleContainer,
                          isMaster && { borderColor: '#01acc1' },
                          !item.user_no && { borderColor: '#fff' },
                          isTablet && { width: 140 }
                        ]}
                        onPress={() => {
                          clickChangeRole(item, index);
                        }}
                        disabled={item.user_no === auth.user_no}
                        activeOpacity={isNormal ? 1 : 0.6}
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
                              {t('renewal.direct_create_participants')}
                            </Text>
                          </Fragment>
                        ) : (
                          <Fragment>
                            {/* <Text style={styles.extText}>
                              {t('외부참여자')}
                            </Text> */}
                          </Fragment>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </View>
          </Fragment>
        )}
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
            {!calendarError && (
              <TouchableOpacity onPress={exitDateTime} style={styles.icCancel}>
                <Image source={icCancel} style={styles.icCancel} />
              </TouchableOpacity>
            )}

            {timePicker !== 'none' && (
              <TouchableOpacity onPress={onTimeConfirm} style={styles.icCancel}>
                <Image source={icCheck} style={styles.icCancel} />
              </TouchableOpacity>
            )}
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
          {datePicker !== 'none' && DatePickerComponent}
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
  ft14N: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000'
  },
  updateText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#ccc'
  },
  ft14Dou50: {
    fontSize: 14,
    fontFamily: 'DOUZONEText50',
    color: '#000'
  },
  loadingText: {
    color: '#dfdfdf',
    fontFamily: 'DOUZONEText30',
    marginTop: 10
  },
  //중단
  roomContantContainer: { backgroundColor: '#fff', height: '25%' },
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
    fontSize: 13,
    marginVertical: 2,
    color: '#939393',
    fontFamily: 'DOUZONEText30'
  },
  roomNameTextStyle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.28,
    fontFamily: 'DOUZONEText30'
  },
  roomNameTextInputStyle: {
    borderWidth: 1,
    paddingHorizontal: '3.5%',
    height: 44,
    borderColor: '#E6E6E6',
    fontSize: 14,
    borderRadius: 10,
    fontFamily: 'DOUZONEText30'
  },
  sendTextStyle: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.28,
    fontFamily: 'DOUZONEText30'
  },
  sendInputStyle: {
    borderWidth: 1,
    paddingTop: '2%',
    paddingHorizontal: '3.5%',
    height: '60%',
    letterSpacing: -0.28,
    borderColor: '#E6E6E6',
    fontSize: 14,
    lineHeight: 20,
    borderRadius: 15,
    fontFamily: 'DOUZONEText30'
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
  img24: {
    width: 24,
    height: 24
  },
  icMaster: {
    width: 20,
    height: 20
  },
  icTabletMaster: {
    width: 30,
    height: 30
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
    fontFamily: 'DOUZONEText50'
  },
  graybar1: {
    backgroundColor: '#F7F8FA',
    height: '2%'
  },
  participantList: {
    flexDirection: 'row',
    justifyContent: 'center',
    // flex: 1,
    alignItems: 'center',
    height: 56,
    paddingHorizontal: '1%'
    // backgroundColor: 'rgba(255,0,0,0.2)'
  },
  profileView: {
    width: 40,
    height: 40,
    position: 'relative',
    zIndex: 1,
    marginRight: 10
  },
  profile: {
    flex: 1,
    borderRadius: 25,
    zIndex: 2
    // position: 'absolute',
  },
  infoBox: { flex: 1, justifyContent: 'center' },
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
    fontFamily: 'DOUZONEText30',
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: -0.3,
    paddingBottom: '0.5%',
    color: '#000'
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
  rowBetweenContainer: {
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
  graySplitBar: {
    backgroundColor: '#F7F8FA',
    height: 9
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
  dateTimePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
    marginBottom: '3%',
    paddingHorizontal: '4%'
  }
});

export default ConferenceModfiyScreenPresenter;
