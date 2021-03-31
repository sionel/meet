import React, { Component } from 'react';
import {
  AppState,
  StatusBar,
  Linking,
  Platform,
  View,
  ToastAndroid,
  BackHandler
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';
import { NavigationEvents } from 'react-navigation';

import HomeScreenPresenter from './HomeScreenPresenter';

// service
import { WetalkApi, MeetApi } from '../../services';
import { querystringParser } from '../../utils';

import { getT } from '../../utils/translateManager';
const hasNotch = DeviceInfo.hasNotch() && Platform.OS === 'ios';

class HomeScreenContainer extends Component {
  constructor(props) {
    super(props);
    this._isFocus = true;
    this._refreshTimeStamp = Date.now();
    this.t = getT();
  }

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

  async componentDidMount() {
    // 화면 회전 처리
    Orientation.getOrientation(orientation => {
      this.setState({ orientation });
    });
    Orientation.addOrientationListener(this._handleOrientation);

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

  render() {
    const { refreshing, selectedRoomId, orientation, alert } = this.state;
    const { navigation, auth } = this.props;
    const plan = auth.last_company.membership_code; // 요금제 [WE: 엣지, SP: 싱글팩, ...]

    let conferenceList = this.props.conference;

    let started = [];
    let reservation = [];

    if (conferenceList.length > 0) {
      started = conferenceList.filter(i => i.is_started);
      reservation = conferenceList.filter(i => !i.is_started);
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
          permission={this.props.permission}
          started={started}
          reservation={reservation}
          auth={auth}
          selectedRoomId={selectedRoomId}
          alert={alert}
          memberType={this.props.auth.member_type}
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

  _handleBackButton = () => {
    // if(this.props.navigation)
    if (!this.props.navigation.isFocused()) return false;

    this.props.navigation.closeDrawer();

    // 1000(1초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
    if (this.exitApp == undefined || !this.exitApp) {
      ToastAndroid.show(this.t('toast.뒤로버튼'), ToastAndroid.SHORT);
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

  _handleOrientation = orientation => {
    this.setState({ orientation });
  };

  _handleOpenURL = event => {
    this._handleOpenLink(event.conferenceCall || event.url);
  };

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

  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate(url, param);
  };

  _handleSearch = searchKeyword => {
    this.setState({ searchKeyword });
  };

  _handleRefressAfterWhile = () => {
    this.refresh = setTimeout(this._handleRefresh, 250);
  };

  _handleRefresh = () => {
    if (AppState.currentState === 'active' && this._isFocus) {
      this._refreshTimeStamp = Date.now();
      this.setState({ refreshing: true });
      this._handleAutoLogin();
    }
  };

  _handleGetWetalkList = async () => {
    const { auth, onSetWetalkList, onSetConferenceList } = this.props;
    // 메신저조회 API

    // 위톡방 기준 create 할때를 위해 위톡방 리스트를 가져 올 필요가 있음 그래서 살려둔 api
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
    // 실제 받아오는 화상회의 리스트
    const cl = await MeetApi.getMeetRoomsList(
      auth.AUTH_A_TOKEN,
      auth.AUTH_R_TOKEN,
      auth.last_access_company_no,
      auth.portal_id,
      auth.HASH_KEY
    );
    // 토큰만료시
    if (cl) {
      onSetConferenceList(
        cl.resultData.sort((a, b) =>
          a.start_date_time < b.start_date_time ? 1 : -1
        )
      );
    }

    this.setState({ refreshing: false });
  };

  _handleAutoLogin = async (count = 0) => {
    const { auth, loginCheckRequest } = this.props;
    // 접속자 확인
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
        this.props.setAlert({
          type: 1,
          title: this.t('alert.title.fail'),
          message: this.t('alert.text.duplicate_logout')
        });
        this.props.sessionCheck(false);
      } else {
        this.props.onDisconnect();
      }
      this.props.onLogout()
    } else {
      this._handleGetWetalkList();
    }
  };

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
        isCreator
      }
    });
  };

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

export default HomeScreenContainer;
