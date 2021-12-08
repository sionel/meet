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

import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as WetalkActions } from '../../redux/modules/wetalk';

import { MeetApi } from '../../services';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { MeetNavigationProps } from '../../Navigations/RootNavigation';


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
    'conference' | 'deleted' | 'wating' | 'reservationInfo' | 'fullroom' | null
  >();

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
    route: {
      params: { id }
    },
    route: { params },
    navigation
  }: MeetNavigationProps<'ConferenceStateView'> = props;

  useEffect(() => {
    // 로그인 된 상태서 접근
    // 딥링크 모바일 접근
    // 딥링크 웹 접근
    // 딥링크 이메일 접근
    // 참여코드 접근
    _getConferenceState(id);
    cycleAnimated();
    return () => {
      clearTimeout(enterTimer);
    };
  }, []);

  const _getConferenceState = async (roomId: string) => {
    //email 접속종료후 roomId가 undefined여서 오류생겨서 let으로 변수 access선언
    let access;

    if (roomId !== undefined) {
      access = await MeetApi.getMeetRoomNoCert(roomId);
      setRoomName(access?.resultData?.name);
    }

    if (!access) {
      // 종료된 방 또는 문제가 있을때
      setConferenceState('deleted');
    } else {
      if (access.resultData.r_start_datetime) {
        // 예약방
        const now = new Date().getTime();
        const start = access.resultData.r_start_datetime;
        if (start - now >= 1800000) {
          // 30분 이상 남음
          // 180만 밀리세컨 = 30분
          setConferenceState('reservationInfo');
        } else if (start - now < 0) {
          // 이미 시작함
          setConferenceState('conference');
        } else {
          // 30분 미만 남음
          setConferenceState('wating');
        }
      } else {
        // 지금 실행 방
        setConferenceState('conference');
      }
    }

    _handleConferenceState(roomId, access);
  };

  const _handleConferenceState = async (roomId: string, access: any) => {
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
      _handleEnterConference(roomId, params);
    } else if (conferenceState === 'reservationInfo') {
      // 참석자 정보 받고
      // 시작시간 종료시간 컨버팅 하고
      // 페이지 이동
      const { name, r_start_datetime, r_end_datetime, is_public } =
        access.resultData;
      // let accessUser = [];
      if (Object.keys(auth).length > 0) {
        setAccessUser((await MeetApi.getAccessUsers(auth, roomId)).resultData);
      }
      setName(name);
      setStart(dateFormat(r_start_datetime));
      setEnd(dateFormat(r_end_datetime));
      setIsPublic(is_public);
      setIscret(isLogin);
    } else if (conferenceState === 'wating') {
      // 날짜 변환하고
      // setTimeout 걸어줌
      const now = new Date().getTime();
      const start = access.resultData.r_start_datetime;
      enterTimer = setTimeout(() => {
        _handleEnterConference(auth, roomId);
      }, start - now);
      setStart(start);
    } else if (conferenceState === 'deleted') {
      setIscret(isLogin);
    }
  };

  const _handleEnterConference = async (roomId: string, params: any) => {
    // let callType = 3;
    // let isCreator;

    // 50명 체크는 여기서 하되 토큰받는 작업은 setting 페이지에서 함
    let count = 0;

    count = (await MeetApi.getParticipantCount(roomId)).resultData;
    // 최대 참여인원 제한 (50명)
    if (count >= 50) {
      // 50명 초과 안내화면으로
      setConferenceState('fullroom');
    } else {
      navigation.replace('SettingView', {
        roomType: 'meet',
        selectedRoomName: roomName,
        id: id,
        accessType: params.accessType
        // callType,
        // isCreator,
      });
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
  }

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
      handleClickBack={handleClickBack}
    />
  );
}

// class ConferenceStateContainer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.enterTimer;
//     this.state = {
//       conferenceState: 'loading',
//       isTablet
//     };
//   }

//   async componentDidMount() {
//     // 로그인 된 상태서 접근
//     // 딥링크 모바일 접근
//     // 딥링크 웹 접근
//     // 딥링크 이메일 접근
//     // 참여코드 접근

//     const {
//       auth,
//       videoId,
//       isLogin,
//       route: { params }
//     } = this.props;
//     const { id } = params;
//     // this.props.navigation.goBack()
//     // let roomId;
//     // let iscret = true; // 인증 비인증 묻는 것
//     const iscret = isLogin;
//     // if (params.accesstype === 'login' || params.accesstype === 'wehago') {
//     //   roomId = this.props.navigation.state.params.item.roomId;
//     // } else if (params && Object.keys(params).length > 0) {
//     //   roomId = params.roomId;
//     // }
//     let { conferenceState } = this.state;
//     this.roomId = videoId || id;
//     // let { auth } = this.props;
//     // const access = await MeetApi.getMeetRoom(
//     //   auth.AUTH_A_TOKEN,
//     //   auth.AUTH_R_TOKEN,
//     //   auth.HASH_KEY,
//     //   roomId
//     // );
//     // this.roomName = access.resultData.name;

//     //email 접속종료후 roomId가 undefined여서 오류생겨서 let으로 변수 access선언
//     let access;
//     if (this.roomId !== undefined) {
//       access = await MeetApi.getMeetRoomNoCert(this.roomId);
//       this.roomName = access?.resultData?.name;
//     }

//     if (!access) {
//       // 종료된 방 또는 문제가 있을때
//       conferenceState = 'deleted';
//     } else {
//       if (access.resultData.r_start_datetime) {
//         // 예약방
//         const now = new Date().getTime();
//         const start = access.resultData.r_start_datetime;
//         if (start - now >= 1800000) {
//           // 30분 이상 남음
//           // 180만 밀리세컨 = 30분
//           conferenceState = 'reservationInfo';
//         } else if (start - now < 0) {
//           // 이미 시작함
//           conferenceState = 'conference';
//         } else {
//           // 30분 미만 남음
//           conferenceState = 'wating';
//         }
//       } else {
//         // 지금 실행 방
//         conferenceState = 'conference';
//       }
//     }

//     const dateFormat = date => {
//       let changed = new Date(date);
//       return (
//         changed.getFullYear() +
//         '-' +
//         (changed.getMonth() + 1 + '').padStart(2, '0') +
//         '-' +
//         (changed.getDate() + '').padStart(2, '0') +
//         ' ' +
//         (changed.getHours() + '').padStart(2, '0') +
//         ':' +
//         (changed.getMinutes() + '').padStart(2, '0')
//       );
//     };
//     if (conferenceState === 'conference') {
//       this._handleEnterConference(auth, this.roomId, iscret, params);
//     } else if (conferenceState === 'reservationInfo') {
//       // 참석자 정보 받고
//       // 시작시간 종료시간 컨버팅 하고
//       // 페이지 이동
//       const { name, r_start_datetime, r_end_datetime, is_public } =
//         access.resultData;
//       let accessUser = [];
//       if (Object.keys(auth).length > 0) {
//         accessUser = (await MeetApi.getAccessUsers(auth, this.roomId))
//           .resultData;
//       }
//       this.setState({
//         iscret,
//         conferenceState,
//         name,
//         accessUser,
//         isPublic: is_public,
//         start: dateFormat(r_start_datetime),
//         end: dateFormat(r_end_datetime)
//       });
//     } else if (conferenceState === 'wating') {
//       // 날짜 변환하고
//       // setTimeout 걸어줌
//       const now = new Date().getTime();
//       const start = access.resultData.r_start_datetime;

//       this.enterTimer = setTimeout(() => {
//         this._handleEnterConference(auth, this.roomId);
//       }, start - now);

//       this.setState({
//         iscret,
//         conferenceState,
//         start: dateFormat(start)
//       });
//     } else if (conferenceState === 'deleted') {
//       // 그냥 던져
//       this.setState({
//         iscret,
//         conferenceState: conferenceState
//       });
//     }

//     Orientation.getOrientation(orientation => {
//       const status =
//         orientation === 'LANDSCAPE' ||
//         orientation === 'LANDSCAPE-LEFT' ||
//         orientation === 'LANDSCAPE-RIGHT';
//       this.setState({
//         iscret,
//         orientation: status ? 'horizontal' : 'vertical'
//       });
//     });
//     Orientation.addOrientationListener(this._handleOrientation);
//   }

//   componentWillUnmount() {
//     clearTimeout(this.enterTimer);
//     Orientation.removeOrientationListener(this._handleOrientation);
//   }

// render() {
//   // const { conferenceState } = this.state;

//   return (
//     // <View style={{ flex: 1 }}>
//     <ConferenceStatePresenter {...this.state} />
//     // </View>
//   );
// }

//   _handleOrientation = orientation => {
//     const status =
//       orientation === 'LANDSCAPE' ||
//       orientation === 'LANDSCAPE-LEFT' ||
//       orientation === 'LANDSCAPE-RIGHT';
//     this.setState({ orientation: status ? 'horizontal' : 'vertical' });
//   };

//   // _handleRedirect = (url, param) => {
//   //   const { navigation } = this.props;
//   //   // 여기서 어디로 이동을 한다면 conference밖에 없고
//   //   // 네비게이션 특성상 홈으로 갔다가 가야함
//   //   navigation.navigate('Home');
//   //   navigation.navigate(url, param);
//   // };

//   _handleEnterConference = async (auth, roomId, iscret, params) => {
//     const { navigation } = this.props;
//     let callType = 3;
//     let isCreator;

//     let count = 0;
//     // 50명 체크는 여기서 하되 토큰받는 작업은 setting 페이지에서 함

//     count = (await MeetApi.getParticipantCount(roomId)).resultData;
//     // 최대 참여인원 제한 (50명)
//     if (count >= 50) {
//       // 50명 초과 방 ㄱ
//       conferenceState = 'fullroom';

//       this.setState({
//         conferenceState: conferenceState
//       });
//     } else {
//       navigation.replace('SettingView', {
//         roomType: 'meet',
//         callType,
//         isCreator,
//         selectedRoomName: this.roomName,
//         ...params
//       });

//       // navigation.navigate('Home');
//       // this._handleRedirect('Setting', {
//       //   item: {
//       //     roomType: 'meet',
//       //     videoRoomId: roomId,
//       //     callType,
//       //     isCreator,
//       //     selectedRoomName: this.roomName,
//       //     params
//       //   }
//       // });
//     }
//   };
// }
