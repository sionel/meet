import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CreateMeetScreenPresenter from './CreateMeetScreenPresenter';
import OrganizationScreen from './OrganizationScreen';
// import OrganizationScreen from '../../components/Organization';

import { MeetApi, OrganizationApi } from '../../services';

import moment from 'moment';
import { getT } from '../../utils/translateManager';

// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

export default function CreateMeetScreenContainer(props: any) {
  const [switchAllSend, setSwitchAllSend] = useState(false);
  const [switchReserve, setSwitchReserve] = useState(false);
  const [switchDelAlram, setSwitchDelAlram] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  // const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [employee, setEmployee] = useState([{}]);

  const [roomName, setRoomName] = useState('');
  const [roomNameCnt, setRoomNameCnt] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [timePicker, setTimePicker] = useState<'none' | 'start' | 'end'>(
    'none'
  );
  const [datePicker, setDatePicker] = useState<'none' | 'start' | 'end'>(
    'none'
  );

  const [invited, setInvited] = useState([]);
  const [recents, setRecents] = useState([]);
  const [inviteText, setInviteText] = useState('');
  const [timeType, setTimeType] = useState('');

  //
  //

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
  const [date, setDate] = useState(new Date());

  const [email, setEmail] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState({
    member: {},
    group: {}
  });
  const [sendMessage, setSendMessage] = useState('');
  const [sendMsgCnt, setSendMsgCnt] = useState(0);
  const [participantList, setParticipantList] = useState<{}[]>([]);
  const [textLess2, setTextLess2] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { auth } = useSelector((state: any) => state.user);
  const t = getT();

  const dispatch = useDispatch();


  // const fadeIn = () => {
  //   // Will change fadeAnim value to 1 in 5 seconds
  //   Animated.timing(fadeAnim, {
  //     toValue: 1,
  //     duration: 5000,
  //     useNativeDriver: true
  //   }).start();
  // };

  // const fadeOut = () => {
  //   // Will change fadeAnim value to 0 in 3 seconds
  //   Animated.timing(fadeAnim, {
  //     toValue: 0,
  //     duration: 10000,
  //     useNativeDriver: true
  //   }).start();
  // };


  // const resetAni = () => {
  //   Animated.decay(animation, {
  //     velocity: 0.95,
  //     deceleration: 0.998,
  //     useNativeDriver: true
  //   }).start();
  // };
  // const runAni = () => {
  //   Animated.decay(animation, {
  //     velocity: 0.95,
  //     deceleration: 0.998,
  //     useNativeDriver: true
  //   }).start();
  // };
  // const getOrganization = async () => {
  //   const result = await OrganizationApi.getOrganizationTreeRequest(auth);
  //   if (result.error) {
  //     // Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
  //   } else {
  //     const organization = result.resultData[0];
  //     setorganization(organization);
  //   }
  // };

  const getAllEmployee = async () => {
    const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
      auth
    );
    if (result.error) {
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

  const startConference = async () => {
    if (1 < roomName.length) {
      let arr: any[] = [{}];
      arr.pop();
      participantList.map((values: any) => {
        if (values.user_no !== auth.user_no) {
          arr.push({
            type: 'email',
            value: values.user_default_email,
            is_master: false,
            user_name: values.user_name
          });
        }
      });

      let start_time = moment(parseInt(moment(startTime.current).format('x')));
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
        service_code: 'meetapp',
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
      if (result) {
        onHandleBack();
        clearInput();
      } else if (result.error) {
        console.log('error : ', result.error);
      }
    }
  };

  const clearInput = () => {
    setRoomName('');
    setSendMessage('');
    if (switchReserve) {
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
      setSwitchReserve(false);
    }
    setSwitchAllSend(false);
    setSwitchDelAlram(false);
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
    }
  };

  const openTimePicker = async (type: 'start' | 'end' | 'none') => {
    setDatePicker('none');
    if (timePicker === type) setTimePicker('none');
    else {
      setTimePicker(type);
      setTimeType(type);
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

  const onSwitchAllSendChange = () => {
    setSwitchAllSend(!switchAllSend);
  };
  const onSwitchReserveChange = (value: any) => {
    if (value) {
      const now = new Date();
      setStartTime(getDate(now));
      setEndTime(getDate(new Date(now)));
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

  const onDateChange = (date: any) => {
    let obj = getDate(new Date(date));

    if (timeType === 'start') setStartTime({ ...obj, time: startTime.time });
    else if (timeType === 'end') setEndTime({ ...obj, time: endTime.time });

    setTimePicker(datePicker);
    setDatePicker('none');
  };

  //시간 선택후 확인버튼 눌렀을때
  const onTimeConfirm = () => {
    let obj = getDate(time);
    let h = moment(obj.current).hours();
    let m = moment(obj.current).minutes();
    let DT;

    if (timeType === 'start') {
      startTime.current.setHours(0);
      startTime.current.setMinutes(0);

      DT = moment(startTime.current).add(h, 'h').add(m, 'm').toDate();

      setStartTime({
        ...obj,
        date: startTime.date,
        current: DT
      });
    } else if (timeType === 'end') {
      endTime.current.setHours(0);
      endTime.current.setMinutes(0);

      DT = moment(endTime.current).add(h, 'h').add(m, 'm').toDate();
      setEndTime({
        ...obj,
        date: endTime.date,
        current: DT
      });
    }
    setTimePicker('none');
  };

  useEffect(() => {
    setSelectMode(false);
    // getOrganization();
    getAllEmployee();
    setParticipantList([
      {
        user_name: auth.user_name,
        rank_name: auth.last_company.rank_name,
        profile_url: auth.profile_url,
        full_path: auth.last_company.full_path,
        user_no: auth.user_no
      }
    ]);
  }, []);

  const roomNameChange = (name: string) => {
    let rn = name;
    if (rn.length < 2) {
      setTextLess2(true);
    } else {
      setTextLess2(false);
    }
    setRoomName(rn);
    setRoomNameCnt(rn.length);
  };
  const sendMessageChange = (content: string) => {
    let msg = content;
    setSendMessage(msg);
    setSendMsgCnt(msg.length);
  };

  const onHandleBack = () => {
    props.navigation.goBack();
  };

  const focusBlur = () => {
    if (datePicker === 'start' || 'end') setDatePicker('none');
    if (timePicker === 'start' || 'end') setTimePicker('none');
  };

  return (
    <View style={{ flex: 1}}>
      {selectMode ? (
        <OrganizationScreen
          {...props}
          employee={employee}
          selectedEmployee={selectedEmployee}
          invited={invited}
          recents={recents}
          inviteText={inviteText}
          setSelectMode={setSelectMode}
          setSelectedEmployee={setSelectedEmployee}
          setInvited={setInvited}
          setInviteText={setInviteText}
          participantList={participantList}
          setParticipantList={setParticipantList}
        />
      ) : (
        <CreateMeetScreenPresenter
          roomName={roomName}
          isPublic={isPublic}
          datePicker={datePicker}
          timePicker={timePicker}
          startTime={startTime}
          endTime={endTime} // 여기서 시간 숫자인거 수정
          sendMessage={sendMessage}
          sendMessageChange={sendMessageChange}
          setSelectMode={setSelectMode}
          roomNameChange={roomNameChange}
          togglePublic={togglePublic}
          setDatePicker={setDatePicker}
          setTimePicker={setTimePicker}
          openTimePicker={openTimePicker}
          openDatePicker={openDatePicker}
          startConference={startConference}
          //신규Props
          switchAllSend={switchAllSend}
          switchReserve={switchReserve}
          switchDelAlram={switchDelAlram}
          onSwitchAllSendChange={onSwitchAllSendChange}
          onSwitchReserveChange={onSwitchReserveChange}
          onSwitchDelAlramChange={onSwitchDelAlramChange}
          roomNameCnt={roomNameCnt}
          sendMsgCnt={sendMsgCnt}
          onHandleBack={onHandleBack}
          onDateChange={onDateChange}
          onTimeConfirm={onTimeConfirm}
          time={time}
          setTime={setTime}
          auth={auth}
          participantList={participantList}
          textLess2={textLess2}
          timeType={timeType}
          focusBlur={focusBlur}
        />
      )}
    </View>
  );
}
