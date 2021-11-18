import React, { RefObject, useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, View } from 'react-native';
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

  const titleRef: RefObject<any> = useRef();
  const sendMsgRef: RefObject<any> = useRef();
  const [selectedEmployee, setSelectedEmployee] = useState({
    member: [{}],
    group: {}
  });

  const [listLng, setListLng] = useState(1);
  const [sendMessage, setSendMessage] = useState('');
  const [sendMsgCnt, setSendMsgCnt] = useState(0);
  const [participantList, setParticipantList] = useState<any[]>([]);
  const [textLess2, setTextLess2] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { auth } = useSelector((state: any) => state.user);
  const t = getT();

  const dispatch = useDispatch();

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
      Object.values(selectedEmployee.member).map((value: any) => {
        // type에 따라 access_user에 받는게 다름
        // type: portal_id, email
        if (value.user_no !== auth.user_no) {
          arr.push({
            type: 'portal_id',
            value: value.portal_id,
            is_master: value.is_master,
            user_name: value.user_name
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

  const onDateChange = (date: any) => {
    let obj = getDate(new Date(date));

    if (timeType === 'start') {
      obj.current.setHours(startTime.current.getHours());
      obj.current.setMinutes(startTime.current.getMinutes());
      setStartTime({
        ...obj,
        time: startTime.time
      });
    } else if (timeType === 'end') {
      obj.current.setHours(endTime.current.getHours());
      obj.current.setMinutes(endTime.current.getMinutes());
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

    let start_DT, end_DT;
    let h = moment(obj.current).hours();
    let m = moment(obj.current).minutes();

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
    }

    setTimePicker('none');
    setTimeChangeDetect(false);
  };

  useEffect(() => {
    setSelectMode(false);
    getAllEmployee();
    setSelectedEmployee({
      member: [
        {
          user_name: auth.user_name,
          rank_name: auth.last_company.rank_name,
          profile_url: auth.profile_url,
          full_path: auth.last_company.full_path,
          user_no: auth.user_no,
          is_master: true
        }
      ],
      group: {}
    });
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

  const onFocusOut = () => {
    if (sendMsgRef.current.isFocused()) sendMsgRef.current.blur();
    else if (titleRef.current.isFocused()) titleRef.current.blur();
  };

  const exitDateTime = () => {
    if (datePicker === 'start' || 'end') {
      setDatePicker('none');
    }
    if (timePicker === 'start' || 'end') {
      setTimePicker('none');
    }
  };

  const clickChangeRole = (item: any) => {
    const resList: any[] = [];

    const updateList: any[] = selectedEmployee.member;
    let idx: number = updateList.findIndex(
      (i: any) => i.user_no === item.user_no
    );
    updateList[idx].is_master = !updateList[idx].is_master;

    const roomMaster: any[] = updateList[0];
    resList.push(roomMaster);

    const userList: any[] = updateList.filter((v: any, i: number) => i !== 0);

    const masterList: any[] = userList.filter(
      (v: any, i) => v.is_master === true
    );
    const masterUserNoOrderList: any[] = masterList.sort((a: any, b: any) => {
      return a.user_no - b.user_no;
    });
    masterUserNoOrderList.map(v => resList.push(v));

    const partList: any[] = userList.filter(
      (v: any, i) => v.is_master !== true
    );
    const partListUserNoOrderList: any[] = partList.sort((a: any, b: any) => {
      return a.user_no - b.user_no;
    });
    partListUserNoOrderList.map(v => resList.push(v));

    setSelectedEmployee({ member: resList, group: {} });
  };

  const clickDeleteUser = (item: any) => {
    const newList: any[] = selectedEmployee.member;
    let idx = newList.findIndex((i: any) => i.user_no === item.user_no);
    const updateList: any[] = newList.filter((v, i) => i !== idx);
    setSelectedEmployee({ member: updateList, group: {} });
  };

  return (
    <View style={{ flex: 1 }}>
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
          listLng={listLng}
          setListLng={setListLng}
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
          sendMsgRef={sendMsgRef}
          titleRef={titleRef}
          onFocusOut={onFocusOut}
          setTimeChangeDetect={setTimeChangeDetect}
          timeChangeDetect={timeChangeDetect}
          timeChange={timeChange}
          exitDateTime={exitDateTime}
          clickChangeRole={clickChangeRole}
          clickDeleteUser={clickDeleteUser}
          selectedEmployee={selectedEmployee}
        />
      )}
    </View>
  );
}
