/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React, { Component, Fragment } from 'react';
import {
  AppState,
  StatusBar,
  Linking,
  Platform,
  Dimensions,
  View,
  Text,
  NativeModules,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  // DrawerLayoutAndroid
  ToastAndroid,
  BackHandler
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
// import GestureRecognizer, {
//   swipeDirections
// } from 'react-native-swipe-gestures';

import HomeScreenPresenter from './HomeScreenPresenter';

// service
import { WetalkApi } from '../../services';
import { UserApi } from '../../services';
import { ConferenceApi } from '../../services';
import { NavigationEvents } from 'react-navigation';
import { querystringParser } from '../../utils';

import DrawerContent from '../../components/DrawerContent';
const { height, width } = Dimensions.get('window');
const hasNotch = DeviceInfo.hasNotch();

// #region

class HomeScreenContainer extends Component {
  /**
   * constructor
   */
  constructor(props) {
    super(props);
    this._isFocus = true;
    this._refreshTimeStamp = Date.now();

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  /**
   * STATE
   */
  state = {
    appState: AppState.currentState,
    refreshing: false, // 리프레시 상태
    searchKeyword: '', // 검색인풋
    selectedRoomId: null,
    modal: false,
    url: null,
    orientation: 'UNKNOWN'
  };

  /**
   * componentDidMount
   */
  componentDidMount() {
    // 화면 회전 처리
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);

    // 딥링크에 처리
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('url : ' + url);
        this._handleOpenURL({ url });
      }
    });
    Linking.addEventListener('url', this._handleOpenURL);

    // 주기적으로 앱 업데이트
    AppState.addEventListener('change', this._handleAppStateChange);
    this._interval = setInterval(() => {
      if (Date.now() > this._refreshTimeStamp + 3000) {
        // 리프레쉬 할 시간이 지났으면 리프레쉬 한다.
        this._handleRefresh();
      }
    }, 15000);

    // 뒤로가기 버튼 동작
    BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    clearInterval(this._interval);
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
    // console.log('Platform : ', Platform);
    const { refreshing, searchKeyword, selectedRoomId, modal } = this.state;
    const { navigation, auth } = this.props;
    let wetalk = []; // We talk list

    if (searchKeyword) {
      wetalk = this.props.wetalk.filter(item =>
        item.room_title.match(searchKeyword)
      );
    } else {
      wetalk = this.props.wetalk;
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={'#1C90FB'} />
        <NavigationEvents
          onDidFocus={() => {
            this._isFocus = true;
            this._handleRefressAfterWhile();
          }}
          onDidBlur={() => (this._isFocus = false)}
        />
        {/* <GestureRecognizer
          onSwipeRight={state => this.onSwipeRight(state)}
          style={{ flex: 1 }}
        > */}
        {/* <DrawerLayoutAndroid
          drawerWidth={Math.min(height, width) * 0.75}
          renderNavigationView={() => <DrawerContent navigation={navigation} />}
        > */}
        <HomeScreenPresenter
          navigation={navigation}
          refreshing={refreshing}
          modal={modal}
          list={wetalk}
          auth={auth}
          selectedRoomId={selectedRoomId}
          onActivateModal={this._handleActivateModal}
          onRedirect={this._handleRedirect}
          onRefresh={this._handleRefresh}
          onSearch={this._handleSearch}
          onCreateConference={this._handleCreateConference}
          onCheckConference={this._handleCheckConference}
          orientation={this.state.orientation}
          hasNotch={hasNotch}
        />
        {/* </DrawerLayoutAndroid> */}
        {/* </GestureRecognizer> */}
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
    console.log('=============ㅁㄴㅇㄹ=============');
    console.log(event);
    console.log('===========ㅁㄴㅇㄹ===============');
    alert(JSON.stringify(event));
    // const result = querystringParser(url);
    // this._handleRedirect('Conference', { item: { videoRoomId: result.room_id } });
    this._handleOpenLink(event.url);
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
   * 딥링크로 전달받은 화상대화 접속
   */
  _handleOpenLink = url => {
    const result = querystringParser(url);
    // console.log('RESULT :: ', result);
    // if (result.type === '3') {
    if (typeof result === 'string') {
      // 위하고 로그인일 경우 예외처리
      return;
    } else if (result.is_creater) {
      // 화상대화 실행
      this._handleCheckConference(result.room_id, result);
    } else {
      return;
    }
    // 화상대화 타입 (생성:0/참여:1)
    // if (result.type == '1') {
    // 	this._handleCheckConference(result.room_id, result);
    // } else {
    // 	this._handleCreateConference(result.room_id, result);
    // }
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
    setTimeout(this._handleRefresh, 250);
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
   * 위톡 조회
   */
  _handleGetWetalkList = async () => {
    const { auth, onSetWetalkList } = this.props;
    // console.log('CNO : ', auth.last_access_company_no);
    // 위톡조회 API
    const wetalkList = await WetalkApi.getWetalkList(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.last_access_company_no,
      auth.portal_id,
      auth.HASH_KEY
    );

    // 토큰만료시
    if (wetalkList.errors) {
      // alert('wetalkList.error: ' + JSON.stringify(wetalkList.errors));
      return this._handleAutoLogin();
    }
    this.setState({ refreshing: false });
    onSetWetalkList(wetalkList.resultData.video_room_list);
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
      auth.HASH_KEY
    );

    // 재 로그인
    if (checkResult.errors) {
      if (checkResult.errors.code === 'E002') {
        return this.props.onLogout();
      } else {
        return this.props.onDisconnect();
      }
      // alert('Home: 인증실패\nError: ' + JSON.stringify(checkResult.errors) + '\nToken: ' + copyAuth);
    } else {
      // 최종선택 회사가 달라진 경우
      if (
        auth.last_access_company_no != checkResult.auth.last_access_company_no
      ) {
        userData = {
          ...auth,
          last_access_company_no: checkResult.auth.last_access_company_no,
          last_company: checkResult.auth.employee_list.filter(
            e => e.company_no == checkResult.auth.last_access_company_no
          )[0]
        };
        onLogin(userData);
      }
      this._handleGetWetalkList();
    }
  };

  /**
   * _handleActivateModal
   * 모달뷰 토글
   */
  _handleActivateModal = async (selectedRoomId = null) => {
    this.setState(prev => ({
      modal: !prev.modal,
      selectedRoomId
    }));
  };

  /**
   * _handleCheckConference
   * 화상대화 생성/확인
   */
  _handleCheckConference = async (conferenceId, externalData = null) => {
    let { auth } = this.props;
    let callType = 1;
    let isCreator;
    // 위하고(외부)에서 접속인지 아닌지 구분
    if (externalData !== null) {
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
    } else {
      // 생성여부 체크
      const result = await ConferenceApi.check(
        conferenceId,
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.HASH_KEY
      );
      if (!result.resultData) {
        alert('이미 종료된 대화방입니다.');
        return;
      }
    }
    // 화상대화로 진입
    this._handleRedirect('Conference', {
      item: {
        videoRoomId: conferenceId,
        callType,
        isCreator
      }
    });
  };

  /**
   * _handleCreateConference
   */
  _handleCreateConference = async (selectedRoomId, externalData = null) => {
    let auth;
    let company_code;
    // 위하고에서 접속인지 아닌지 구분
    if (externalData !== null) {
      auth = {
        selectedRoomId,
        portal_id: externalData.owner_id,
        user_name: externalData.owner_name,
        last_access_company_no: externalData.cno,
        AUTH_A_TOKEN: externalData.access
      };
      company_code = externalData.cno;
    } else {
      auth = this.props.auth;
      company_code = auth.employee_list.filter(
        e => e.company_no == auth.last_access_company_no
      )[0].company_code;
    }
    const bodyData = [
      selectedRoomId, // 방 id
      auth.portal_id, // 유저아이디
      auth.user_name, // 유저이름
      auth.last_access_company_no, // 회사번호
      company_code, // 회사코드
      auth.AUTH_A_TOKEN, // 토큰
      auth.AUTH_R_TOKEN, // 토큰
      auth.HASH_KEY
      // null
    ];
    const createResult = await ConferenceApi.create(...bodyData);
    // 화상대화 생성가능여부
    if (createResult.resultCode === 200) {
      // 생성완료 메시지 보내기
      const sendWetalkResult = await ConferenceApi.sendWetalk(
        selectedRoomId,
        createResult.resultData,
        auth.last_access_company_no,
        company_code,
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.HASH_KEY
      );
      this.setState({ modal: false });

      // 대화방에 참여한다.
      const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;
      this._handleRedirect('Conference', { item: { videoRoomId } });
    } else {
      alert('화상대화 생성에 실패하였습니다. 다시 시도해 주세요');
    }
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
      // 포그라운드 전환시 아래 로직 실행
      this._handleRefressAfterWhile();
    } else {
      // Linking.removeEventListener('url', this._handleOpenURL);
    }
    this.setState({ appState: nextAppState });
  };
}
// #endregion

export default HomeScreenContainer;
