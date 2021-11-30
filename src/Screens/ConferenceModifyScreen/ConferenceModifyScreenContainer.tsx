import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import ConferenceModfiyScreenPresenter from './ConferenceModifyScreenPresenter';
import OrganizationScreen from '../CreateMeetScreen/OrganizationScreen';

import { MeetApi, OrganizationApi } from '../../services';

import moment from 'moment';
import { getT } from '../../utils/translateManager';
import { RootState } from '../../redux/configureStore';
import deviceInfoModule from 'react-native-device-info';
import { wehagoDummyImageURL, wehagoMainURL } from '../../utils';

interface accessUserParam {
  type: 'portal_id' | 'email';
  value: string;
  is_master: boolean;
  user_name: string;
  cno: number;
  user_no: number;
}

interface roomInfoParam {
  name: string;
  is_public: boolean;
  portal_id: string;
  r_start_datetime: Date;
  r_end_datetime: Date;
  is_send_update_email: boolean;
  invite_message: string;
  error?: any;
}

interface userInfoParam {
  portal_id: string;
  rank_name: string;
  user_no: number;
  user_name: string;
  profile_url: string;
  full_path: string;
  user_type: string;
  is_master: boolean;
}

interface roomModifyParam {
  service_code: string;
  name: string;
  is_public: boolean;
  is_reservation: boolean;
  access_user: any[];
  unaccess_user?: any[];
  master?: any[];
  unmaster?: any[];
  is_send_updated_email: boolean;
  invite_message: string;
  start_date_time?: any;
  end_date_time?: any;
}

type PartialAccessUserParam = Partial<accessUserParam>;
export type PartialUserInfoParam = Partial<userInfoParam>;

export default function ConferenceModfiyScreenContainer(props: any) {
  const [isPublic, setIsPublic] = useState(true);
  const [switchReserve, setSwitchReserve] = useState(true);
  const [switchDelAlram, setSwitchDelAlram] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [sendMessage, setSendMessage] = useState('');
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
  const [employee, setEmployee] = useState([{}]);
  const [selectedEmployee, setSelectedEmployee] = useState({
    member: [{}],
    group: {}
  });

  const [unAccessEmployee, setUnAccessEmployee] = useState<
    { type: string; value: string }[]
  >([]);
  const [masterEmployee, setMasterEmployee] = useState<string[]>([]);
  const [unMasterEmployee, setUnMasterEmployee] = useState<string[]>([]);

  const [textLess2, setTextLess2] = useState(false);
  const [isOrgDataLoaded, setIsOrgDataLoaded] = useState(false);
  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [contacts, setContacts] = useState<{ title: string; data: Object }[]>(
    []
  );
  const [dateTimeSeleted, setDateTimeSeleted] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const titleRef: RefObject<any> = useRef();
  const sendMsgRef: RefObject<any> = useRef();
  const searchRef: RefObject<any> = useRef();
  const sendEmailRef: RefObject<any> = useRef();

  const { auth, isHorizon, roomId } = useSelector((state: any) => ({
    auth: state.user.auth,
    isHorizon: state.orientation.isHorizon,
    roomId: state.conference.roomId
  }));

  const t = getT();

  const isTablet = deviceInfoModule.isTablet() === true;

  const _getReservationInfos = async (roomId: string) => {
    const reservationInfos: roomInfoParam = await MeetApi.getMeetRoom(
      auth,
      roomId
    );
    if (reservationInfos.error) {
      console.log('error', reservationInfos.error);
    }

    if (reservationInfos.portal_id === auth.portal_id) setIsAuth(true);

    const accessUser = await MeetApi.getAccessUsers(auth, roomId);
    if (accessUser.error) {
      console.log('error', accessUser.error);
    }

    const sortedAccessUserList: any[] = accessUser.sort(
      (user: any, _user: any) => _user.is_master - user.is_master
    );

    const portalIdList = sortedAccessUserList
      .map((user: any) => user.user)
      .filter((user: any) => user);

    const participants = await MeetApi.getUserInfoList(auth, portalIdList);
    if (participants.error) {
      console.log('error', participants.error);
    }

    const sortedPortalIdList: any[] = portalIdList.map((id: any) => {
      const item =
        participants.find((e: any) => e.portal_id === id) ||
        sortedAccessUserList.find(e => e.user === id);
      return item;
    });

    const reservationUserInfos: PartialUserInfoParam[] = await Promise.all(
      sortedPortalIdList.map(async (user, i) => {
        const data: PartialUserInfoParam = {
          portal_id: user.portal_id,
          rank_name: user.rank_name,
          user_no: user.user_no,
          user_name: user.user_name ? user.user_name : user.user,
          profile_url: user.profile_url
            ? wehagoMainURL + user.profile_url
            : wehagoDummyImageURL,
          full_path: user.user_no
            ? user.full_path_list[5].path
            : user.user_name !== null
            ? user.user
            : '',
          user_type: user.user_type === 2 ? 'ext' : 'org',
          is_master: sortedAccessUserList[i].is_master
        };
        return data;
      })
    );

    setSelectedEmployee({ member: reservationUserInfos, group: {} });

    const {
      name,
      is_public,
      r_start_datetime,
      r_end_datetime,
      is_send_update_email,
      invite_message
    } = reservationInfos;

    const startTime = getDate(moment(r_start_datetime).toDate());
    const endTime = getDate(moment(r_end_datetime).toDate());

    setStartTime({
      date: startTime.date,
      time: startTime.time,
      current: startTime.current
    });
    setEndTime({
      date: endTime.date,
      time: endTime.time,
      current: endTime.current
    });
    setIsPublic(is_public);
    setSwitchDelAlram(is_send_update_email);
    setRoomName(name);
    setSendMessage(invite_message ? invite_message : '');
  };

  const getAllEmployee = async () => {
    const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
      auth
    );
    if (result.error) {
      console.log('조직도를 가져올 수 없습니다.');
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

  const modifyConference = async () => {
    if (1 < roomName.length) {
      let arr: PartialAccessUserParam[] = [];

      selectedEmployee.member.map((value: any) => {
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

      let params: roomModifyParam = {
        service_code: 'wehagomeet',
        name: roomName,
        is_public: isPublic,
        is_reservation: switchReserve,
        access_user: arr,
        unaccess_user: unAccessEmployee,
        master: masterEmployee,
        unmaster: unMasterEmployee,
        is_send_updated_email: switchDelAlram,
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

      const result = await MeetApi.updateMeetRoom(auth, roomId, params);
      if (result) {
        onHandleBack();
      } else if (result.error) {
        console.log('error : ', result.error);
      }
    }
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
        t('시간 지정 오류'),
        t('시작 시간, 종료시간은 현재 시간보다 30분 이후로 지정이 가능합니다.')
      );
      setTime(today.add(1, 'minutes').toDate());
      return false;
    } else if (current < startTime.current) {
      Alert.alert(
        t('시간 지정 오류'),
        t('종료 시간은 시작 시간 이전으로 지정이 불가능합니다.')
      );
      setTime(moment(startTime.current).add(30, 'minutes').toDate());
      setTimePicker('none');
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
    }

    setTimePicker('none');
    setDateTimeSeleted(false);
    setTimeChangeDetect(false);
  };

  //조직도 초기화
  const getOrganizationTree = async () => {
    const result = await OrganizationApi.getOrganizationTreeRequest(auth);
    if (result.error) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      // 조직도 조회 안됨 에러 표현
      // 생성화면으로 Back
    } else {
      const organization = result[0];
      setorganization(organization);
    }
  };

  //연락처 조회
  const getContactsList = async () => {
    // 최적화 하려면 여기 코드를 상위로 옮기자
    const result = await OrganizationApi.getContactsList(auth);
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

  const dataLoad = async () => {
    setIsOrgDataLoaded(true);

    getAllEmployee();
    await getOrganizationTree();
    await getContactsList();

    setIsOrgDataLoaded(false);
  };

  useEffect(() => {
    setSelectMode(false);
    _getReservationInfos(roomId);
    dataLoad();
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
    props.navigation.goBack();
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

  const changeIsNormal = () => {
    setIsNormal(!isNormal);
  };

  const clickChangeRole = (item: any, index: number) => {
    const resList: any[] = [];
    const updateList: any[] = selectedEmployee.member;
    let updateMaster: string[] = masterEmployee;
    let updateUnMaster: string[] = unMasterEmployee;

    updateList[index].is_master = !updateList[index].is_master;
    let masterUser = {
      is_master: updateList[index].is_master,
      portal_id: updateList[index].portal_id
    };

    const partListUserNoOrderList: any[] = updateList.sort((a: any, b: any) => {
      return a.user_no === auth.user_no ? -3 : b.is_master - a.is_master;
    });
    partListUserNoOrderList.map(v => resList.push(v));
    setSelectedEmployee({ member: resList, group: {} });

    if (masterUser.is_master) {
      updateMaster.push(masterUser.portal_id);
      setMasterEmployee(updateMaster);
    } else {
      updateUnMaster.push(masterUser.portal_id);
      setUnMasterEmployee(updateUnMaster);
    }
  };

  const clickDeleteUser = (item: any, index: number) => {
    let deletedList: any[] = selectedEmployee.member;
    const deleteUser: PartialUserInfoParam = deletedList.find(
      e => e.portal_id === item.portal_id
    );
    const deleteAccessUsers: any[] = unAccessEmployee;

    //추후에 연락처나, 외부참여자 추가할때 type => email도 고려해서 짜야함.
    deleteAccessUsers.push({
      type: 'portal_id',
      value: deleteUser.portal_id
    });

    const updateList: any[] = deletedList.filter((v, i) => i !== index);
    setSelectedEmployee({ member: updateList, group: {} });
    setUnAccessEmployee(deleteAccessUsers);
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
        <ConferenceModfiyScreenPresenter
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
          setDatePicker={setDatePicker}
          setTimePicker={setTimePicker}
          openTimePicker={openTimePicker}
          openDatePicker={openDatePicker}
          modifyConference={modifyConference}
          //신규Props
          switchReserve={switchReserve}
          switchDelAlram={switchDelAlram}
          onSwitchReserveChange={onSwitchReserveChange}
          onSwitchDelAlramChange={onSwitchDelAlramChange}
          onHandleBack={onHandleBack}
          onDateChange={onDateChange}
          onTimeConfirm={onTimeConfirm}
          time={time}
          setTime={setTime}
          auth={auth}
          // participantList={participantList}
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
          isHorizon={isHorizon}
          isTablet={isTablet}
          dateTimeSeleted={dateTimeSeleted}
          isNormal={isNormal}
          isAuth={isAuth}
          changeIsNormal={changeIsNormal}
        />
      )}
    </View>
  );
}
