import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Platform,
  Linking,
  BackHandler,
  Alert,
  ToastAndroid
} from 'react-native';

import { getT } from '../../utils/translateManager';

import { MeetApi, ServiceCheckApi } from '../../services';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';

import HomeScreenPresenter from './HomeScreenPresenter';
import { wehagoDummyImageURL, wehagoMainURL } from '../../utils';

import { content } from './Component/bottomPopup';

const icUser = require('../../../assets/new/icons/ic_user.png');
const icModify = require('../../../assets/new/icons/ic_modify.png');
const icLink = require('../../../assets/new/icons/ic_link.png');
const icCancel = require('../../../assets/new/icons/ic_cancel.png');
const icInfo = require('../../../assets/new/icons/ic_info.png');

export default function HomeScreenContainer(props: any) {
  const [indicator, setIndicator] = useState(true);
  const [ongoingConference, setOngoingConference] = useState<any[]>([]);

  const [reservationConference, setReservationConference] = useState<any[]>([]);

  const [finishedConference, setFinishedConference] = useState<any[]>([]);

  const [highlight, setHighlight] = useState<'reservation' | 'finished' | null>(
    null
  );
  const [conferenceInterval, setConferenceInterval] =
    useState<NodeJS.Timeout>();

  const [bottomPopup, setBottomPopup] = useState<{
    show: boolean;
    contentList: content[];
    title: string;
    onClickOutside: () => void;
  }>({
    show: false,
    contentList: [],
    title: '',
    onClickOutside: () => {}
  });

  // let timeout: any = null;
  // let exitApp = false;

  const ref = useRef({ reservationConference, timeout, exitApp : false });
  // ref.current.reservationConference = reservationConference
  //#region  selector
  const { auth, userImg, companyName, userName, portalId } = useSelector(
    (state: RootState) => {
      const { auth } = state.user;

      return {
        auth: auth,
        userName: auth.user_name,
        portalId: auth.portal_id,
        userImg: wehagoMainURL + auth.profile_url,
        companyName: auth.last_company.company_name_kr
      };
    }
  );

  const dispatch = useDispatch();
  const onAgreement = () => dispatch(UserActions.agreement());
  const onLogout = () => dispatch(UserActions.logout());

  useEffect(() => {
    _getConferences();
    _getFinishedConferences();
    BackHandler.addEventListener('hardwareBackPress', _handleBackButton);

    // const reload = setInterval(() => {
    //   _getConferences();
    // }, 15000);
    // setConferenceInterval(reload);
    return () => {
      conferenceInterval && clearInterval(conferenceInterval);
      BackHandler.removeEventListener('hardwareBackPress', _handleBackButton);
    };
  }, []);

  useEffect(() => {
    const now = !reservationConference.length
      ? 'finished'
      : !finishedConference.length
      ? 'reservation'
      : highlight;
    setHighlight(now);
    ref.current.reservationConference = reservationConference;
  }, [reservationConference, finishedConference]);

  const _handleBackButton = () => {
    // if(this.props.navigation)
    // if (!this.props.navigation.isFocused()) return false;
    // this.props.navigation.closeDrawer();

    // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (!ref.current.exitApp) {
      ToastAndroid.show('한번더 누르면 앱이 종료됩니다', ToastAndroid.SHORT);
      ref.current.exitApp = true;
      ref.current.timeout = setTimeout(() => {
        ref.current.exitApp = false;
      }, 1000);
    } else {
      clearTimeout(ref.current.timeout);
      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  };

  const _getFinishedConferences = () => {
    MeetApi.getMeetFinished(auth, '2021-11-01', '2021-11-30', 0, 20).then(
      async result => {
        const finished = result.list;
        const finishedConference = await Promise.all(
          finished.map(async (conference: any) => {
            const year = new Date(conference.start_date_time).getFullYear();
            const month = new Date(conference.start_date_time).getMonth();
            const day = new Date(conference.start_date_time).getDate();
            const dateString = `${year}.${month}.${day}`;
            const ampm = new Date(conference.start_date_time)
              .toLocaleString('en')
              .slice(-2);
            const startTimeString = new Date(conference.start_date_time)
              .toTimeString()
              .slice(0, 5);
            const endTimeString = new Date(conference.end_date_time)
              .toTimeString()
              .slice(0, 5);
            const timeString = `${dateString}   ${startTimeString}${ampm} ~ ${endTimeString}${ampm}`;
            const { hour, minutes } = conference.usage_time;
            const usageTime = hour * 60 + minutes;
            const users = conference.users;

            const portalIdList = users
              .map((user: any) => user.user)
              .filter((user: any) => user);
            const participants: any[] = await MeetApi.getUserInfoList(
              auth,
              portalIdList
            );

            const uriList = participants.reduce<
              { type: string; value: string | number }[]
            >((prev, present) => {
              if (prev.length > 2) return prev;

              let type;
              let value;
              const uri = present.profile_url
                ? wehagoMainURL + present.profile_url
                : wehagoDummyImageURL;

              if (participants.length <= 3) {
                type = 'string';
                value = uri;
              } else {
                type = prev.length < 2 ? 'string' : 'number';
                value = prev.length < 2 ? uri : participants.length - 2;
              }

              return [...prev, { type, value }];
            }, []);

            const roomId = conference.t_room_id;
            const data = {
              conferenceName: conference.name,
              timeString,
              usageTime,
              users: uriList,
              roomId,
              finishedMoreClick: () => _finishedMoreClick(conference)
            };
            return data;
          })
        );

        setFinishedConference(finishedConference);
      }
    );
  };

  const _getConferences = () => {
    MeetApi.getMeetRoomsList(auth).then(async result => {
      const going: any[] = result.filter(
        (conference: any) => conference.is_started
      );
      const goingList = await Promise.all(
        going.map(async (conference: any) => {
          const startTime = new Date(
            conference.start_date_time
              ? conference.start_date_time
              : conference.created_at
          ).toLocaleTimeString('en');
          const time = startTime.slice(-2) + ' ' + startTime.slice(0, 4);

          const onMinte = Math.floor(
            (new Date().getTime() -
              (conference.start_date_time
                ? conference.start_date_time
                : conference.created_at)) /
              1000 /
              60
          );

          const connectingUser = await MeetApi.getUserList(
            auth,
            conference.room_id
          );

          const isMaster = connectingUser.filter(
            (user: any) => user.user === portalId
          )[0]?.is_master
            ? true
            : false;
          //진행중인 방에서는 내가 없을수 있으므로 ?를 붙임

          const sortedConnectingUserList = connectingUser.sort(
            (user: any, _user: any) => _user.is_master - user.is_master
          );

          const portalIdList = sortedConnectingUserList
            .map((user: any) => user.user)
            .filter((user: any) => user);

          const participants: any[] = await MeetApi.getUserInfoList(
            auth,
            portalIdList
          );

          const sortedPortalIdList: any[] = portalIdList.map((id: any) => {
            const item = participants.find(e => e.portal_id === id);
            return item;
          });

          const uriList = sortedPortalIdList.reduce<
            { type: string; value: string | number }[]
          >((prev, present) => {
            if (prev.length > 4) return prev;
            let type;
            let value;
            const uri = present?.profile_url
              ? wehagoMainURL + present.profile_url
              : wehagoDummyImageURL;
            if (participants.length <= 5) {
              type = 'string';
              value = uri;
            } else {
              type = prev.length < 4 ? 'string' : 'number';
              value = prev.length < 4 ? uri : participants.length - 4;
            }

            return [...prev, { type, value }];
          }, []);

          const data = {
            conferenceName: conference.name,
            time,
            onMinte,
            participants: uriList,
            isLock: !conference.is_public,
            goingMoreClick: () => _goingMoreClick(conference, isMaster),
            enterConference: _enterConference
          };
          return data;
        })
      );
      setOngoingConference(goingList);

      const reservation: any[] = result.filter(
        (conference: any) => !conference.is_started
      );

      const reservationList = await Promise.all(
        reservation.map(async (conference: any, index: number) => {
          const accessUser = await MeetApi.getAccessUsers(
            auth,
            conference.room_id
          );

          const isMaster = accessUser.filter(
            (user: any) => user.user === portalId
          )[0].is_master
            ? true
            : false;

          const sortedAccessUserList = accessUser.sort(
            (user: any, _user: any) => _user.is_master - user.is_master
          );

          const portalIdList = sortedAccessUserList
            .map((user: any) => user.user)
            .filter((user: any) => user);

          const participants: any[] = await MeetApi.getUserInfoList(
            auth,
            portalIdList
          );

          const sortedPortalIdList: any[] = portalIdList.map((id: any) => {
            const item = participants.find(e => e.portal_id === id);
            return item;
          });

          const uriList = sortedPortalIdList.reduce<
            { type: string; value: string | number }[]
          >((prev, present) => {
            if (prev.length > 2) return prev;

            let type;
            let value;
            const uri = present.profile_url
              ? wehagoMainURL + present.profile_url
              : wehagoDummyImageURL;
            if (participants.length <= 3) {
              type = 'string';
              value = uri;
            } else {
              type = prev.length < 2 ? 'string' : 'number';
              value = prev.length < 2 ? uri : participants.length - 2;
            }

            return [...prev, { type, value }];
          }, []);

          const data = {
            roomName: conference.name,
            date: new Date(conference.r_start_date_time).toLocaleDateString(),
            start: new Date(conference.r_start_date_time).toLocaleTimeString(),
            end: new Date(conference.r_end_date_time).toLocaleTimeString(),
            users: uriList,
            roomId: conference.room_id,
            isPublic: conference.is_public,
            reservationMoreClick: () =>
              _reservationMoreClick(conference, isMaster),
            key: index
          };
          return data;
        })
      );

      if (
        ref.current.reservationConference.length === 0 &&
        reservationList.length > 0
      )
        setHighlight('reservation');

      setReservationConference(reservationList);
    });
  };

  /* 
  icUser
icModify
icLink
icCancel
icInfo
*/
  const _goingMoreClick = (conference: any, isMaster: boolean) => {
    const list = {
      name: '참석자 명단',
      icon1: icUser,
      icon2: null,
      onClick: () => {}
    };
    const copy = {
      name: '공유링크 복사',
      icon1: icLink,
      icon2: null,
      onClick: () => {}
    };
    const detailInfo = {
      name: '회의 상세정보',
      icon1: icInfo,
      icon2: null,
      onClick: () => {}
    };

    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList: [list, copy, detailInfo],
      show: true,
      title: conference.name
    });
  };
  const _reservationMoreClick = (conference: any, isMaster: boolean) => {
    const list = {
      name: '참석 예정자 명단',
      icon1: icUser,
      icon2: null,
      onClick: () => {}
    };
    const modify = {
      name: '예약정보 수정',
      icon1: icModify,
      icon2: null,
      onClick: () => {}
    };
    const copy = {
      name: '공유링크 복사',
      icon1: icLink,
      icon2: null,
      onClick: () => {}
    };
    const detailInfo = {
      name: '회의 상세정보',
      icon1: icInfo,
      icon2: null,
      onClick: () => {}
    };
    const cancle = {
      name: '예약 취소',
      icon1: icCancel,
      icon2: null,
      onClick: () => {}
    };

    const contentList = [];

    contentList.push(list);
    isMaster && contentList.push(modify);
    contentList.push(copy);
    contentList.push(detailInfo);
    isMaster && contentList.push(cancle);
    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList,
      show: true,
      title: conference.name
    });
  };
  const _finishedMoreClick = (conference: any) => {
    setBottomPopup({
      onClickOutside: _onClickOutside,
      contentList: [],
      show: true,
      title: conference.name
    });
  };
  const _enterConference = (roomId: string) => {};
  const _onClickOutside = () => {
    setBottomPopup({
      ...bottomPopup,
      show: false
    });
  };
  return (
    <HomeScreenPresenter
      {...{
        userName,
        indicator,
        ongoingConference,
        reservationConference,
        finishedConference,
        highlight,
        setHighlight,
        userImg,
        companyName,
        bottomPopup,
        test: _getConferences
      }}
    />
  );
}

// import React, { Component } from 'react';
// import {
//   AppState,
//   StatusBar,
//   Linking,
//   Platform,
//   View,
//   ToastAndroid,
//   BackHandler
// } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// import Orientation from 'react-native-orientation-locker';
// import { NavigationEvents } from 'react-navigation';

// import HomeScreenPresenter from './HomeScreenPresenter';

// // service
// import { WetalkApi, MeetApi, ServiceCheckApi, UserApi } from '../../services';
// import { querystringParser, isWehagoV } from '../../utils';

// import { getT } from '../../utils/translateManager';
// const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

// class HomeScreenContainer extends Component {
//   constructor(props) {
//     super(props);
//     this._isFocus = true;
//     this._refreshTimeStamp = Date.now();
//     this.t = getT();
//   }

//   state = {
//     appState: AppState.currentState,
//     refreshing: false, // 리프레시 상태
//     searchKeyword: '', // 검색인풋
//     selectedRoomId: null,
//     selectedRoomName: null,
//     // modal: false,
//     url: null,
//     orientation: 'UNKNOWN',
//     alert: {
//       visible: false,
//       title: '',
//       message: '',
//       onClose: () => {}
//     },
//     room_id: null
//   };

//   async componentDidMount() {
//     this._getServices();
//     // 화면 회전 처리
//     Orientation.getOrientation(orientation => {
//       this.setState({ orientation });
//     });
//     Orientation.addOrientationListener(this._handleOrientation);
//     // 개인 회원 여부 체크
//     // 0: 일반, 1: 개인
//     if (this.props.auth.member_type !== 1) {
//       // 주기적으로 앱 업데이트
//       AppState.addEventListener('change', this._handleAppStateChange);
//       this._interval = setInterval(() => {
//         if (Date.now() > this._refreshTimeStamp + 3000) {
//           // 리프레쉬 할 시간이 지났으면 리프레쉬 한다.
//           this._handleRefresh();
//         }
//       }, 15000);
//     }

//     // 뒤로가기 버튼 동작
//     BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
//   }

//   // shouldComponentUpdate = (nextProps, nextState) => {
//     // [android] 앱이 실행중에 딥링크에 의한 화상회의 연결방법
//     // if (
//     //   // Platform.OS === 'android' &&
//     //   this.props.screenProps !== nextProps.screenProps
//     // ) {
//     //   this._handleOpenURL(nextProps.screenProps);
//     // }

//     // return true;
//   // };

//   componentWillUnmount() {
//     clearInterval(this._interval);
//     clearTimeout(this.refresh);
//     Orientation.removeOrientationListener(this._handleOrientation);
//     // Linking.removeEventListener('url', this._handleOpenURL);
//     AppState.removeEventListener('change', this._handleAppStateChange);

//     // 앱 종료를 막음
//     this.exitApp = false;
//     BackHandler.removeEventListener(
//       'hardwareBackPress',
//       this._handleBackButton
//     );
//   }

//   render() {
//     const { refreshing, selectedRoomId, orientation, alert } = this.state;
//     const { navigation, auth ,setVideoId} = this.props;
//     const plan = auth?.last_company?.membership_code; // 요금제 [WE: 엣지, SP: 싱글팩, ...]

//     let conferenceList = this.props.conference;

//     let started = [];
//     let reservation = [];

//     if (conferenceList.length > 0) {
//       started = conferenceList.filter(i => i.is_started);
//       reservation = conferenceList.filter(i => !i.is_started);
//     }

//     const hideStatusbar =
//       orientation === 'LANDSCAPE' ||
//       orientation === 'LANDSCAPE-LEFT' ||
//       orientation === 'LANDSCAPE-RIGHT';

//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar
//           barStyle="light-content"
//           backgroundColor={'#1C90FB'}
//           hidden={hideStatusbar}
//         />
//         <NavigationEvents
//           onDidFocus={() => {
//             this._isFocus = true;
//             this._handleRefressAfterWhile();
//           }}
//           onDidBlur={() => (this._isFocus = false)}
//         />
//         <HomeScreenPresenter
//           plan={plan}
//           navigation={navigation}
//           refreshing={refreshing}
//           permission={this.props.permission}
//           started={started}
//           reservation={reservation}
//           auth={auth}
//           selectedRoomId={selectedRoomId}
//           alert={alert}
//           memberType={auth.member_type}
//           onRedirect={this._handleRedirect}
//           onRefresh={this._handleRefresh}
//           onSearch={this._handleSearch}
//           onGetWetalkList={this._handleGetWetalkList}
//           orientation={this.state.orientation}
//           setVideoId={setVideoId}
//           hasNotch={hasNotch}
//         />
//       </View>
//     );
//   }

//   _getServices = async () => {
//     const { auth, setDeployedServices } = this.props;

//     const neors = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'neors'
//     );
//     const wedrive = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'wedrive'
//     );
//     const attendance = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'attendance'
//     );
//     const eapprovals = await ServiceCheckApi.anotherServiceCheck(
//       auth,
//       auth.last_company,
//       'eapprovals'
//     );
//     const isDeployedServices = ['wehago'];
//     neors && isDeployedServices.push('neors');
//     wedrive && isDeployedServices.push('wedrive');
//     attendance && isDeployedServices.push('attendance');
//     eapprovals && isDeployedServices.push('eapprovals');
//     setDeployedServices(isDeployedServices);
//     // this.setState({ isDeployedServices, ...this.state });
//   };

//   _handleBackButton = () => {
//     // if(this.props.navigation)
//     if (!this.props.navigation.isFocused()) return false;

//     this.props.navigation.closeDrawer();

//     // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
//     if (this.exitApp == undefined || !this.exitApp) {
//       ToastAndroid.show(this.t('renewal.toast_closeapp'), ToastAndroid.SHORT);
//       this.exitApp = true;

//       this.timeout = setTimeout(() => {
//         this.exitApp = false;
//       }, 1000);
//     } else {
//       clearTimeout(this.timeout);

//       BackHandler.exitApp(); // 앱 종료
//     }
//     return true;
//   };

//   _handleOrientation = orientation => {
//     this.setState({ orientation });
//   };

//   _handleOpenURL = event => {
//     this._handleOpenLink(event.conferenceCall || event.url);
//   };

//   _handleOpenLink = url => {
//     if (!url) return;
//     let result;
//     // 로그인이 되어있을 때 연결 요청이 왔을 시 url: string
//     // 비로그인상태에서 연결 요청후 위하고 앱으로 로그인을 진행하면 url: object
//     if (typeof url === 'string') result = querystringParser(url);
//     else result = url;
//     // 로그인 요청 시간 체크
//     if (result.timestamp) {
//       const timestamp_now = Date.now();
//       // 오래된(15초 이상) 연결요청의 경우 무시
//       if (timestamp_now - result.timestamp > 15000) return;
//     }

//     // console.warn('RESULT :: ', result);
//     if (result.is_creater) {
//       // 화상회의 실행
//       if (this.state.room_id === result.room_id) return;
//       // console.warn(url);
//       this.setState({ room_id: result.room_id }, () => {
//         this._handleCheckConference(result.room_id, result);
//       });
//     } else if (result.flag === 'T') {
//       // 모바일 웹 메신저에서 접근하게 되면 여기로 옴
//       this._handleRedirect('ConferenceState', {
//         item: {
//           roomId: result.video_id,
//           externalData: null,
//           from: 'meet'
//         }
//       });
//     } else {
//       if (result.message) alert(result.message);
//       return;
//     }
//   };

//   _handleRedirect = (url, param) => {
//     const { navigation } = this.props;
//     navigation.navigate(url, param);
//   };

//   _handleSearch = searchKeyword => {
//     this.setState({ searchKeyword });
//   };

//   _handleRefressAfterWhile = () => {
//     this.refresh = setTimeout(this._handleRefresh, 250);
//   };

//   _handleRefresh = () => {
//     // if (AppState.currentState === 'active' && this._isFocus) {
//     //   this._refreshTimeStamp = Date.now();
//     //   this.setState({ refreshing: true });
//     //   this._handleAutoLogin();
//     // }
//   };

//   _handleGetWetalkList = async () => {
//     const { auth, onSetWetalkList, onSetConferenceList } = this.props;
//     // 메신저조회 API

//     // 위톡방 기준 create 할때를 위해 위톡방 리스트를 가져 올 필요가 있음 그래서 살려둔 api
//     const wetalkList = await WetalkApi.getWetalkList(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.portal_id,
//       auth.HASH_KEY
//     );
//     onSetWetalkList(
//       wetalkList.resultData.video_room_list.sort((a, b) =>
//         a.send_timestamp < b.send_timestamp ? 1 : -1
//       )
//     );

//     if (wetalkList.errors) {
//       return this._handleAutoLogin();
//     }
//     // 실제 받아오는 화상회의 리스트
//     const cl = await MeetApi.getMeetRoomsList(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.portal_id,
//       auth.HASH_KEY
//     );
//     // 토큰만료시
//     if (cl) {
//       onSetConferenceList(
//         cl.resultData.sort((a, b) =>
//           a.start_date_time < b.start_date_time ? 1 : -1
//         )
//       );
//     }

//     this.setState({ refreshing: false });
//   };

//   _handleAutoLogin = async (count = 0) => {
//     const { auth } = this.props;
//     // 접속자 확인
//     const checkResult = await this._loginCheckRequest(
//       auth.AUTH_A_TOKEN,
//       auth.AUTH_R_TOKEN,
//       auth.last_access_company_no,
//       auth.HASH_KEY,
//       this.props.from
//     );
//     // 재 로그인

//     if (checkResult.errors) {
//       if (checkResult.errors.code === 'E002') {
//         this.props.setAlert({
//           type: 1,
//           title: this.t('renewal.alert_title_login_fail'),
//           message: this.t('renewal.alert_text_duplicate_logout')
//         });
//         this.props.sessionCheck(false);
//       } else {
//         this.props.onDisconnect();
//       }
//       this.props.setDestination('Login');
//       this.props.onLogout();
//     } else {
//       this._handleGetWetalkList();
//     }
//   };

//   _loginCheckRequest = async (
//     AUTH_A_TOKEN,
//     AUTH_R_TOKEN,
//     cno,
//     HASH_KEY,
//     from
//   ) => {
//     const checkResult = await UserApi.check(
//       AUTH_A_TOKEN,
//       AUTH_R_TOKEN,
//       cno,
//       HASH_KEY
//     );

//     if (checkResult.resultCode === 200) {
//       const {autoLogin} = this.props;
//       const userData = {
//         // login api data
//         AUTH_A_TOKEN,
//         AUTH_R_TOKEN,
//         HASH_KEY,
//         cno,
//         // check api data
//         user_no: checkResult.resultData.user_no,
//         portal_id: checkResult.resultData.portal_id, // 아이디
//         user_name: checkResult.resultData.user_name,
//         user_default_email: checkResult.resultData.user_default_email,
//         user_email: checkResult.resultData.user_email,
//         profile_url: checkResult.resultData.profile_url,
//         user_contact: checkResult.resultData.user_contact,
//         employee_list: checkResult.resultData.employee_list, // 회사정보
//         last_access_company_no: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.last_access_company_no
//           : cno,
//         last_company: checkResult.resultData.last_access_company_no
//           ? checkResult.resultData.employee_list.filter(
//               e => e.company_no == checkResult.resultData.last_access_company_no
//             )[0]
//           : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
//         member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
//         nickname: checkResult.nickname,
//         membership_code: checkResult.resultData.employee_list[0].membership_code
//       };
//       this.props.login(userData, from, autoLogin);
//       return checkResult;
//     } else {
//       const result = checkResult.errors ? checkResult : { errors: checkResult };
//       this.props.eventLog(result);
//       return result;
//     }
//   };

//   _handleCheckConference = async (
//     // 외부 (위하고 앱) 에서 접근할때 만 여기로 오게 됨
//     conferenceId,
//     externalData = null,
//     selectedRoomName = null,
//     from
//   ) => {
//     let { auth } = this.props;
//     let callType = 3;
//     let isCreator;
//     // 위하고(외부)에서 접속인지 아닌지 구분
//     auth = {
//       ...auth,
//       conferenceId,
//       portal_id: externalData.owner_id,
//       user_name: externalData.owner_name,
//       last_access_company_no: externalData.cno,
//       AUTH_A_TOKEN: externalData.access
//     };

//     callType = externalData.call_type; // 1:화상 / 2:음성
//     isCreator = externalData.is_creater; // 0:생성자 / 1:참여자 / 9:비즈박스알파

//     this._handleRedirect('Conference', {
//       item: {
//         videoRoomId: conferenceId,
//         callType,
//         isCreator
//       }
//     });
//   };

//   _handleModalChange = (
//     visible = false,
//     title = '',
//     message = '',
//     onClose = () => {}
//   ) => {
//     this.setState({
//       alert: {
//         visible,
//         title,
//         message,
//         onClose
//       }
//     });
//   };

//   _handleAppStateChange = nextAppState => {
//     if (
//       this.state.appState.match(/inactive|background/) &&
//       nextAppState === 'active'
//     ) {
//       this._handleRefressAfterWhile();
//     }
//     this.setState({ appState: nextAppState });
//   };
// }

// export default HomeScreenContainer;
