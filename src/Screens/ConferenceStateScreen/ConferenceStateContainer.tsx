/**
 * ConferenceStateContainer
 * 화상회의 전 화면들
 *
 */

import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
// import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';
// import { v4 as uuidv4 } from 'uuid';

import ConferenceStatePresenter from './ConferenceStatePresenter';

// import { actionCreators as UserActions } from '@redux/user';
// import { actionCreators as WetalkActions } from '@redux/wetalk';

import { MeetApi } from '@services/index';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { MeetNavigationProps } from '@navigations/RootNavigation';
import { isSuccess } from '@services/types';

export default function ConferenceStateContainer(props: any) {
  const { width, height } = Dimensions.get('window');
  const isTablet = DeviceInfo.isTablet();
  const [roomName, setRoomName] = useState('');
  const [name, setName] = useState('');
  const [accessUser, setAccessUser] = useState<{}[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [iscret, setIscret] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [conferenceState, setConferenceState] = useState<
    'deleted' | 'wating' | 'reservationInfo' | 'fullroom' | ''
  >('');

  let enterTimer: any = () => {};
  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const { auth, isLogin, isHorizon } = useSelector((state: RootState) => ({
    auth: state.user.auth,
    isLogin: state.user.isLogin,
    isHorizon: state.orientation.isHorizon
  }));

  const {
    navigation,
    route: {
      params: { id },
      params
    }
  }: MeetNavigationProps<'ConferenceStateView'> = props;

  useEffect(() => {
    // 로그인 된 상태서 접근
    // 딥링크 모바일 접근
    // 딥링크 웹 접근
    // 딥링크 이메일 접근
    // 참여코드 접근

    _getConferenceState();
    cycleAnimated();
    return () => {
      clearTimeout(enterTimer);
    };
  }, []);

  const _getConferenceState = async () => {
    //email 접속종료후 roomId가 undefined여서 오류생겨서 let으로 변수 access선언
    const noCertResult = await MeetApi.getMeetRoomNoCert(id);
    let access;
    let conferenceState;
    if (isSuccess(noCertResult)) {
      access = noCertResult.resultData;
    }

    if (!access) {
      // 종료된 방 또는 문제가 있을때
      conferenceState = 'deleted';
    } else {
      setRoomName(access.name);

      if (access.r_start_datetime) {
        // 예약방
        const now = new Date().getTime();
        const start = access.r_start_datetime;
        if (start - now >= 1800000) {
          // 30분 이상 남음
          // 180만 밀리세컨 = 30분
          conferenceState = 'reservationInfo';
        } else if (start - now < 0) {
          // 이미 시작함
          conferenceState = 'conference';
        } else {
          // 30분 미만 남음
          conferenceState = 'wating';
        }
      } else {
        // 지금 실행 방
        conferenceState = 'conference';
      }
    }
    _handleConferenceState(conferenceState, access);
  };

  const _handleConferenceState = async (
    conferenceState: string,
    access: any
  ) => {
    const dateFormat = (date: any) => {
      let changed = new Date(date);
      return (
        changed.getFullYear() +
        '-' +
        (changed.getMonth() + 1 + '').padStart(2, '0') +
        '-' +
        (changed.getDate() + '').padStart(2, '0') +
        ' ' +
        (changed.getHours() + '').padStart(2, '0') +
        ':' +
        (changed.getMinutes() + '').padStart(2, '0')
      );
    };

    if (conferenceState === 'conference') {
      _handleEnterConference();
    } else if (conferenceState === 'reservationInfo') {
      // 참석자 정보 받고
      // 시작시간 종료시간 컨버팅 하고
      // 페이지 이동
      const { name, r_start_datetime, r_end_datetime, is_public } = access;
      let accessUser: any[] = [];
      const getAccessUsersResult = await MeetApi.getAccessUsers(auth, id);

      if (isSuccess(getAccessUsersResult)) {
        accessUser = getAccessUsersResult.resultData;
      }
      if (Object.keys(auth).length > 0) {
        setAccessUser(accessUser);
      }

      setName(name);
      setStart(dateFormat(r_start_datetime));
      setEnd(dateFormat(r_end_datetime));
      setIsPublic(is_public);
      setIscret(isLogin);
      setConferenceState('reservationInfo');
    } else if (conferenceState === 'wating') {
      // 날짜 변환하고
      // setTimeout 걸어줌

      let accessUser: any[] = [];
      const getAccessUsersResult = await MeetApi.getAccessUsers(auth, id);

      if (isSuccess(getAccessUsersResult)) {
        accessUser = getAccessUsersResult.resultData;
      }
      if (Object.keys(auth).length > 0) {
        setAccessUser(accessUser);
      }

      const now = new Date().getTime();
      const start = access.r_start_datetime;

      enterTimer = setTimeout(() => {
        _handleEnterConference();
      }, start - now);



      setStart(dateFormat(start));
      setConferenceState('wating');
    } else if (conferenceState === 'deleted') {
      setIscret(isLogin);
      setConferenceState('deleted');
    }
  };

  const _handleEnterConference = async () => {
    // let callType = 3;
    // let isCreator;

    // 50명 체크는 여기서 하되 토큰받는 작업은 setting 페이지에서 함
    let count = 0;
    const getParticipantCount = await MeetApi.getParticipantCount(id);
    if(isSuccess(getParticipantCount)) {
      count = getParticipantCount.resultData;
    }
    

    // 최대 참여인원 제한 (50명)
    if (count >= 50) {
      // 50명 초과 안내화면으로
      setConferenceState('fullroom');
    } else {
      const { accessType, id, selectedRoomName } = params;
      switch (accessType) {
        case 'auth':
          navigation.replace('SettingView', {
            selectedRoomName,
            accessType,
            id
          });
          break;
        case 'email':
          const { emailToken } = params;
          navigation.replace('SettingView', {
            selectedRoomName,
            accessType,
            id,
            emailToken
          });
          break;
        case 'joincode':
          const { joincode } = params;
          navigation.replace('SettingView', {
            selectedRoomName,
            accessType,
            id,
            joincode
          });
          break;
        default:
          break;
      }
    }
  };

  const cycleAnimated = () => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(1))
      })
    ).start();
  };

  const handleClickBack = () => {
    navigation.goBack();
  };

  return (
    <ConferenceStatePresenter
      conferenceState={conferenceState}
      spin={spin}
      start={start}
      end={end}
      name={name}
      accessUser={accessUser}
      isPublic={isPublic}
      iscret={iscret}
      isTablet={isTablet}
      handleClickBack={handleClickBack}
      selectedRoomName={params.selectedRoomName}
    />
  );
}