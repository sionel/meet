/**
 * HomeScreenContainer
 * 화상회의 히스토리 컨테이너
 */

import React, { Component } from 'react';
import {
  AppState,
  StatusBar,
  Linking,
  Platform,
  Dimensions,
  View,
  ToastAndroid,
  BackHandler,
  Alert
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import { NavigationEvents } from 'react-navigation';

import HomeScreenPresenter from './HomeScreenPresenter';

// service
import { ConferenceApi, WetalkApi, MeetApi } from '../../services';
import { querystringParser } from '../../utils';

const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

// #region

class HomeScreenContainer extends Component {
  /**
   * constructor
   */
  constructor(props) {
    super(props);
    this._isFocus = true;
    this._refreshTimeStamp = Date.now();
  }

  /**
   * STATE
   */
  state = {
    appState: AppState.currentState,
    refreshing: false, // 리프레시 상태
    searchKeyword: '', // 검색인풋
    selectedRoomId: null,
    selectedRoomName: null,
    // modal: false,
    url: null,
    orientation: 'UNKNOWN',
    alert: {
      visible: false,
      title: '',
      message: '',
      onClose: () => {}
    },
    room_id: null
  };

  /**
   * componentDidMount
   */
  async componentDidMount() {

    // 화면 회전 처리
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);

    // Linking.getInitialURL().then(url => {
    //   if (url) {
    //     this._handleOpenURL({ url });
    //   }
    // });
    // [ios] 앱이 실행중에 딥링크에 의한 화상회의 연결방법
    // if (Platform.OS === 'ios') {
    //   Linking.addEventListener('url', this._handleOpenURL);
    // }

    // [android, ios] 앱이 실행중이 아닐 때 화상회의 연결방법
    // if (
    //   this.props.screenProps &&
    //   (this.props.screenProps.url || this.props.screenProps.conferenceCall)
    // ) {
    //   this._handleOpenURL(this.props.screenProps);
    // }

    // 개인 회원 여부 체크
    // 0: 일반, 1: 개인
    if (this.props.auth.member_type !== 1) {
      // 주기적으로 앱 업데이트
      AppState.addEventListener('change', this._handleAppStateChange);
      this._interval = setInterval(() => {
        if (Date.now() > this._refreshTimeStamp + 3000) {
          // 리프레쉬 할 시간이 지났으면 리프레쉬 한다.
          this._handleRefresh();
        }
      }, 15000);
    }

    // 뒤로가기 버튼 동작
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);

  }

  shouldComponentUpdate = (nextProps, nextState) => {
    // [android] 앱이 실행중에 딥링크에 의한 화상회의 연결방법
    if (
      // Platform.OS === 'android' &&
      this.props.screenProps !== nextProps.screenProps
    ) {
      this._handleOpenURL(nextProps.screenProps);
    }

    return true;
  };

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    clearInterval(this._interval);
    clearTimeout(this.refresh);
    Orientation.removeOrientationListener(this._handleOrientation);
    Linking.removeEventListener('url', this._handleOpenURL);
    AppState.removeEventListener('change', this._handleAppStateChange);

    // 앱 종료를 막음
    this.exitApp = false;
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this._handleBackButton
    );
  }

  // onSwipeRight(gestureState) {
  //   this.props.navigation.openDrawer();
  // }

  // #region
  /**
   * Rendering
   */
  render() {
    const {
      refreshing,
      searchKeyword,
      selectedRoomId,
      // modal,
      orientation,
      alert
    } = this.state;
    const { navigation, auth } = this.props;
    const plan = auth.last_company.membership_code; // 요금제 [WE: 엣지, SP: 싱글팩, ...]

    let wetalk = []; // We talk list
    let conferenceList = this.props.conference;

    let started = [];
    let reservation = [];

    if (conferenceList.length > 0) {
      started = conferenceList.filter(i => i.is_started);
      reservation = conferenceList.filter(i => !i.is_started);
    }

    if (searchKeyword) {
      wetalk = this.props.wetalk.filter(item =>
        item.room_title.match(searchKeyword)
      );
    } else {
      wetalk = this.props.wetalk;
    }

    const hideStatusbar =
      orientation === 'LANDSCAPE' ||
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT';

    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'#1C90FB'}
          hidden={hideStatusbar}
        />
        <NavigationEvents
          onDidFocus={() => {
            this._isFocus = true;
            this._handleRefressAfterWhile();
          }}
          onDidBlur={() => (this._isFocus = false)}
        />
        <HomeScreenPresenter
          plan={plan}
          navigation={navigation}
          refreshing={refreshing}
          // modal={modal}
          permission={this.props.permission}
          list={wetalk}
          started={started}
          reservation={reservation}
          auth={auth}
          selectedRoomId={selectedRoomId}
          alert={alert}
          memberType={this.props.auth.member_type}
          // onActivateModal={this._handleActivateModal}
          onRedirect={this._handleRedirect}
          onRefresh={this._handleRefresh}
          onSearch={this._handleSearch}
          onGetWetalkList={this._handleGetWetalkList}
          orientation={this.state.orientation}
          hasNotch={hasNotch}
        />
      </View>
    );
  }
  // #endregion

  /**
   * _handleBackButton
   */
  _handleBackButton = () => {
    // if(this.props.navigation)
    if (!this.props.navigation.isFocused()) return false;

    this.props.navigation.closeDrawer();

    // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      ToastAndroid.show('한번 더 누르면 앱이 종료됩니다.', ToastAndroid.SHORT);
      this.exitApp = true;

      this.timeout = setTimeout(() => {
        this.exitApp = false;
      }, 1000);
    } else {
      clearTimeout(this.timeout);

      BackHandler.exitApp(); // 앱 종료
    }
    return true;
  };

  /**
   * _handleOrientation
   */
  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  _handleOpenURL = event => {
    this._handleOpenLink(event.conferenceCall || event.url);
  };

  /**
   * _handleOpenDeepLink
   * 딥링크접속 시 테스트
   */
  _handleOpenDeepLink = e => {
    Linking.getInitialURL()
      .then(url => {
        if (url) {
          this._handleOpenLink(url);
        }
      })
      .catch(err => alert('다시 시도해 주세요'));
  };

  /**
   * _handleOpenURL
   * 딥링크로 전달받은 화상회의 접속
   */
  _handleOpenLink = url => {
    if (!url) return;
    let result;
    // 로그인이 되어있을 때 연결 요청이 왔을 시 url: string
    // 비로그인상태에서 연결 요청후 위하고 앱으로 로그인을 진행하면 url: object
    if (typeof url === 'string') result = querystringParser(url);
    else result = url;
    // 로그인 요청 시간 체크
    if (result.timestamp) {
      const timestamp_now = Date.now();
      // 오래된(15초 이상) 연결요청의 경우 무시
      if (timestamp_now - result.timestamp > 15000) return;
    }

    // console.warn('RESULT :: ', result);
    if (result.is_creater) {
      // 화상회의 실행
      if (this.state.room_id === result.room_id) return;
      // console.warn(url);
      this.setState({ room_id: result.room_id }, () => {
        this._handleCheckConference(result.room_id, result);
      });
    } else if (result.flag === 'T') {
      // 모바일 웹 메신저에서 접근하게 되면 여기로 옴
      this._handleRedirect('ConferenceState', {
        item: {
          roomId: result.video_id,
          externalData: null,
          from: 'meet'
        }
      });
    } else {
      if (result.message) alert(result.message);
      return;
    }
  };

  /**
   * _handleRedirect
   * 페이지 이동
   */
  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate(url, param);
  };

  /**
   * _handleSearch
   * 검색 필터
   */
  _handleSearch = searchKeyword => {
    this.setState({ searchKeyword });
  };

  /**
   *
   */
  _handleRefressAfterWhile = () => {
    this.refresh = setTimeout(this._handleRefresh, 250);
  };

  /**
   * _handleRefresh
   * 리프레시
   */
  _handleRefresh = () => {
    if (AppState.currentState === 'active' && this._isFocus) {
      this._refreshTimeStamp = Date.now();
      this.setState({ refreshing: true });
      this._handleAutoLogin();
    }
  };

  /**
   * _handleGetWetalkList
   * 메신저 조회
   */
  _handleGetWetalkList = async () => {
    const { auth, onSetWetalkList, onSetConferenceList } = this.props;
    // console.log('CNO : ', auth.last_access_company_no);
    // 메신저조회 API

    const wetalkList = await WetalkApi.getWetalkList(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.last_access_company_no,
      auth.portal_id,
      auth.HASH_KEY
    );
    onSetWetalkList(
      wetalkList.resultData.video_room_list.sort((a, b) =>
        a.send_timestamp < b.send_timestamp ? 1 : -1
      )
    );

    if (wetalkList.errors) {
      return this._handleAutoLogin();
    }

    const cl = await MeetApi.getMeetRoomsList(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.last_access_company_no,
      auth.portal_id,
      auth.HASH_KEY
    );
    // 토큰만료시
    this.setState({ refreshing: false });

    if (cl) {
      onSetConferenceList(
        cl.resultData.sort((a, b) =>
          a.start_date_time < b.start_date_time ? 1 : -1
        )
      );
    }
  };

  /**
   * _handleAutoLogin
   * 접속자확인 및 자동로그인
   */
  _handleAutoLogin = async (count = 0) => {
    const { auth, onLogin, loginCheckRequest } = this.props;

    let userData = {};

    // 재 로그인이 필요한 경우 (저장된 정보가 없을 경우)
    // if (!auth.AUTH_A_TOKEN /* || (!auth.portal_id && !auth.portal_password)*/) {
    // 	alert('auth is null\n접속 정보가 유효하지 않습니다. 다시 로그인 해주세요');
    // 	return this._handleRedirect('Main');
    // }

    // 접속자 확인
    const copyAuth = JSON.stringify(auth);
    const checkResult = await loginCheckRequest(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.last_access_company_no,
      auth.HASH_KEY,
      this.props.from
    );

    // 재 로그인
    if (checkResult.errors) {
      if (checkResult.errors.code === 'E002') {
        return this.props.sessionCheck(false);
        // return this.props.onLogout();
      } else {
        return this.props.onDisconnect();
      }
      // alert('Home: 인증실패\nError: ' + JSON.stringify(checkResult.errors) + '\nToken: ' + copyAuth);
    } else {
      // 최종선택 회사가 달라진 경우
      // if (
      //   auth.last_access_company_no != checkResult.auth.last_access_company_no
      // ) {
      //   userData = {
      //     ...checkResult.auth
      //   };
      //   onLogin(userData);
      // }
      this._handleGetWetalkList();
    }
  };

  /**
   * _handleActivateModal
   * 모달뷰 토글
   */
  // _handleActivateModal = async (
  //   selectedRoomId = null,
  //   selectedRoomName = null
  // ) => {
  //   this.setState(prev => ({
  //     modal: !prev.modal,
  //     selectedRoomId,
  //     selectedRoomName
  //   }));
  // };

  /**
   * _handleCheckConference
   * 화상회의 생성/확인
   */
  _handleCheckConference = async (
    // 외부 (위하고 앱) 에서 접근할때 만 여기로 오게 됨
    conferenceId,
    externalData = null,
    selectedRoomName = null,
    from
  ) => {
    let { auth } = this.props;
    let callType = 3;
    let isCreator;
    // 위하고(외부)에서 접속인지 아닌지 구분
    auth = {
      ...auth,
      conferenceId,
      portal_id: externalData.owner_id,
      user_name: externalData.owner_name,
      last_access_company_no: externalData.cno,
      AUTH_A_TOKEN: externalData.access
    };

    callType = externalData.call_type; // 1:화상 / 2:음성
    isCreator = externalData.is_creater; // 0:생성자 / 1:참여자 / 9:비즈박스알파

    this._handleRedirect('Conference', {
      item: {
        videoRoomId: conferenceId,
        callType,
        isCreator,
      }
    });
  };

  /**
   * _handleModalChange
   */
  _handleModalChange = (
    visible = false,
    title = '',
    message = '',
    onClose = () => {}
  ) => {
    this.setState({
      alert: {
        visible,
        title,
        message,
        onClose
      }
    });
  };


  /**
   * _handleAppStateChange
   * 포그라운드 전환 시 상태변환
   */
  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._handleRefressAfterWhile();
    }
    this.setState({ appState: nextAppState });
  };

  _checkUpdateVersion = async auth => {
    // 버전정보를 확인학 업데이트 다이얼로그를 띄우는 곳
    // 버전정보를 현명하게 보관하고 있지 않으므로 어쩔수없이 강제로 바꿔주도록 한다...
    const ios = '1.25.2';
    const android = '1.7.2';
    const ios_m = '0';
    const android_m = '0';

    const result = await MeetApi.checkVersion(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.HASH_KEY
    );

    const {
      ios_version,
      android_version,
      ios_m_version,
      android_m_version
    } = result.resultData;
    if (ios_m_version !== ios_m || android_m_version !== android_m) {
      return await Alert.alert('업데이트', '해당 버전은 더이상 지원하지 않습니다.', [
        {
          text: '업데이트',
          onPress: () => {
            const os = Platform.OS;
            Linking.openURL(
              os === 'ios'
                ? 'https://itunes.apple.com/app/id1455726925?mt=8'
                : 'https://play.google.com/store/apps/details?id=com.wehago.meet'
            );
          }
        }
      ]);
    } else if (ios_version !== ios || android_version !== android) {
      return await Alert.alert('업데이트', '최신 버전 업데이트가 존재합니다.', [
        {
          text: '업데이트',
          onPress: () => {
            const os = Platform.OS;
            Linking.openURL(
              os === 'ios'
                ? 'https://itunes.apple.com/app/id1455726925?mt=8'
                : 'https://play.google.com/store/apps/details?id=com.wehago.meet'
            );
          }
        },
        {
          text: '취소'
        }
      ]);
    }
  };
}
// #endregion

export default HomeScreenContainer;
