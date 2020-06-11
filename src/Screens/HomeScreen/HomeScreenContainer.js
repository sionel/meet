/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
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
  BackHandler
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import { NavigationEvents } from 'react-navigation';
// import GestureRecognizer, {
//   swipeDirections
// } from 'react-native-swipe-gestures';

import HomeScreenPresenter from './HomeScreenPresenter';

// service
import { ConferenceApi, WetalkApi } from '../../services';
import { querystringParser } from '../../utils';

// import DrawerContent from '../../components/DrawerContent';
// const { height, width } = Dimensions.get('window');
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
  componentDidMount() {
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
    // [ios] 앱이 실행중에 딥링크에 의한 화상대화 연결방법
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this._handleOpenURL);
    }

    // [android, ios] 앱이 실행중이 아닐 때 화상대화 연결방법
    if (
      this.props.screenProps &&
      (this.props.screenProps.url || this.props.screenProps.conferenceCall)
    ) {
      this._handleOpenURL(this.props.screenProps);
    }

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
    // [android] 앱이 실행중에 딥링크에 의한 화상대화 연결방법
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
        {/* <GestureRecognizer
          onSwipeRight={state => this.onSwipeRight(state)}
          style={{ flex: 1 }}
        > */}
        {/* <DrawerLayoutAndroid
          drawerWidth={Math.min(height, width) * 0.75}
          renderNavigationView={() => <DrawerContent navigation={navigation} />}
        > */}
        <HomeScreenPresenter
          plan={plan}
          navigation={navigation}
          refreshing={refreshing}
          // modal={modal}
          permission={this.props.permission}
          list={wetalk}
          auth={auth}
          selectedRoomId={selectedRoomId}
          alert={alert}
          memberType={this.props.auth.member_type}
          // onActivateModal={this._handleActivateModal}
          onRedirect={this._handleRedirect}
          onRefresh={this._handleRefresh}
          onSearch={this._handleSearch}
          onGetWetalkList={this._handleGetWetalkList}
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
    // const result = querystringParser(url);
    // this._handleRedirect('Conference', { item: { videoRoomId: result.room_id } });
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
   * 딥링크로 전달받은 화상대화 접속
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
      // 화상대화 실행
      if (this.state.room_id === result.room_id) return;
      // console.warn(url);
      this.setState({ room_id: result.room_id }, () => {
        this._handleCheckConference(result.room_id, result);
      });
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
    onSetWetalkList(
      wetalkList.resultData.video_room_list.sort((a, b) =>
        a.send_timestamp < b.send_timestamp ? 1 : -1
      )
    );
    // onSetWetalkList(wetalkList.resultData.video_room_list);
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
      this.props.isWehagoLogin
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
   * 화상대화 생성/확인
   */
  _handleCheckConference = async (
    conferenceId,
    externalData = null,
    selectedRoomName = null
  ) => {
    let { auth } = this.props;
    let callType = 3;
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

      // 대화방 정보를 얻어서 생성되어 있는 방인지 확인
      if (!result.resultData) {
        this._handleModalChange(
          true,
          '화상대화',
          '이미 종료된 대화방입니다.',
          this._handleModalChange
        );
        return;
      }

      const participantList = (
        await ConferenceApi.getParticipant(
          result.resultData.video_chat_id,
          auth.AUTH_A_TOKEN,
          auth.AUTH_R_TOKEN,
          auth.HASH_KEY
        )
      ).resultData;

      // 최대 참여인원 제한 (50명)
      if (participantList.length >= 50) {
        this._handleModalChange(
          true,
          '화상대화',
          '최대 참여인원을 초과했습니다.',
          this._handleModalChange
        );
        return;
      }

      // 이미 대화방에 참여 중인지 확인
      // const isJoin = await participantList.find(participant => {
      //   return participant.user_id === auth.portal_id;
      // });

      // if (isJoin) {
      //   this._handleModalChange(
      //     true,
      //     '화상대화',
      //     '이미 대화방에 접속한 사용자 입니다.',
      //     this._handleModalChange
      //   );
      //   return;
      // }
    }
    // 화상대화로 진입
    this._handleRedirect('Conference', {
      item: {
        videoRoomId: conferenceId,
        callType,
        isCreator,
        selectedRoomName
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
      // this.setState({ modal: false });

      // 대화방에 참여한다.
      const videoRoomId = sendWetalkResult.resultData.chatList[0].mobile_key;
      this._handleRedirect('Conference', { item: { videoRoomId } });
    } else if (createResult.errors && createResult.errors.code === 'E002') {
      this._handleRefresh();
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
      this._handleRefressAfterWhile();
    }
    this.setState({ appState: nextAppState });
  };
}
// #endregion

export default HomeScreenContainer;
