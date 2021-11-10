import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Switch,
} from 'react-native';

import DatePicker from 'react-native-date-picker';
// import Autocomplete from 'react-native-autocomplete-input';
import CalendarPicker from 'react-native-calendar-picker';

import { getT } from '../../utils/translateManager';
import { CustomIcon } from '../../components';

import { wehagoMainURL, wehagoDummyImageURL } from '../../utils';
// import { SafeAreaView } from 'react-navigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { last } from 'lodash';

const ic_code = require('../../../assets/new/icons/ic_code.png');
const ic_lock = require('../../../assets/new/icons/ic_lock_wh.png');
const ic_person_plus = require('../../../assets/new/icons/ic_person_plus.png');
const ic_master = require('../../../assets/new/icons/ic_master.png');

// 알림 생성 칸이 있는데 이건 삭제
// 왜냐 이 앱은 노티를 못보내기 때문

const CreateMeetScreenPresenter = (props: any) => {
  const {
    employee,
    roomName,
    isPublic,
    timeType,
    startTime,
    endTime,
    timePicker,
    datePicker,
    email,
    selectedEmployee,
    sendMessage,
    setSelectMode,
    setRoomName,
    roomNameChange,
    togglePublic,
    openTimePicker,
    openDatePicker,
    // onSelectDate,
    // onSelectTime,
    setEmail,
    setSendMessage,
    sendMessageChange,
    startConference,
    //신규Props
    switchAlram,
    switchReserve,
    switchDelAlram,
    onSwitchAlramChange,
    onSwitchReserveChange,
    onSwitchDelAlramChange,
    setStartTime,
    roomNameCnt,
    sendMsgCnt,
    onHandleBack,
    onDateChange,
    onTimeConfirm,
    date,
    setDate,
    time,
    setTime,
    auth
  } = props;
  const t = getT();
  
  const TimePickerComponent = (
    <View
      style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}></View>
        <Text
          style={{
            flex: 1,
            textAlign: 'center',
            alignItems: 'center',
            fontSize: 24,
            fontWeight: 'bold'
          }}
        >
          {'시간설정'}
        </Text>
        <TouchableOpacity
          onPress={() => onTimeConfirm()}
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginRight: 20,
              color: '#1C90FB',
              fontWeight: 'bold'
            }}
          >
            {'완료'}
          </Text>
        </TouchableOpacity>
      </View>
      <DatePicker onDateChange={setTime} mode={'time'} date={time} />
    </View>
  );

  const DatePickerComponent = (
    <CalendarPicker
      weekdays={['일', '월', '화', '수', '목', '금', '토']}
      months={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']}
      previousTitle="<"
      nextTitle=">"
      minDate={timeType === 'end' ? startTime.current : undefined}
      dayShape="square"
      scaleFactor={400}
      selectedDayTextColor="#fff"
      selectedDayStyle={{ borderRadius: 5, backgroundColor: '#1c90fb' }}
      onDateChange={onDateChange}
      selectYearTitle={'년도 선택'}
      selectMonthTitle={''}
      textStyle={{ fontSize: 14 }}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <ScrollView contentContainerStyle={[{ flex: 1, minHeight: 813 }]}> */}
        <View style={styles.topTitle}>
          <TouchableOpacity onPress={onHandleBack}>
            <Text style={styles.ft14N}>{t('취소')}</Text>
          </TouchableOpacity>
          <Text style={styles.TitleText}>{t('회의 생성하기')}</Text>
          <TouchableOpacity onPress={startConference}>
            <Text style={styles.ft14N}>{t('생성')}</Text>
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 1, backgroundColor: '#fff' }]}>
          <View style={styles.privateContainer}>
            <View
              style={[
                styles.codeContainer,
                !isPublic && { backgroundColor: '#1c90fb' }
              ]}
            >
              <TouchableOpacity onPress={togglePublic}>
                <Image
                  source={isPublic ? ic_code : ic_lock}
                  style={styles.icCode}
                />
              </TouchableOpacity>
            </View>
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
          </View>

          <View style={{ backgroundColor: '#F7F8FA', flex: 0.01 }} />
          {isPublic && (
            <>
              <View style={styles.alramContainer}>
                <Text style={styles.ft12}>
                  {t('모든 조직 구성원에게 해당 회의정보 알림을 보냅니다.')}
                </Text>
                <Switch
                  onValueChange={onSwitchAlramChange}
                  value={switchAlram}
                  trackColor={{ false: '', true: '#1c90fb' }}
                />
              </View>
            </>
          )}
          <View style={{ backgroundColor: '#F7F8FA', flex: 0.02 }} />
          <View style={styles.middleContainer}>
            <View style={styles.directionCol}>
              <Text style={styles.textHeader}>{t('회의명')}</Text>
              <TextInput
                onChangeText={roomNameChange}
                value={roomName}
                maxLength={20}
                style={styles.roomNameStyle}
              />
              <View style={styles.countContainer}>
                <Text style={styles.ft12}>{roomNameCnt}</Text>
                <Text style={styles.maxLength}>/20</Text>
              </View>
            </View>
            <View style={styles.directionCol}>
              <Text style={styles.textHeader}>{t('초대메세지')}</Text>
              <TextInput
                onChangeText={sendMessageChange}
                value={sendMessage}
                maxLength={200}
                multiline
                style={[styles.sendStyle, !isPublic && { height: 100 }]}
              />
              <View style={styles.countContainer}>
                <Text style={styles.ft12}>{sendMsgCnt}</Text>
                <Text style={styles.maxLength}>/200</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[{ flex: 1, backgroundColor: '#fff' }]}>
          <View style={styles.graybar1} />
          <View
            style={[
              styles.reserveContainer,
              switchReserve && { flex: 0.6, marginTop: 5 }
            ]}
          >
            <View
              style={[
                {
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }
              ]}
            >
              <Text style={styles.ft14B}>{t('예약회의')}</Text>
              <Switch
                onValueChange={onSwitchReserveChange}
                value={switchReserve}
                trackColor={{ false: '', true: '#1c90fb' }}
              />
            </View>
            {switchReserve && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{t('시작시간')}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[
                        styles.datetimeBox,
                        datePicker === 'start' && {
                          borderColor: 'rgb(28, 144, 251)'
                        }
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
                        }
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
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }
                  ]}
                >
                  <Text style={{ fontSize: 15 }}>{t('종료시간')}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={[
                        styles.datetimeBox,
                        datePicker === 'end'
                          ? { borderColor: 'rgb(28, 144, 251)' }
                          : {}
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
                        timePicker === 'end'
                          ? { borderColor: 'rgb(28, 144, 251)' }
                          : {}
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

                {/* <View
                      style={[
                        {
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: 'rgb(255,255,255)'
                        }
                      ]}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {t('시간')}
                      </Text>
                      <DatePicker
                        date={startTime.current}
                        mode={'time'}
                        style={{ width: 150, height: 120 }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 2.7,
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        marginTop: '1%'
                      }}
                    >
                      {openDatePickerComponent('start')}
                    </View> */}

                {/* <View
                      style={[
                        {
                          flexDirection: 'row',
                          flex: 1,
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }
                      ]}
                    >
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                        {t('시간')}
                      </Text>
                      <DatePicker
                        date={endTime.current}
                        mode={'time'}
                        style={{ width: 150, height: 120 }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 2.7,
                        paddingLeft: '5%',
                        paddingRight: '5%',
                        marginTop: '1%'
                      }}
                    >
                      {openDatePickerComponent('end')}
                    </View> */}
              </>
            )}
          </View>
          <View style={styles.graybar1} />
          <View style={[styles.botContainer]}>
            <View style={styles.conferenceMember}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.ft14B}>{t('참석자')} </Text>
                <Text style={[styles.ft14B, { color: '#1c90fb' }]}>1</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectMode(true)}>
                <Image source={ic_person_plus} style={styles.icPersonPlus} />
              </TouchableOpacity>
            </View>
            <View style={styles.deleteAlram}>
              <View>
                <Text
                  style={[
                    styles.ft12,
                    { letterSpacing: -0.18, lineHeight: 18 }
                  ]}
                >
                  {
                    '화상회의가 변경 또는 삭제될 경우, \n알림 이메일을 보냅니다.'
                  }
                </Text>
              </View>

              <Switch
                onValueChange={onSwitchDelAlramChange}
                value={switchDelAlram}
                trackColor={{ false: '', true: '#1c90fb' }}
              />
            </View>
            <FlatList
              contentContainerStyle={{ flex: 1, paddingLeft: '5%', paddingRight: '5%'}}
              data={[
                { image: wehagoMainURL + auth.profile_url, name: `${auth.user_name} ${auth.last_company.rank_name}`, full_path: auth.last_company.full_path },
              ]}
              // data={Object.values(selectedEmployee.member)}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item, index }) => {
                // const { user, user_name, user_type, profile_url } = item;
                console.log(item);
                return (
                  <View style={styles.participantList}>
                    <Image
                      style={styles.profile}
                      source={{ uri: item.image }}
                      resizeMode={'cover'}
                    />
                    <View style={styles.infoBox}>
                      <Text style={styles.name}>{item.name}</Text>
                      <View style={{overflow:'scroll'}}>
                        <Text style={styles.tree}>{item.full_path}</Text>
                      </View>
                    </View>
                    <View style={styles.masterContainer}>
                      <Image
                        style={{ width: '25%', height: 20 }}
                        source={ic_master}
                        resizeMode={'contain'}
                      />
                      <Text style={styles.maseterText}>{t('마스터')}</Text>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      {/* </ScrollView> */}
      {(timePicker !== 'none' || datePicker !== 'none') && <View
        style={{
          position: 'absolute',
          backgroundColor: 'rgb(255,255,255)',
          bottom: 0,
          width: '100%',
          borderRadius: 20,
          shadowRadius: 10,
          shadowColor: '#aaa',
          shadowOpacity: 10,
          borderWidth: 1,
          paddingBottom: '5%'
        }}
      >
        {timePicker !== 'none' && TimePickerComponent}
        {datePicker !== 'none' && DatePickerComponent}
      </View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
    // backgroundColor: 'red'
    // justifyContent:'flex-start'
  },
  //상단
  topTitle: {
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '6%',
    backgroundColor: '#fff'
  },
  TitleText: {
    fontSize: 18,
    fontWeight: '600'
  },
  privateContainer: {
    flex: 0.2,
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    // backgroundColor: 'blue'
  },
  privateTextContainer: {
    flexDirection: 'column',
    paddingLeft: '3%'
  },
  privateMainText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  privateSubText: {
    fontSize: 12,
    color: 'rgb(147,147,147)',
    fontWeight: 'bold'
  },
  alramContainer: {
    flex: 0.2,
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // backgroundColor: 'green'
  },
  ft14N: {
    fontSize: 14,
    fontWeight: 'normal'
  },
  ft14B: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  //중단
  directionCol: {
    flexDirection: 'column'
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  textHeader: {
    fontSize: 12,
    marginBottom: 5
  },
  roomNameStyle: {
    borderWidth: 1,
    paddingLeft: '5%',
    paddingRight: '5%',
    height: 44,
    borderColor: '#E6E6E6',
    fontSize: 14
  },
  sendStyle: {
    borderWidth: 1,
    paddingLeft: '5%',
    paddingRight: '5%',
    height: 84,
    letterSpacing: -0.28,
    borderColor: '#E6E6E6',
    fontSize: 14,
    lineHeight: 20
  },
  countContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: 5
  },
  ft12: { fontSize: 12 },
  maxLength: {
    fontSize: 12,
    color: '#939393'
  },
  //예약회의
  reserveContainer: {
    paddingLeft: '5%',
    paddingRight: '5%',
    flex: 0.2
  },
  datetimeBox: {
    fontSize: 15,
    alignItems: 'center',
    marginRight: 5
  },
  //하단
  botContainer: {
    flex: 1.4
  },
  deleteAlram: {
    flex: 0.3,
    backgroundColor: '#e9f5ff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  conferenceMember: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  //이미지(ic_code)
  codeContainer: {
    width: 32,
    height: 32,
    backgroundColor: 'rgb(93, 93, 255)',
    borderRadius: 15,
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
  masterContainer: {
    flexDirection: 'row',
    backgroundColor: '#febc2c',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '17%',
    borderRadius: 15
  },
  maseterText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.22,
    color: '#fff',
    fontWeight:'800'
  },
  graybar1: {
    backgroundColor: '#F7F8FA',
    height: '1%'
  },
  PMON: {
    backgroundColor: 'white',
    flex: 5.1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopStartRadius: 5,
    borderBottomStartRadius: 5
  },
  AMON: {
    backgroundColor: '#e6e6e6',
    flex: 4.9,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5
  },
  //#region 이전 스타일
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center'
  },
  createRoomContainer: {
    width: '100%',
    justifyContent: 'flex-start'
  },
  line: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    width: '100%'
  },
  publicContainer: {
    backgroundColor: '#1C90FB',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  publicTexts: {},
  public: {
    color: '#0df',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  publicSubText: {
    fontSize: 14
  },
  nameContainer: {
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'space-around'
  },
  conferenceName: {
    fontSize: 16,
    paddingVertical: 3
  },
  nameInput: {
    // width:'100%',
    fontSize: 16,
    // borderBottomWidth:1,
    // borderBottomColor:'#ccc',
    paddingVertical: 3
  },
  necessary: {
    position: 'absolute',
    left: 54,
    top: 6,
    color: '#f00',
    fontSize: 24
  },
  reservationContainer: {
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  openReservation: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  reservationTexts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reservationTitle: {
    fontSize: 16,
    paddingVertical: 5
  },
  closeReservation: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  reservationSubTitle: {
    fontSize: 16,
    paddingVertical: 5,
    justifyContent: 'flex-start',
    width: '100%'
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
    alignItems: 'center',
    height: 25
  },
  timeText: {
    fontSize: 15,
    width: '20%'
  },

  messageContainer: {
    padding: 15
  },
  messageHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageTitle: {
    fontSize: 16,
    paddingVertical: 5
  },
  messageByte: { flexDirection: 'row' },
  nowByte: { color: '#1C90FB', fontWeight: 'bold' },
  byteLimit: {},
  message: { maxHeight: 150 },
  participantsContainer: {
    padding: 10
  },
  participantsHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  participantsTitle: {
    fontSize: 16,
    paddingVertical: 5
  },
  count: {
    color: '#1C90FB',
    fontWeight: 'bold'
  },
  sendNotification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 3,
    backgroundColor: '#eee',
    width: '100%'
  },
  notiInfo: {},
  participantList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    paddingTop: '1%',
    paddingBottom: '1%',
  },
  profile: {
    width: '12%',
    height: 40,
    borderRadius: 25
  },
  infoBox: { width: '67%' },
  name: {
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: -0.3,
    paddingBottom: '0.5%'
  },
  tree: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.24,
    color: '#939393',
    fontWeight: '500'
  },
  identity: {
    width: '20%',
    height: 30
  },
  delete: {
    width: '10%',
    height: 30
  }
  // presenter: {
  //   width: '80%',
  //   // backgroundColor: '#0ff',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   zIndex: 2
  // },
  // rowContainer: {
  //   width: '100%',
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   alignContent: 'center',
  //   justifyContent: 'flex-start',
  //   marginVertical: 6
  //   // backgroundColor:'#0f0'
  // },
  // rowTitle: { width: '30%', fontSize: 15, fontWeight: 'bold' },
  // inputTitle: {
  //   borderWidth: 1,
  //   width: '70%',
  //   fontSize: 15,
  //   padding: 3,
  //   backgroundColor: 'white'
  // },
  // rowContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginVertical: 3
  // },
  // timeBox: { borderWidth: 1, borderColor: '#000', padding: 3 },

  // itemText: {
  //   fontSize: 15,
  //   margin: 2
  //   // borderWidth: 1,
  //   // borderColor: '#777'
  // },
  // inputContainerStyle: {
  //   borderRadius: 0,
  //   borderWidth: 0
  // },
  // listContainerStyle: {
  //   backgroundColor: '#f02',
  //   padding: 1
  // }
  //#endregion
});

export default CreateMeetScreenPresenter;
