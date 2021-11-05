import React, { useEffect, useRef, useState } from 'react';
import { Platform, View, Animated, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import CreateMeetScreenPresenter from './CreateMeetScreenPresenter';

import DeviceInfo from 'react-native-device-info';
import { getT } from '../../utils/translateManager';
import OrganizationScreen from '../../components/Organization';

import { OrganizationApi, MeetApi } from '../../services';

import { actionCreators } from '../../redux/modules/alert';

// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

export default function CreateMeetScreenContainer(props: any) {
  const date = new Date();
  const [switchAlram, setSwitchAlram] = useState(false);
  const [switchReserve, setSwitchReserve] = useState(false);
  const [switchDelAlram, setSwitchDelAlram] = useState(false);
  const [selectMode, setSelectMode] = useState(false);

  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [employee, setEmployee] = useState([]);

  const [roomName, setRoomName] = useState('');
  const [roomNameCnt, setRoomNameCnt] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [dateTimePicker, setDateTimePicker] = useState<'none' | 'start' | 'end'>(
    'none'
  );

  const [invited, setInvited] = useState([]);
  const [recents, setRecents] = useState([]);
  const [inviteText, setInviteText] = useState('');
  // const [timeType, setTimeType] = useState('');

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

  const [email, setEmail] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState({
    member: {},
    group: {}
  });
  const [sendMessage, setSendMessage] = useState('');
  const [sendMsgCnt, setSendMsgCnt] = useState(0);

  const fadeAnim = useRef(new Animated.ValueXY()).current;

  const { auth } = useSelector((state:any) => state.user);
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

  const getAllEmployee = async () => {
    const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
      auth
    );
    if (result.error) {
      // Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
    } else {
      const company = result.resultData;

      const hangleMapper = company.reduce((acc:any, i:any) => {
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
      let obj = Array.from(hangleMapper).reduce((obj, [key, value]: any) => {
        return Object.assign(obj, { [key]: value });
      }, {});

      const employee = Object.keys(obj).map(key => ({
        title: key,
        data: obj[key]
      }));

      employee.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
      setEmployee(employee);
    }
  };

  const startConference = () => {
    const { AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno } = auth;

    const params = {
      service_code: 'videoconference',
      name: '모바일테스트방',
      is_public: true,
      access_user: [
        {
          type: 'email',
          value: 'sadb0101@naver.com',
          is_master: false,
          user_name: '이름'
          // cno: '회사번호(선택)',
          // user_no: '사용자번호(선택)'
        },
        {
          type: 'portal_id',
          value: 'sadb0101',
          is_master: true,
          user_name: '최은우',
          cno: 9,
          user_no: 799127
        }
      ],
      is_send_updated_email: false,
      is_reservation: false,
      call_type: '1',
      invite_messsage: '초대메시지'
    };
    MeetApi.createMeetRoom(AUTH_A_TOKEN, AUTH_R_TOKEN, HASH_KEY, cno, params);
  };

  const togglePublic = () => {
    setIsPublic(!isPublic);
  };

  const openDateTimePicker = async (type: 'start' | 'end' | 'none') => {
    setDateTimePicker(type);
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
  const onSwitchReserveChange = () => {
    const now = new Date();
    setStartTime(getDate(now));
    setEndTime(getDate(new Date(now)));
    setSwitchReserve(!switchReserve);
  };
  const onSwitchDelAlramChange = () => {
    setSwitchDelAlram(!switchDelAlram);
  };

  // const onSelectDate = (date:any) => {
  //   // if (datePicker === 'start') {
  //   // } else if (datePicker === 'end') {
  //   // }

  //   console.log(date);
  //   setTimePicker(dateTimePicker);
  //   setDateTimePicker('none');
  // };

  // const onSelectTime = (time:any) => {
  //   console.log(time);
  //   setTimePicker('none');
  // };

  useEffect(() => {}, [dateTimePicker]);

  useEffect(() => {}, [sendMessage]);
  useEffect(() => {
    setSelectMode(false);
    getOrganization();
    getAllEmployee();
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
          dateTimePicker={dateTimePicker}
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
          // onSelectDate={onSelectDate}
          // onSelectTime={onSelectTime}
          setDateTimePicker={setDateTimePicker}
          openDateTimePicker={openDateTimePicker}
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
          roomNameCnt={roomNameCnt}
          sendMsgCnt={sendMsgCnt}
          old={true}
        />
      )}
    </View>
  );
}
