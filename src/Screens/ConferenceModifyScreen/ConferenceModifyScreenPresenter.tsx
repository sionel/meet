import React, { Fragment } from 'react';
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
import CalendarPicker from 'react-native-calendar-picker';

import { getT } from '../../utils/translateManager';

import { wehagoMainURL, wehagoDummyImageURL } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { add, last, parseInt } from 'lodash';
import LinearGradient from 'react-native-linear-gradient';

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

const ConferenceModfiyScreenPresenter = (props: any) => {
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
    changeIsNormal
  } = props;
  const t = getT();
  const DatePickerComponent = (
    <CalendarPicker
      weekdays={['일', '월', '화', '수', '목', '금', '토']}
      months={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
      previousTitle="<"
      nextTitle=">"
      minDate={new Date()}
      selectedStartDate={startTime.current}
      selectedDayTextColor="#fff"
      selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
      todayBackgroundColor="#febc2c"
      dayShape="square"
      scaleFactor={isHorizon ? 740 : isTablet ? 450 : 370}
      onDateChange={onDateChange}
      selectYearTitle={t('년도 선택')}
      selectMonthTitle={''}
      textStyle={{ fontSize: isTablet ? 18 : 14 }}
      disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
      previousTitleStyle={{ paddingLeft: '30%' }}
      nextTitleStyle={{ paddingRight: '30%' }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} onTouchStart={onFocusOut}>
      {dateTimeSeleted ? (
        <View style={styles.dimmed} />
      ) : (
        <Fragment>
          <View style={[styles.topTitle]}>
            <TouchableOpacity onPress={onHandleBack}>
              <Image source={icBack} style={styles.img24} resizeMode="cover" />
            </TouchableOpacity>
            <Text style={styles.TitleText}>
              {isNormal ? t('회의상세정보') : t('회의정보수정')}
            </Text>
            <TouchableOpacity
              disabled={textLess2 || !isAuth}
              onPress={
                isAuth
                  ? isNormal
                    ? changeIsNormal
                    : modifyConference
                  : () => {}
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
                    style={[styles.updateText, !textLess2 && { color: '#000' }]}
                  >
                    {t('수정')}
                  </Text>
                )
              ) : (
                <Fragment />
              )}
            </TouchableOpacity>
          </View>

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
                {isPublic ? t('공개 회의') : t('비공개 회의')}
              </Text>
              <Text style={styles.privateSubText}>
                {isPublic
                  ? t('공유 URL과 참여코드를 통해 초대 및 입장이 가능합니다.')
                  : t('지정된 참여자 이외엔 접속 불가능합니다.')}
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
                <Text style={styles.textHeader}>{t('회의명')}</Text>
                {isNormal ? (
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 20,
                      letterSpacing: -0.28
                    }}
                  >
                    {roomName}
                  </Text>
                ) : (
                  <Fragment>
                    <TextInput
                      onChangeText={roomNameChange}
                      value={roomName}
                      maxLength={20}
                      style={[
                        styles.roomNameStyle,
                        roomName && { borderColor: '#1c90fb' },
                        textLess2 && roomName && { borderColor: '#fc4c60' }
                      ]}
                      ref={titleRef}
                    />
                    <View
                      style={[
                        styles.countContainer,
                        textLess2 &&
                          roomName && { justifyContent: 'space-between' }
                      ]}
                    >
                      {textLess2 && roomName != '' && (
                        <Text
                          style={{
                            color: '#fc4c60',
                            fontSize: 12,
                            lineHeight: 17,
                            letterSpacing: -0.24
                          }}
                        >
                          {t('두글자 이상 입력해주세요.')}
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
                <Text style={styles.textHeader}>{t('초대메세지')}</Text>

                {isNormal ? (
                  <Text>{sendMessage}</Text>
                ) : (
                  <Fragment>
                    <TextInput
                      onChangeText={sendMessageChange}
                      value={sendMessage}
                      maxLength={200}
                      multiline
                      style={[
                        styles.sendStyle,
                        sendMessage && { borderColor: '#1c90fb' },
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
              <Text style={[styles.ft14B, { fontSize: 15 }]}>
                {t('예약회의')}
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
                  <Text style={{ fontSize: 15 }}>{t('시작시간')}</Text>
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
                        style={
                          datePicker === 'start' && {
                            color: 'rgb(28, 144, 251)'
                          }
                        }
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
                        style={
                          timePicker === 'start' && {
                            color: 'rgb(28, 144, 251)'
                          }
                        }
                      >
                        {`${startTime.time}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rowBetweenContainer}>
                  <Text style={{ fontSize: 15 }}>{t('종료시간')}</Text>
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
                        style={
                          datePicker === 'end'
                            ? { color: 'rgb(28, 144, 251)' }
                            : {}
                        }
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
                        style={
                          timePicker === 'end'
                            ? { color: 'rgb(28, 144, 251)' }
                            : {}
                        }
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
              <Text style={styles.ft14B}>{t('참석자')} </Text>
              <Text style={[styles.ft14B, { color: '#1c90fb' }]}>
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
                    ? t(
                        '화상회의가 변경 또는 삭제될 경우, 알림 이메일을 보냅니다.'
                      )
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
          )}

          <View style={{ flex: 1 }} pointerEvents={isNormal ? 'none' : 'auto'}>
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
                    <View
                      style={[
                        styles.profileView,
                        isTablet && { width: 46, height: 46 }
                      ]}
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
                          <Text style={styles.myText}>나</Text>
                        ) : isNormal ? (
                          <Fragment />
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              clickDeleteUser(item, index);
                            }}
                          >
                            <Image
                              source={icCancel_W}
                              style={styles.icCancelUser}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      <Image
                        style={styles.profile}
                        source={{
                          uri: item.profile_url
                        }}
                        resizeMode={'cover'}
                      />
                    </View>
                    <View
                      style={[styles.infoBox, isHorizon && { width: '70%' }]}
                    >
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
                            {t('마스터')}
                          </Text>
                          <Image
                            style={[
                              styles.icMaster,
                              isTablet && { width: 30, height: 30 }
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
                              isTablet && { width: 30, height: 30 }
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

      {(timePicker !== 'none' || datePicker !== 'none') && (
        <View
          style={[
            styles.bottomComponent,
            isHorizon && { width: '66%', left: '17%' }
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: '5%',
              marginBottom: '3%',
              paddingHorizontal: '4%'
            }}
          >
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
            <View
              style={{
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
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
    </SafeAreaView>
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
    fontWeight: '600',
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
    fontWeight: 'bold',
    color: '#000'
  },
  privateSubText: {
    fontSize: 12,
    color: 'rgb(147,147,147)',
    fontWeight: '600'
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
  ft14B: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000'
  },
  //중단
  roomContantContainer :{ backgroundColor: '#fff', height: '25%' },
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
    // color: '#000'
    color: '#939393'
  },
  roomNameStyle: {
    borderWidth: 1,
    paddingHorizontal: '3.5%',
    height: '67%',
    borderColor: '#E6E6E6',
    fontSize: 14,
    borderRadius: 10
  },
  sendStyle: {
    borderWidth: 1,
    paddingTop: '2%',
    paddingHorizontal: '3.5%',
    height: '60%',
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
  ft12: { fontSize: 12, color: '#000' },
  maxLength: {
    fontSize: 12,
    color: '#939393'
  },
  //예약회의
  reserveContainer: {
    paddingHorizontal: '5%',
    paddingVertical: 5,
    height: '6%'
  },
  datetimeBox: {
    width: '35%',
    fontSize: 15,
    alignItems: 'flex-end'
    // marginRight: 5,
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
  icMaster: { width: 20, height: 20 },
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
    fontWeight: '800',
    paddingLeft: '5%'
  },
  attendantText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.22,
    color: '#f49750',
    fontWeight: '800',
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
    fontWeight: 'bold'
  },
  name: {
    fontWeight: '500',
    fontSize: 15,
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
    fontWeight: '500'
  },
  bottomComponent: {
    position: 'absolute',
    backgroundColor: 'rgb(255,255,255)',
    bottom: 0,
    width: '100%',
    // height: '50%',
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
  graySplitBar: { backgroundColor: '#F7F8FA', height: 9 }
});

export default ConferenceModfiyScreenPresenter;