import React, { Component } from 'react';
import {
  Platform,
  ToastAndroid,
  Alert,
  Linking,
  BackHandler
} from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import ServerNotiveCheck from '../../components/ServerNotiveCheck';
import { MeetApi, ServiceCheckApi } from '../../services';
import RNRestart from 'react-native-restart';

import { querystringParser } from '../../utils';

const JailMonkey =
  Platform.OS === 'android' && WEHAGO_ENV === 'WEHAGOV'
    ? require('jail-monkey').default
    : null;

class SplashScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // alert: false
      first: true,
      index: 0,
      servernoti: []
    };
  }

  componentDidMount = async () => {
    // 루팅 확인 및 디버깅 모드 확인
    let result = false;
    result = await this._handleCheckSecurity();
    if (!result) return;

    // 로그인 확인

    // 딥링크 확인
    if (this.props.url.url) {
      // url이 있으면 이 함수 안에서
      // this.props.onChangeState(true);
      // 작업을 해야 빈틈이 없음
      await this._handleGetWehagoToken(this.props.url);
    } else {
      let servernoti = [];
      // 버전 확인
      servernoti = await this._handleCheckVersion(servernoti);
      // // 노티 확인
      servernoti = await this._handleCheckNotice(servernoti);
      if (servernoti.length > 0) {
        this.setState({ servernoti, index: 0 });
      } else {
        this._handleCheckAutoLogin();
      }
    }
  };

  render() {
    const { alert, servernoti, index } = this.state;
    return (
      <SplashScreenPresenter alert={alert} servernoti={servernoti[index]} />
    );
  }

  _handleCheckSecurity = async () => {
    const isJailBroken = JailMonkey?.isJailBroken();
    const isDebuggedMode = await JailMonkey?.isDebuggedMode();
    if (
      Platform.OS === 'android' &&
      WEHAGO_ENV === 'WEHAGOV' &&
      (isJailBroken || isDebuggedMode)
    ) {
      Alert.alert(
        '알림',
        '루팅된 단말에서는 WEHAGO모바일 서비스 이용이 제한됩니다. 보안을 위해 앱을 종료합니다.',
        [{ text: '확인', onPress: () => BackHandler.exitApp() }],
        { cancelable: false }
      );
      return false;
    }
    return true;
  };

  _handleCheckVersion = async noti => {
    const result = await MeetApi.checkVersion();
    // 버전 수정
    const android_major_version = '1';
    const ios_major_version = '1';
    const android_version = '1.7.1';
    const ios_version = '1.25.1';

    const platform = Platform.OS;

    let title = '업데이트';
    let message;
    let button;
    let onclick;

    if (platform === 'android') {
      if (android_major_version !== result.resultData.android_major_version) {
        message =
          '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.';
        buttons = [
          {
            text: '업데이트',
            onclick: () =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.wehago.meet'
              )
          }
        ];
      } else if (android_version !== result.resultData.android_version) {
        message =
          '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.\n\n지금 업데이트 하시겠습니까?';
        buttons = [
          { test: '아니오', onclick: () => this._handleNextNotice() },
          {
            text: '업데이트',
            onclick: () =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.wehago.meet'
              )
          }
        ];
        onclick = [
          () => this._handleNextNotice(),
          () =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.wehago.meet'
            )
        ];
      }
    } else {
      if (ios_major_version !== result.resultData.ios_major_version) {
        message =
          '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.';
        buttons = [
          {
            text: '업데이트',
            onclick: () =>
              Linking.openURL('https://itunes.apple.com/app/id1455726925?mt=8')
          }
        ];
        onclick = [
          () =>
            Linking.openURL('https://itunes.apple.com/app/id1455726925?mt=8')
        ];
      } else if (ios_version !== result.resultData.ios_version) {
        message =
          '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.\n\n지금 업데이트 하시겠습니까?';
        buttons = [
          { text: '아니오', onclick: () => this._handleNextNotice() },
          {
            text: '업데이트',
            onclick: () =>
              Linking.openURL('https://itunes.apple.com/app/id1455726925?mt=8')
          }
        ];
        onclick = [
          () => this._handleNextNotice(),
          () =>
            Linking.openURL('https://itunes.apple.com/app/id1455726925?mt=8')
        ];
      }
    }
    if (message) {
      noti.push({
        title,
        message,
        button,
        onclick
      });
    }

    return noti;
  };

  _handleCheckNotice = async noti => {
    const result = await MeetApi.checkNotice();

    // 확인코드 :101
    // 강제종료 코드 : 102

    result.resultData.forEach(e => {
      e.buttons = [
        {
          text: e.code === 102 ? '종료' : '확인',
          onclick:
            e.code === 102
              ? () => RNRestart.Restart()
              : () => this._handleNextNotice()
        }
      ];
    });
    noti = noti.concat(result.resultData);
    return noti;
  };

  _handleNextNotice = () => {
    const { servernoti, index } = this.state;
    if (servernoti.length === index + 1) {
      this._handleCheckAutoLogin();
    } else {
      this.setState({
        ...this.state,
        index: index + 1
      });
    }
  };

  _handleCheckAutoLogin = async () => {
    const { auth, loginCheckRequest } = this.props;
    if (auth.AUTH_A_TOKEN) {
      const result = await loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        props.isWehagoLogin
      );
      if (result.errors) {
        this.props.onChangeState({
          loaded: true,
          destination: 'login'
        });
      } else {
        return this._handleOnLogin();
      }
    } else {
      this.props.onChangeState({
        loaded: true,
        destination: 'login'
      });
    }
  };
  _handleOnCloseAlert = callback => {
    this.setState(
      {
        alert: { visible: false, type: 0, description: '' }
      },
      () => {
        callback && callback();
      }
    );
  };

  /**
   * DeepLink 로 접근한 경우
   */
  _handleGetWehagoToken = async event => {
    /* 모바일 웹에서 화상회의로 들어올 때 (메신저, meet 둘다 공통)    
      ?portal_id=sadb0101 // 아이디
      &mHASH_KEY=4737240669613779471317246605417595221 // wehago_s
      &mAuth_r_token=1jKg3vXzvd5yR6kxKUGgJUYDaMhKcF // r토큰
      &mAuth_a_token=Rxhh9pCzoLpB5I1M6m36aqoDe5Ivxu // a토큰
      &cno=9 // h_selected_company_no

      &video_id=a25f15cb-01d9-44cf-bafa-4b7122022cb3 // video chat id
      &room_name=123 // talk방 이름
      &flag=T // string 형식의 대문자 'T' 고정값 기존 코드를 건들지 않고 새로 대화방으로 바로 갈 수 있도록 짜야할 필요성이 있었음
    */
    if (!event.url) return;
    let result = querystringParser(event.url);
    // 화상회의 요청인지 판별
    if (result.is_creater || result.type) {
      // 로그인 체크 없이 바로 화상대화로 넘어가야하는 경우가 있음
      // timestamp : 로그인 시간 체크
      this._handleCheckConference({ ...result, timestamp: Date.now() });
      // this.conferenceCall = { ...result };
      return;
    }

    let proceed = true;
    // 존재하는 로그인 정보와 받은 로그인 정보를 비교
    if (Object.keys(this.props.auth).length !== 0) {
      if (
        this.props.auth.last_access_company_no !== Number(result.cno) ||
        this.props.auth.portal_id !== result.portal_id
      ) {
        proceed = await new Promise(resolve => {
          Alert.alert(
            '알림',
            '기존 로그인 정보와 다른 정보로 접근되었습니다. 변경된 정보로 로그인 하시겠습니까?',
            [
              {
                text: '확인',
                onPress: () => {
                  resolve(true);
                }
              },
              {
                text: '취소',
                onPress: () => {
                  resolve(false);
                }
              }
            ]
          );
        });
      }
      result = { ...result, onetime: false };
    } else {
      // 1회용 접근인지 아닌지 판단
      result = { ...result, onetime: true };
    }
    if (!proceed) return;

    if (!result.mAuth_a_token) {
      // FIXME: 없어도 될것만 같은 코드 각을 재보자
      Platform.OS === 'ios'
        ? Alert.alert('Login', '현재 위하고에 로그인되어 있지 않습니다.')
        : ToastAndroid.show(
            '현재 위하고에 로그인되어 있지 않습니다.',
            ToastAndroid.SHORT
          );
    }
    // 로그인 진행
    this._handleSaveUserinfo(
      result.mAuth_a_token,
      result.mAuth_r_token,
      result.mHASH_KEY,
      result.cno,
      true // 위하고앱으로 로그인인지 구분
    );
  };

  _handleSaveUserinfo = async (
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    cno,
    isWehagoLogin
  ) => {
    if (!AUTH_A_TOKEN) return;

    const { loginCheckRequest } = this.props;
    const result = await loginCheckRequest(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY,
      isWehagoLogin
    );
    if (result.errors) {
      if (result.errors.code === 'E002') {
        if (isWehagoLogin) this._handleOnAlert(3);
        else this._handleOnAlert(2);
      } else if (result.errors.status === '400') {
        Alert.alert('Login', '로그인 정보가 잘못되었습니다.');
      } else if (result.errors.status === '401') {
        Alert.alert('Login', '권한이 없습니다.');
      } else if (result.errors.message === 'timeout') {
        Alert.alert('Login', `요청 시간을 초과했습니다. 다시 시도해주세요.`);
      } else {
        Alert.alert('Login', `사소한 문제가 발생했습니다. 다시 시도해주세요.`);
      }
      return;
    } else if (
      result.resultData.user_name ||
      result.resultData.auth.user_name
    ) {
      this._handleOnLogin();
    }
  };

  _handleOnLogin = async () => {
    // 회사 상태 조회 후 진행
    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      this.props.auth,
      this.props.auth.last_company
    );
    // 이상이 없는 회사일 경우 로그인 정상 진행
    if (statusCheck && statusCheck.code === 200) {
      // 서비스 구매여부 조회
      const isPurchase = await ServiceCheckApi.serviceCheck(
        this.props.auth,
        this.props.auth.last_company,
        'P' // 구매여부 확인
      );
      // 서비스 배포여부 조회
      const isDeploy = await ServiceCheckApi.serviceCheck(
        this.props.auth,
        this.props.auth.last_company,
        'D' // 배포여부 확인
      );
      this.props.setPermission(isDeploy);

      // this.setState({ isLogin: true, hasService: isPurchase });

      this.props.onChangeState({
        loaded: true,
        destination: 'list'
      });
    } else if (statusCheck && statusCheck.code === 400) {
      // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
      Alert.alert('알림', statusCheck.message);
      // this.setState({ isLogin: true, hasService: false });
      this.props.onChangeState({
        loaded: true,
        destination: 'selectCompany'
      });
    } else {
      // 중간에 알 수 없는 오류 발생 시
      this.props.onChangeState({
        loaded: true,
        destination: 'selectCompany'
      });
    }
  };

  _handleCheckConference = async (
    // 외부 (위하고 앱) 에서 접근할때 만 여기로 오게 됨
    params
  ) => {
    // let { auth } = this.props;
    // // 위하고(외부)에서 접속인지 아닌지 구분
    // auth = {
    //   ...auth,
    //   conferenceId: params.room_id,
    //   portal_id: params.owner_id,
    //   user_name: params.owner_name,
    //   last_access_company_no: params.cno,
    //   AUTH_A_TOKEN: params.access
    // };
    let videoRoomId = params.room_id;
    let callType = params.call_type; // 1:화상 / 2:음성
    let isCreator = params.is_creater; // 0:생성자 / 1:참여자 / 9:비즈박스알파
    let timestamp = params.timestamp;
    this.props.onChangeState({
      loaded: true,
      destination: 'Conference',
      params: {
        item: {
          videoRoomId,
          callType,
          isCreator,
          timestamp
        },
        auth: {
          conferenceId: params.room_id,
          portal_id: params.owner_id,
          user_name: params.owner_name,
          last_access_company_no: params.cno,
          AUTH_A_TOKEN: params.access
        }
      }
    });

    // this._handleRedirect('Conference', {
      /* 
      여기서 막힘
      여기는 네비게이션으로 묶여있지 않기때문에 navigation을 쓸수가 없음
      여기서 모든 걸 처리 한 뒤 main으로 넘겨서 각각 네비게이션을 이용하던가 해야함
      여기서 해야하는것
      버전, 노티 확인후 다이얼로그 띄워주기
      딥링크 처리
      (로그인 or 화상대화 입장)
      main에서 처리해야할게
      로그인이 안되어 있으면 로그인 페이지를 보여준다
      로그인 되어있으면 리스트 창으로
      로그인 없이 화상대화면 화상대화방으로
      참여코드일경우 설정창으로
      꼭꼭 여길 보자ㅌ
      */
    //   item: {
    //     videoRoomId,
    //     callType,
    //     isCreator
    //   }
    // });
  };

  _handleOnAlert = type => {
    return new Promise((resolve, reject) => {
      let description = '';
      let actions = [];
      let onClose = this._handleOnCloseAlert;

      switch (type) {
        case 1:
          description =
            '고객님의 다른 기기에서 WEHAGO를 사용하고 있습니다. 기존 접속을 종료하시고 새로 접속하시겠습니까?';
          onClose = () => {
            this._handleOnCloseAlert();
            resolve(false);
          };
          actions = [
            {
              name: '취소',
              action: () => {
                console.warn('취소');
                this._handleOnCloseAlert();
                resolve(false);
              }
            },
            {
              name: '확인',
              action: () => {
                this._handleOnCloseAlert();
                resolve(true);
              }
            }
          ];
          break;
        case 2:
          description =
            WEHAGO_ENV === 'WEHAGOV'
              ? '세션이 만료되었습니다. 다시 로그인 해주세요.'
              : '고객님의 다른 기기에서 WEHAGO 접속정보가 확인되어 로그아웃 됩니다.';
          onClose = async () => {
            this._handleOnCloseAlert(
              () =>
                JSON.stringify(this.props.auth) !== '{}' &&
                this.props.onLogout()
            );
            resolve(false);
          };
          actions = [
            {
              name: '확인',
              action: () => {
                this._handleOnCloseAlert(
                  () =>
                    JSON.stringify(this.props.auth) !== '{}' &&
                    this.props.onLogout()
                );
                resolve(false);
              }
            }
          ];
          break;
        case 3:
          description = 'WEHAGO 에서 로그아웃 하였습니다.';
          onClose = async () => {
            this._handleOnCloseAlert(
              () =>
                JSON.stringify(this.props.auth) !== '{}' &&
                this.props.onLogout()
            );
            resolve(false);
          };
          actions = [
            {
              name: '확인',
              action: () => {
                this._handleOnCloseAlert(
                  () =>
                    JSON.stringify(this.props.auth) !== '{}' &&
                    this.props.onLogout()
                );
                resolve(false);
              }
            }
          ];
          break;
        default:
          this.setState({
            alert: {
              visible: false,
              type,
              description,
              onClose
            }
          });
          resolve(false);
          return;
      }

      this.setState({
        alert: { visible: true, type, description, actions, onClose }
      });
    });
  };

  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate(url, param);
  };
}

export default SplashScreenContainer;
