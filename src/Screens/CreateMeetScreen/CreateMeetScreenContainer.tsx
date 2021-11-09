import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, Animated, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CreateMeetScreenPresenter from './CreateMeetScreenPresenter';

import DeviceInfo from 'react-native-device-info';
import { getT } from '../../utils/translateManager';
import OrganizationScreen from '../../components/Organization';

import { OrganizationApi, MeetApi } from '../../services';

import { actionCreators } from '../../redux/modules/alert';
import moment, { calendarFormat } from 'moment';

// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

export default function CreateMeetScreenContainer(props: any) {
  const [switchAlram, setSwitchAlram] = useState(false);
  const [switchReserve, setSwitchReserve] = useState(false);
  const [switchDelAlram, setSwitchDelAlram] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [employee, setEmployee] = useState([]);

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

  const fadeAnim = useRef(new Animated.ValueXY()).current;

  const { auth } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const resetAni = () => {
    Animated.spring(fadeAnim, {
      toValue: {
        x: 0,
        y: height
      },
      tension: 500,
      friction: 500,
      useNativeDriver: true
    }).start();
  };
  const runAni = () => {
    Animated.spring(fadeAnim, {
      toValue: {
        x: 0,
        y: 0
      },
      useNativeDriver: true,
      tension: 500,
      friction: 500
    }).start();
  };
  const getOrganization = async () => {
    const result = await OrganizationApi.getOrganizationTreeRequest(auth);
    if (result.error) {
      // Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
    } else {
      const organization = result.resultData[0];
      setorganization(organization);
    }
  };

  // const getAllEmployee = async () => {
  //   const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
  //     auth
  //   );
  //   if (result.error) {
  //     // Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
  //   } else {
  //     const company = result.resultData;

  //     const hangleMapper = company.reduce((acc: any, i: any) => {
  //       const charCode = i.user_name.charCodeAt(0);
  //       let charIndex;
  //       if (
  //         charCode >= parseInt('0xac00', 16) &&
  //         charCode <= parseInt('0xd7af', 16)
  //       ) {
  //         const hangle =
  //           (charCode - parseInt('0xac00', 16)) / 28 / 21 +
  //           parseInt('0x1100', 16);
  //         charIndex = String.fromCharCode(hangle);
  //       } else {
  //         charIndex = String.fromCharCode(charCode);
  //       }

  //       if (acc.has(charIndex)) {
  //         acc.set(charIndex, [...acc.get(charIndex), i]);
  //       } else {
  //         acc.set(charIndex, [i]);
  //       }
  //       return acc;
  //     }, new Map());
  //     let obj = Array.from(hangleMapper).reduce((obj, [key, value]: any) => {
  //       return Object.assign(obj, { [key]: value });
  //     }, {});

  //     const employee = Object.keys(obj).map(key => ({
  //       title: key,
  //       data: obj[key]
  //     }));

  //     employee.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  //     setEmployee(employee);
  //   }
  // };

  const startConference = () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;
    const params = {
      service_code: 'videoconference',
      name: roomName,
      is_public: true,
      access_user: [
        // {
        //   type: 'email',
        //   value: 'sadb0101@naver.com',
        //   is_master: false,
        //   user_name: '이름'
        //   // cno: '회사번호(선택)',
        //   // user_no: '사용자번호(선택)'
        // },
        {
          type: 'portal_id',
          value: auth.portal_id,
          is_master: true,
          user_name: auth.user_name,
          cno: cno,
          user_no: auth.user_no
        }
      ],
      is_send_updated_email: switchDelAlram,
      is_reservation: switchReserve,
      call_type: '1',
      invite_messsage: sendMessage
    };

    // MeetApi.createMeetRoom(AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno, params);
    // console.log('startTime');
    // console.log(startTime);
    // console.log('endTime');
    // console.log(endTime);

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
      setSwitchAlram(false);
      setSwitchDelAlram(false);
    };
    clearInput();
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

  const onSwitchAlramChange = () => {
    setSwitchAlram(!switchAlram);
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
    else if (timeType === 'end') {
      setEndTime({ ...obj, time: endTime.time });
    }

    setTimePicker(datePicker);
    setDatePicker('none');
  };

  const onTimeConfirm = () => {
    let obj = getDate(time);
    // console.log(obj.current);
  
    let h = moment(obj.current).hours()-12;
    let m = moment(obj.current).minutes();
    
    let DT;

    if (timeType === 'start') {
      DT = moment(startTime.current).add(h, 'h').add(m, 'm').toDate()
      setStartTime({
        ...obj,
        date: startTime.date,
        current: DT
      });
    } else if (timeType === 'end') {
      DT = moment(endTime.current).add(h, 'h').add(m, 'm').toDate()
      setEndTime({
        ...obj,
        date: endTime.date,
        current: DT
      });
    }
    setTimePicker('none');
  };

  useEffect(() => {}, [sendMessage]);
  useEffect(() => {
    setSelectMode(false);
    getOrganization();
    // getAllEmployee();
  }, []);

  useEffect(() => {
    selectMode ? runAni() : resetAni();
    props.navigation.setParams({
      screenType: selectMode ? 'organization' : 'create'
    });
  }, [selectMode]);

  const roomNameChange = (name: string) => {
    let rn = name;
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

  return (
    <View style={{ flex: 1 }}>
      {selectMode ? (
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: fadeAnim.getTranslateTransform()
          }}
        >
          <OrganizationScreen
            {...props}
            organization={organization}
            employee={employee}
            selectedEmployee={selectedEmployee}
            invited={invited}
            recents={recents}
            inviteText={inviteText}
            setSelectMode={setSelectMode}
            setSelectedEmployee={setSelectedEmployee}
            setInvited={setInvited}
            setInviteText={setInviteText}
          />
        </Animated.View>
      ) : (
        <CreateMeetScreenPresenter
          employee={employee}
          roomName={roomName}
          isPublic={isPublic}
          datePicker={datePicker}
          timePicker={timePicker}
          startTime={startTime}
          endTime={endTime} // 여기서 시간 숫자인거 수정
          email={email}
          selectedEmployee={selectedEmployee}
          sendMessage={sendMessage}
          sendMessageChange={sendMessageChange}
          setSelectMode={setSelectMode}
          setRoomName={setRoomName}
          roomNameChange={roomNameChange}
          togglePublic={togglePublic}
          setDatePicker={setDatePicker}
          setTimePicker={setTimePicker}
          openTimePicker={openTimePicker}
          openDatePicker={openDatePicker}
          // setTime={setTime}
          // setDate={setDate}
          setEmail={setEmail}
          setsendMessage={setSendMessage}
          startConference={startConference}
          //신규Props
          switchAlram={switchAlram}
          switchReserve={switchReserve}
          switchDelAlram={switchDelAlram}
          onSwitchAlramChange={onSwitchAlramChange}
          onSwitchReserveChange={onSwitchReserveChange}
          onSwitchDelAlramChange={onSwitchDelAlramChange}
          setStartTime={setStartTime}
          roomNameCnt={roomNameCnt}
          sendMsgCnt={sendMsgCnt}
          old={true}
          onHandleBack={onHandleBack}
          onDateChange={onDateChange}
          onTimeConfirm={onTimeConfirm}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
        />
      )}
    </View>
  );
}
