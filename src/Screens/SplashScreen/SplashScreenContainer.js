import React, { Component } from 'react';
import { Platform, Linking, BackHandler } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '../../services';
import RNRestart from 'react-native-restart';

import { querystringParser } from '../../utils';
import jwt_decode from 'jwt-decode';

const JailMonkey =
  Platform.OS === 'android' && WEHAGO_ENV === 'WEHAGOV'
    ? require('jail-monkey').default
    : null;

class SplashScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      index: 0,
      servernoti: []
    };
  }
  setLoginState = () => {
    this.props.onChangeRootState({
      loaded: true,
      destination: 'Login'
    });
  };

  componentDidMount = async () => {
    // 강제종료 했을때를 위한 강제 초기화
    this.props.setInitInfo();
    this.props.setSharingMode();
    // 루팅 확인 및 디버깅 모드 확인
    let result = false;
    result = await this._handleCheckSecurity();

    if (!result) return;
    if (this.props.url) {
      await this._handleGetDeeplink(this.props.url);
    } else {
      this._handleInit();
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.url && !prevProps.url !== this.props.url) {
      this._handleGetDeeplink(this.props.url);
    }
  }

  render() {
    const { alert, servernoti, index } = this.state;
    return (
      <SplashScreenPresenter alert={alert} servernoti={servernoti[index]} />
    );
  }
  _handleInit = async () => {
    let servernoti = [];
    // 버전 확인
    servernoti = await this._handleCheckVersion(servernoti);
    // 노티 확인
    servernoti = await this._handleCheckNotice(servernoti);

    if (servernoti.length > 0) {
      this.setState({ servernoti, index: 0 });
    } else {
      const result = await this._handleCheckAutoLogin();

      if (result === 'success') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List'
        });
      } else if (result === 'dany') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'SelectCompany'
        });
      } else {
        this.props.onLogout();
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login'
        });
      }
    }
  };
  _handleCheckSecurity = async () => {
    const isJailBroken = JailMonkey?.isJailBroken();
    const isDebuggedMode = await JailMonkey?.isDebuggedMode();
    if (
      Platform.OS === 'android' &&
      WEHAGO_ENV === 'WEHAGOV' &&
      (isJailBroken || isDebuggedMode)
    ) {
      this.props.setAlert({
        type: 1,
        title: '알림',
        message:
          '루팅된 단말에서는 WEHAGO모바일 서비스 이용이 제한됩니다. 보안을 위해 앱을 종료합니다.',
        onConfirm: () => BackHandler.exitApp()
      });
      return false;
    }
    return true;
  };

  _handleCheckVersion = async noti => {
    const os = Platform.OS;
    const majorVersion = 3;
    const minorVersion = '2.0.2';
    const result = await MeetApi.checkVersion(os, majorVersion, minorVersion);
    // 버전 수정
    if (!result || !this.props.updateNoti || result.resultData.dev_mode)
      return [];

    const title = '업데이트 안내';
    const type = 'update';
    const message =
      updateType === 'forced'
        ? '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.'
        : '더 새로워진 WEHAGO Meet을 만나보세요.\n\n신규 기능은 업데이트 이후 사용 가능합니다.\n\n지금 업데이트 하시겠습니까?';

    const onToggle = this.props.toggleUpdateNoti;
    const buttonValue = this.props.updateNoti;
    const subMessage = result.resultData.detail_info?.split('\\n');
    const updateType = result.resultData.update;

    const marketUrl =
      os === 'ios'
        ? 'https://itunes.apple.com/app/id1455726925?mt=8'
        : 'https://play.google.com/store/apps/details?id=com.wehago.meet';
    const buttons =
      updateType === 'forced'
        ? [
            {
              text: '업데이트',
              onclick: () => Linking.openURL(marketUrl)
            }
          ]
        : [
            { text: '아니오', onclick: this._handleNextNotice },
            {
              text: '업데이트',
              onclick: () => Linking.openURL(marketUrl)
            }
          ];
    const onclick =
      updateType === 'forced'
        ? [() => Linking.openURL(marketUrl)]
        : [this._handleNextNotice, () => Linking.openURL(marketUrl)];

    noti.push({
      title,
      message,
      buttons,
      onclick,
      subMessage,
      type,
      onToggle,
      buttonValue
    });

    return noti;
  };

  _handleCheckNotice = async noti => {
    const result = await MeetApi.checkNotice();

    if (!result) return [];
    // 확인코드 :101
    // 강제종료 코드 : 102

    result.resultData.forEach(e => {
      if (!e.dev_mode) {
        e.button_type = [
          {
            text: e.code === 102 ? '종료' : '확인',
            onclick:
              e.code === 102
                ? () => RNRestart.Restart()
                : () => this._handleNextNotice()
          }
        ];
      }
    });
    noti = noti.concat(result.resultData);
    return noti;
  };

  _handleNextNotice = async () => {
    const { servernoti, index } = this.state;
    if (servernoti.length === index + 1) {
      const result = await this._handleCheckAutoLogin();
      if (result === 'success') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List'
        });
      } else if (result === 'dany') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'SelectCompany'
        });
      } else {
        this.props.onLogout();
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login'
        });
      }
    } else {
      this.setState({
        ...this.state,
        index: index + 1
      });
    }
  };

  _handleCheckAutoLogin = async () => {
    const { auth, loginCheckRequest, onLogout, from } = this.props;
    if (auth.AUTH_A_TOKEN) {
      const result = await loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        from
      );
      if (result.errors) {
        if (result.errors.code === 'E002') {
          this.props.setAlert({
            type: 1,
            title: 'Login',
            message:
              '고객님의 다른 기기에서 WEHAGO 접속정보가 확인되어 로그아웃 됩니다.'
          });
        } else if (result.errors.status === '400') {
          this.props.setAlert({
            type: 1,
            title: 'Login',
            message: '로그인 정보가 잘못되었습니다.'
          });
        } else if (result.errors.status === '401') {
          this.props.setAlert({
            type: 1,
            title: 'Login',
            message: '권한이 없습니다.'
          });
        } else if (result.errors.message === 'timeout') {
          this.props.setAlert({
            type: 1,
            title: 'Login',
            message: '요청 시간을 초과했습니다. 다시 시도해주세요.'
          });
        } else {
          this.props.setAlert({
            type: 1,
            title: 'Login',
            message:
              '요청된 작업을 처리하던중 문제가 발생했습니다. 다시 시도해주세요.'
          });
        }
        return 'fail';
      } else {
        const flag = await this._handleOnLogin();
        if (flag) {
          return 'success';
        } else {
          return 'dany';
        }
      }
    } else {
      return 'fail';
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
  _handleGetDeeplink = async url => {
    /* 모바일 웹에서 화상회의로 들어올 때 (메신저, meet 둘다 공통)
      login_info= mobile | web | email (모바일은 세션시간 8시간 웹은 3개월 unknown는 비회원)
      type= login | conference | screen

      mPORTAL_ID=sadb0101 // 아이디
      mHASH_KEY=4737240669613779471317246605417595221 // wehago_s
      mAuth_r_token=1jKg3vXzvd5yR6kxKUGgJUYDaMhKcF // r토큰
      mAuth_a_token=Rxhh9pCzoLpB5I1M6m36aqoDe5Ivxu // a토큰
      cno=9 // h_selected_company_no
      
      video_id=a25f15cb-01d9-44cf-bafa-4b7122022cb3 // video chat id
      room_name=123 // talk방 이름
    */
    if (!url) return;
    let result = querystringParser(url);
    // let proceed;
    let flag;
    // 화상회의 요청인지 판별
    if (result.is_creater === '9') {
      // 비즈박스에서 올 경우 하나가 있음
      this.props.onChangeRootState({
        loaded: true,
        destination: 'Conference',
        params: {
          call_type: result.call_type,
          room_id: result.room_id,
          owner_name: decodeURI(result.owner_name)
        },
        url: undefined
      });
      return;
    } else if (result.is_creater) {
      // 비즈박스 제외 나머지(위하고앱) 에서 오는 경우를 차단

      this.props.onChangeRootState({
        loaded: true,
        destination: 'Conference',
        params: {
          call_type: result.call_type,
          room_id: result.room_id,
          owner_name: decodeURI(result.owner_name)
        },
        url: undefined
      });
      return;
    } else if (result.login_info === 'web') {
      // 일회성 로그인 처리
      let info = await this._compareMeetToOtherLoginInfo(result, 'web');
      if (info === 'not') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login',
          url: undefined
        });
      } else if (info === 'same') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List',
          url: undefined
        });
      } else if (info === 'change') {
        flag = await this._handleSaveUserinfo(
          result.mAuth_a_token,
          result.mAuth_r_token,
          result.mHASH_KEY,
          result.cno,
          proceed === 'same' ? 'this' : 'web'
        );
        if (flag) {
          this.props.onChangeRootState({
            loaded: true,
            destination: 'Setting',
            params: {
              accesstype: 'web',
              roomId: result.video_id
            },
            url: undefined
          });
        } else {
          this.props.onChangeRootState({
            loaded: true,
            destination: 'Login',
            url: undefined
          });
        }
      }
    } else if (result.login_info === 'email') {
      // 이메일 접근
      let decoded = jwt_decode(result.token);
      /* 
      email: "sadb0101@naver.com"
      exp: 1919234662
      iat: 1603874662
      room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
      sub: "video.wehago.com"
      */
      this.props.onChangeRootState({
        loaded: true,
        destination: 'Setting',
        params: {
          roomId: decoded.room,
          accesstype: 'email',
          token: result.token
        },
        url: undefined
      });
    } else {
      // 로그인 정보 보관

      let info = await this._compareMeetToOtherLoginInfo(result, 'mobile');
      if (info === 'not') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login',
          url: undefined
        });
      } else if (info === 'same') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List',
          url: undefined
        });
      } else if (info === 'change') {
        flag = await this._handleSaveUserinfo(
          result.mAuth_a_token,
          result.mAuth_r_token,
          result.mHASH_KEY,
          result.cno
        );
        if (result.type === 'conference' || result.type === 'screen') {
          if (flag) {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'Setting',
              params: {
                accesstype: 'mobile',
                roomId: result.video_id
              },
              url: undefined
            });
          } else {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'Login',
              url: undefined
            });
          }
        } else {
          if (flag) {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'List',
              url: undefined
            });
          } else {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'Login',
              url: undefined
            });
          }
        }
      }
      // 로그인 진행
    }
  };
  _compareMeetToOtherLoginInfo = async (result, from) => {
    // 기존 meet 로그인 정보와 넘어온 로그인 정보를 비교
    // 기존 로그인 정보와 같은경우
    //  - 바로 화상대화로
    // 기존 로그인 정보와 다를 경우
    //  - 로그인 정보를 바꿀건지 물어 봄
    //    - 바꾸면 화상대화로
    //    - 바꾸지 않으면 리스트로 (기획 확인)

    let info = 'change';
    const auth = this.props.auth;
    if (Object.keys(auth).length > 0) {
      if (
        auth.last_access_company_no !== Number(result.cno) ||
        auth.portal_id !== result.mPORTAL_ID
      ) {
        let msg =
          from === 'mobile'
            ? '기존 로그인 정보와 다른 정보로 접근되었습니다. 변경된 정보로 로그인 하시겠습니까?'
            : '기존 로그인 정보와 일치 하지 않습니다.\n계속 진행하시겠습니까? \n 화상회의 종료 후 기존 로그인 정보는\n삭제 처리 됩니다.';
        info = await new Promise(resolve => {
          this.props.setAlert({
            type: 2,
            title: '알림',
            message: msg,
            onConfirm: () => {
              resolve('change');
            },
            onCencel: () => {
              resolve('not');
            }
          });
        });
      } else {
        info = 'same';
      }
    }
    return info;
  };
  _handleSaveUserinfo = async (
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    cno,
    from
  ) => {
    if (!AUTH_A_TOKEN) return false;
    const { loginCheckRequest } = this.props;
    let result;
    result = await loginCheckRequest(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY,
      from
    );
    if (result.errors) {
      if (result.errors.code === 'E002') {
        this.props.setAlert({
          type: 1,
          title: 'Login',
          message:
            '고객님의 다른 기기에서 WEHAGO 접속정보가 확인되어 로그아웃 됩니다.'
        });
      } else if (result.errors.status === '400') {
        this.props.setAlert({
          type: 1,
          title: 'Login',
          message: '로그인 정보가 잘못되었습니다.'
        });
      } else if (result.errors.status === '401') {
        this.props.setAlert({
          type: 1,
          title: 'Login',
          message: '권한이 없습니다.'
        });
      } else if (result.errors.message === 'timeout') {
        this.props.setAlert({
          type: 1,
          title: 'Login',
          message: '요청 시간을 초과했습니다. 다시 시도해주세요.'
        });
      } else {
        this.props.setAlert({
          type: 1,
          title: 'Login',
          message:
            '요청된 작업을 처리하던중 문제가 발생했습니다. 다시 시도해주세요.'
        });
      }
      return 'fail';
    } else if (
      result.resultData.user_name ||
      result.resultData.auth.user_name
    ) {
      const flag = await this._handleOnLogin();
      return flag;
    } else {
      return false;
    }
  };

  _handleOnLogin = async () => {
    // 회사 상태 조회 후 진행
    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      this.props.auth,
      this.props.auth.last_company
    );
    // 이상이 없는 회사일 경우 로그인 정상 진행
    let proceed;
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
      return isPurchase ? true : false;
    } else if (statusCheck && statusCheck.code === 400) {
      // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
      proceed = await new Promise(resolve => {
        this.props.setAlert({
          type: 1,
          title: '알림',
          message: statusCheck.message,
          onConfirm: () => {
            resolve(true);
          }
        });
      });
      return false;
    } else {
      // 중간에 알 수 없는 오류 발생 시
      return false;
    }
  };

  _handleOnAlert = type => {
    return new Promise((resolve, reject) => {
      let description = '';
      let actions = [];
      let onClose = this._handleOnCloseAlert;

      description = '토큰 정보가 만료되었습니다.';
      onClose = async () => {
        this._handleOnCloseAlert(
          () =>
            JSON.stringify(this.props.auth) !== '{}' && this.props.onLogout()
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
