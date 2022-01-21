import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CreateMeetScreenPresenter from './CreateMeetScreenPresenter';
import OrganizationScreen from './OrganizationScreen';

import { MeetApi, OrganizationApi } from '@services/index';

import moment from 'moment';
import { getT } from '@utils/translateManager';
import { RootState } from '../../redux/configureStore';
import deviceInfoModule from 'react-native-device-info';
import { wehagoMainURL } from '@utils/index';
import { MainNavigationProps } from '@navigations/MainStack';

import _ from 'lodash';

interface param {
  type: 'portal_id' | 'email';
  value: string;
  is_master: boolean;
  user_name: string;
  cno: number;
  user_no: number;
}

type PartialParam = Partial<param>;

export default function CreateMeetScreenContainer(props: any) {
  const { auth, isHorizon } = useSelector((state: any) => ({
    auth: state.user.auth,
    isHorizon: state.orientation.isHorizon
  }));

  const { navigation }: MainNavigationProps<'DirectCreateConference'> = props;

  const [switchReserve, setSwitchReserve] = useState(false);
  const [switchDelAlram, setSwitchDelAlram] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [employee, setEmployee] = useState([{}]);
  const [roomName, setRoomName] = useState('');

  const [isPublic, setIsPublic] = useState(true);
  const [timePicker, setTimePicker] = useState<'none' | 'start' | 'end'>(
    'none'
  );
  const [datePicker, setDatePicker] = useState<'none' | 'start' | 'end'>(
    'none'
  );
  const [timeType, setTimeType] = useState('');
  const [startTime, setStartTime] = useState({
    date: '',
    time: '',
    current: new Date()
  });
  const [endTime, setEndTime] = useState({
    date: '',
    time: '',
    current: new Date()
  });
  const [time, setTime] = useState(new Date());
  const [timeChangeDetect, setTimeChangeDetect] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState({
    member: [
      {
        user_name: auth.user_name,
        rank_name: auth.last_company.rank_name,
        profile_url: wehagoMainURL + auth.profile_url,
        full_path: auth.last_company.full_path,
        user_no: auth.user_no,
        is_master: true
      }
    ],
    group: {}
  });
  const [sendMessage, setSendMessage] = useState('');

  const [textLess2, setTextLess2] = useState(true);
  const [isOrgDataLoaded, setIsOrgDataLoaded] = useState(false);
  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [contacts, setContacts] = useState<{ title: string; data: Object }[]>(
    []
  );
  const [dateTimeSeleted, setDateTimeSeleted] = useState(false);
  const [calendarError, setCalendarError] = useState(false);
  const [nameList, setNameList] = useState<string[]>([]);
  const [nameduplication, setNameDuplication] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const titleRef: RefObject<any> = useRef();
  const sendMsgRef: RefObject<any> = useRef();
  const searchRef: RefObject<any> = useRef();
  const sendEmailRef: RefObject<any> = useRef();
  const t = getT();

  const isTablet = deviceInfoModule.isTablet() === true;

  const getAllEmployee = async (signal: AbortSignal) => {
    const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
      auth,
      signal
    );
    if (result.error) {
      console.log('조직정보를 가져올 수 없습니다.');
      // Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
    } else {
      const company = result;

      const hangleMapper = company.reduce((acc: any, i: any) => {
        const charCode = i.user_name.charCodeAt(0);
        let charIndex;
        if (
          charCode >= parseInt('0xac00', 16) &&
          charCode <= parseInt('0xd7af', 16)
        ) {
          const hangle =
            (charCode - parseInt('0xac00', 16)) / 28 / 21 +
            parseInt('0x1100', 16);
          charIndex = String.fromCharCode(hangle);
        } else {
          charIndex = String.fromCharCode(charCode);
        }

        if (acc.has(charIndex)) {
          acc.set(charIndex, [...acc.get(charIndex), i]);
        } else {
          acc.set(charIndex, [i]);
        }
        return acc;
      }, new Map());
      let obj: any = Array.from(hangleMapper).reduce(
        (obj, [key, value]: any) => {
          return Object.assign(obj, { [key]: value });
        },
        {}
      );

      const employee = Object.keys(obj).map(key => ({
        title: key,
        data: obj[key]
      }));

      employee.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      setEmployee(employee);
    }
  };

  //조직도 초기화
  const getOrganizationTree = async (signal: AbortSignal) => {
    const result = await OrganizationApi.getOrganizationTreeRequest(
      auth,
      signal
    );
    if (result.error) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      // 조직도 조회 안됨 에러 표현
      console.log('조직도를 가져올 수 없습니다.');
      // 생성화면으로 Back
    } else {
      const organization = result[0];
      setorganization(organization);
    }
  };

  //연락처 초기화
  const getContactsList = async (signal: AbortSignal) => {
    // 최적화 하려면 여기 코드를 상위로 옮기자
    const result = await OrganizationApi.getContactsList(auth, signal);
    if (result.error || !result) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      console.log('연락처를 가져올 수 없습니다.');

      //   props.navigation.pop();
      // 생성하기 화면으로
    } else {
      const chocungList: { dataindex: number; word: string }[] =
        result.chosungList;
      const indexList: any[] = [];
      type secction = { title: string; data: object[] }[];
      let arr: secction = [];
      chocungList.forEach(({ word }) => {
        arr.push({ title: word, data: [] });
        indexList.push(word);
      });

      const contactsList = [...result.contactsList];

      contactsList.forEach(item => {
        const index = indexList.indexOf(item.word);
        arr[index].data.push(item);
      });
      setContacts(arr);
    }
  };

  const createConference = async () => {
    if (nameduplication) {
      Alert.alert(t('회의명 중복'), t('회의명 변경 후 방 생성을 해주세요.'));
      return;
    } else {
      if (1 < roomName.length) {
        setIsLoading(true);
        let arr: PartialParam[] = [];
        selectedEmployee.member.map((value: any) => {
          // type에 따라 access_user에 받는게 다름
          // type: portal_id, email
          if (value.user_no !== auth.user_no) {
            if (value.user_no) {
              arr.push({
                type: 'portal_id',
                value: value.portal_id,
                is_master: value.is_master,
                user_name: value.user_name
              });
            } else {
              if (value.address_service_no) {
                arr.push({
                  type: 'email',
                  value: value.emailinfolist[0].email_address,
                  is_master: value.is_master,
                  user_name: value.address_name
                });
              } else {
                arr.push({
                  type: 'email',
                  value: value.value,
                  is_master: false
                });
              }
            }
          }
        });

        let start_time = moment(
          parseInt(moment(startTime.current).format('x'))
        );
        let end_time = moment(parseInt(moment(endTime.current).format('x')));

        const { cno } = auth;

        arr.unshift({
          type: 'portal_id',
          value: auth.portal_id,
          is_master: true,
          user_name: auth.user_name,
          cno: cno,
          user_no: auth.user_no
        });

        let params: {
          service_code: string;
          name: string;
          is_public: boolean;
          access_user: any;
          is_send_updated_email: boolean;
          is_reservation: boolean;
          call_type: string;
          invite_message: string;
          start_date_time?: any;
          end_date_time?: any;
        } = {
          service_code: 'wehagomeet',
          name: roomName,
          is_public: isPublic,
          access_user: arr,
          is_send_updated_email: switchDelAlram,
          is_reservation: switchReserve,
          call_type: '1',
          invite_message: sendMessage
        };

        if (switchReserve) {
          let object = params;
          params = {
            ...object,
            start_date_time: start_time,
            end_date_time: end_time
          };
        }

        const result = await MeetApi.createMeetRoom(auth, params);
        setIsLoading(false);
        if (result) {
          onHandleBack();
          // clearInput();
        } else if (result.error) {
          console.log('error : ', result.error);
        }
      }
    }
  };

  // const clearInput = () => {
  //   setRoomName('');
  //   setSendMessage('');
  //   if (switchReserve) {
  //     setStartTime({
  //       date: '',
  //       time: '',
  //       current: new Date()
  //     });
  //     setEndTime({
  //       date: '',
  //       time: '',
  //       current: new Date()
  //     });
  //     setSwitchReserve(false);
  //   }
  //   setSwitchDelAlram(false);
  // };

  //예약회의 기본값 설정
  const onSwitchReserveChange = (reserve: boolean) => {
    if (reserve) {
      let start_default = new Date();
      start_default.setMinutes(start_default.getMinutes() + 30);

      let end_default = new Date(start_default);
      end_default.setHours(end_default.getHours() + 1);

      setStartTime(getDate(start_default));
      setEndTime(getDate(end_default));
    } else {
      setStartTime({
        date: '',
        time: '',
        current: new Date()
      });
      setEndTime({
        date: '',
        time: '',
        current: new Date()
      });
      openDatePicker('none');
      openTimePicker('none');
    }

    setSwitchReserve(!switchReserve);
  };

  const onSwitchDelAlramChange = () => {
    setSwitchDelAlram(!switchDelAlram);
  };

  const togglePublic = () => {
    setIsPublic(!isPublic);
  };

  const openDatePicker = async (type: 'start' | 'end' | 'none') => {
    setTimePicker('none');
    if (datePicker === type) setDatePicker('none');
    else {
      setDatePicker(type);
      setTimeType(type);
      setDateTimeSeleted(true);
    }
  };

  const openTimePicker = async (type: 'start' | 'end' | 'none') => {
    setDatePicker('none');
    if (timePicker === type) setTimePicker('none');
    else {
      setTimePicker(type);
      setTimeType(type);
      setDateTimeSeleted(true);
    }
  };

  const getDate = (date: Date) => {
    let obj = {
      date: `${date.getFullYear()}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`,
      time: `${date.getHours() >= 12 ? '오후' : '오전'} ${(date.getHours() >= 12
        ? date.getHours() - 12
        : date.getHours()
      )
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
      current: date
    };
    return obj;
  };

  const onDateChange = (date: any) => {
    let obj = getDate(new Date(date));
    let current = obj.current;
    if (timeType === 'start') {
      current.setHours(startTime.current.getHours());
      current.setMinutes(startTime.current.getMinutes());
      setStartTime({
        ...obj,
        time: startTime.time
      });
    } else if (timeType === 'end') {
      current.setHours(endTime.current.getHours());
      current.setMinutes(endTime.current.getMinutes());
      setEndTime({
        ...obj,
        time: endTime.time
      });
    }

    setTimePicker(datePicker);
    setDatePicker('none');
  };

  const timeChange = (time: any) => {
    setTimeChangeDetect(true);
    setTime(time);
  };

  //시간 선택후 확인버튼 눌렀을때
  const onTimeConfirm = () => {
    let obj: any;

    if (timeChangeDetect) {
      obj = getDate(time);
    } else {
      if (timeType === 'start') obj = getDate(startTime.current);
      else if (timeType === 'end') obj = getDate(endTime.current);
    }

    let current = obj.current;

    let today = moment(new Date()).add(29, 'minutes');

    if (current < today) {
      Alert.alert(
        t('renewal.direct_time_set_error'),
        t('renewal.direct_time_early_error')
      );
      setTime(today.add(1, 'minutes').toDate());
      return false;
    } else if (current < startTime.current) {
      Alert.alert(
        t('renewal.direct_time_set_error'),
        t('renewal.direct_time_before_error')
      );
      setTime(moment(startTime.current).add(30, 'minutes').toDate());
      setTimePicker('none');
      setCalendarError(true);
      setDatePicker(timePicker);
      return false;
    }

    let start_DT, end_DT;
    let h = moment(current).hours();
    let m = moment(current).minutes();

    if (timeType === 'start') {
      startTime.current.setHours(h);
      startTime.current.setMinutes(m);
      start_DT = moment(startTime.current).toDate();
      setStartTime({
        ...obj,
        date: startTime.date,
        current: start_DT
      });

      obj = getDate(moment(startTime.current).add(1, 'hours').toDate());
      setEndTime(obj);
    } else if (timeType === 'end') {
      endTime.current.setHours(h);
      endTime.current.setMinutes(m);
      end_DT = moment(endTime.current).toDate();
      setEndTime({
        ...obj,
        date: endTime.date,
        current: end_DT
      });
      setCalendarError(false);
    }

    setTimePicker('none');
    setDateTimeSeleted(false);
    setTimeChangeDetect(false);
  };

  const dataLoad = (signal: AbortSignal) => {
    setIsOrgDataLoaded(true);

    Promise.all([
      getAllEmployee(signal),
      getOrganizationTree(signal),
      getContactsList(signal)
    ]).then(() => {
      setIsOrgDataLoaded(false);
    });
  };

  const getRoomNames = async () => {
    const roomNames = MeetApi.getMeetRoomsList(auth).then(async result => {
      const going: any[] = result;
      let nameList: string[] = [];
      await Promise.all(
        going.map(async conference => {
          nameList.push(conference.name);
        })
      );
      return nameList;
    });

    setNameList(await roomNames);
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    getRoomNames();
    dataLoad(signal);
    return () => {
      setIsOrgDataLoaded(false);
      controller.abort();
    };
  }, []);

  const roomNameChange = (name: string) => {
    let rn = name;
    if (rn.length < 2) {
      setTextLess2(true);
    } else {
      setTextLess2(false);
    }
    setRoomName(rn);
  };

  const sendMessageChange = (content: string) => {
    let msg = content;
    setSendMessage(msg);
  };

  const onHandleBack = () => {
    navigation.goBack();
  };

  const onFocusOut = () => {
    if (sendMsgRef.current?.isFocused()) sendMsgRef.current.blur();
    else if (titleRef.current?.isFocused()) titleRef.current.blur();
    else if (searchRef.current?.isFocused()) searchRef.current.blur();
    else if (sendEmailRef.current?.isFocused()) sendEmailRef.current.blur();
  };

  const exitDateTime = () => {
    if (datePicker === 'start' || 'end') {
      setDatePicker('none');
    }
    if (timePicker === 'start' || 'end') {
      setTimePicker('none');
    }

    setDateTimeSeleted(false);
  };

  const clickChangeRole = (item: any) => {
    const resList: any[] = [];

    const updateList: any[] = selectedEmployee.member;
    let idx: number = updateList.findIndex(
      (i: any) => i.user_no === item.user_no
    );
    updateList[idx].is_master = !updateList[idx].is_master;

    const partListUserNoOrderList: any[] = updateList.sort((a: any, b: any) => {
      return a.user_no === auth.user_no ? -3 : b.is_master - a.is_master;
    });

    partListUserNoOrderList.map(v => resList.push(v));
    setSelectedEmployee({ member: resList, group: {} });

    // const roomMaster: any[] = updateList[0];
    // resList.push(roomMaster);

    // const userList: any[] = updateList.filter((v: any, i: number) => i !== 0);

    // 마스터권한 정렬
    // const masterList: any[] = userList.filter(
    //   (v: any, i) => v.is_master === true
    // );
    // const masterUserNoOrderList: any[] = masterList.sort((a: any, b: any) => {
    //   return a.user_no - b.user_no;
    // });
    // masterUserNoOrderList.map(v => resList.push(v));

    // const partList: any[] = userList.filter(
    //   (v: any, i) => v.is_master !== true
    // );
  };

  const clickDeleteUser = (item: any) => {
    let deletedList: any[] = selectedEmployee.member;
    let idx: number = 0;

    if (item.user_no) {
      idx = deletedList.findIndex((i: any) => i.user_no === item.user_no);
    } else if (item.address_service_no) {
      idx = deletedList.findIndex(
        (i: any) => i.address_service_no === item.address_service_no
      );
    } else if (item.value) {
      idx = deletedList.findIndex((i: any) => i.value === item.value);
      // const invitedList: { type: string; value: string }[] = invited;
      // const invitedIndex: number = invitedList.findIndex(
      //   (i: any) => i.value === item.value
      // );
      // if (invitedIndex !== -1) {
      //   const deletedList: any[] = invitedList.filter(
      //     (v: any, i: number) => i !== invitedIndex
      //   );
      //   setInvited([...deletedList]);
      // }
    } else {
      console.log('error');
    }
    const updateList: any[] = deletedList.filter((v, i) => i !== idx);
    setSelectedEmployee({ member: updateList, group: {} });
  };

  const handleBlurTitleInput = (
    e: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    const { text } = e.nativeEvent;
    const flag: boolean =
      nameList.findIndex(value => value === text) === -1 ? false : true;
    setNameDuplication(flag);
  };

  return (
    <View
      style={[
        { flex: 1, backgroundColor: '#F7F8FA' },
        isHorizon && { paddingHorizontal: '17%' }
      ]}
      onTouchStart={onFocusOut}
    >
      {selectMode ? (
        <OrganizationScreen
          {...props}
          employee={employee}
          selectedEmployee={selectedEmployee}
          // invited={invited}
          // recents={recents}
          // inviteText={inviteText}
          setSelectMode={setSelectMode}
          setSelectedEmployee={setSelectedEmployee}
          // setInvited={setInvited}
          // setInviteText={setInviteText}
          // participantList={participantList}
          // setParticipantList={setParticipantList}
          organization={organization}
          isOrgDataLoaded={isOrgDataLoaded}
          contacts={contacts}
          isTablet={isTablet}
          searchRef={searchRef}
          sendEmailRef={sendEmailRef}
        />
      ) : (
        <CreateMeetScreenPresenter
          roomName={roomName}
          isPublic={isPublic}
          datePicker={datePicker}
          timePicker={timePicker}
          startTime={startTime}
          endTime={endTime}
          sendMessage={sendMessage}
          sendMessageChange={sendMessageChange}
          setSelectMode={setSelectMode}
          roomNameChange={roomNameChange}
          togglePublic={togglePublic}
          openTimePicker={openTimePicker}
          openDatePicker={openDatePicker}
          createConference={createConference}
          //신규Props
          switchReserve={switchReserve}
          switchDelAlram={switchDelAlram}
          onSwitchReserveChange={onSwitchReserveChange}
          onSwitchDelAlramChange={onSwitchDelAlramChange}
          onHandleBack={onHandleBack}
          onDateChange={onDateChange}
          onTimeConfirm={onTimeConfirm}
          time={time}
          auth={auth}
          textLess2={textLess2}
          timeType={timeType}
          sendMsgRef={sendMsgRef}
          titleRef={titleRef}
          onFocusOut={onFocusOut}
          timeChangeDetect={timeChangeDetect}
          timeChange={timeChange}
          exitDateTime={exitDateTime}
          clickChangeRole={clickChangeRole}
          clickDeleteUser={clickDeleteUser}
          selectedEmployee={selectedEmployee}
          isHorizon={isHorizon}
          isTablet={isTablet}
          dateTimeSeleted={dateTimeSeleted}
          calendarError={calendarError}
          handleBlurTitleInput={handleBlurTitleInput}
          nameduplication={nameduplication}
          isLoading={isLoading}
        />
      )}
    </View>
  );
}
