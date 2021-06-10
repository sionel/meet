import React, { Component } from 'react';
import { Platform, Linking, BackHandler, Alert } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '../../services';
import RNExitApp from 'react-native-exit-app';

import { querystringParser } from '../../utils';
import jwt_decode from 'jwt-decode';

import { getT } from '../../utils/translateManager';
import { getConferenceManager } from '../../utils/ConferenceManager';

const iswehagov = WEHAGO_ENV === 'WEHAGOV';

// const JailMonkey =
//   Platform.OS === 'android' && iswehagov
//     ? require('jail-monkey').default
//     : null;

class SplashScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      index: 0,
      servernoti: []
    };
    this.t = getT();
  }
  setLoginState = () => {
    this.props.onChangeRootState({
      loaded: true,
      destination: 'Login',
      params: {}
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
      const m = getConferenceManager();
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
    // 버전 확인
    this._handleCheckVersion();
    // 노티 확인
    let servernoti = [];
    servernoti = await this._handleCheckNotice(servernoti);
    if (servernoti.length > 0) {
      this.setState({ servernoti, index: 0 });
    } else {
      const result = await this._handleCheckAutoLogin();

      if (result === 'success') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List',
          params: {
            accesstype: 'login'
          }
        });
      } else if (result === 'dany') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'SelectCompany',
          params: {}
        });
      } else {
        this.props.onLogout();
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login',
          params: {}
        });
      }
    }
  };
  _handleCheckSecurity = async () => {
    // const isJailBroken = JailMonkey?.isJailBroken();
    const isJailBroken = false;
    // const isDebuggedMode = await JailMonkey?.isDebuggedMode();
    const isDebuggedMode = false;

    if (
      Platform.OS === 'android' &&
      iswehagov &&
      (isJailBroken || isDebuggedMode)
    ) {
      this.props.setAlert({
        type: 1,
        title: this.t('alert_title_notion'),
        message: this.t('alert_text_looting_V'),
        onConfirm: () => BackHandler.exitApp()
      });
      return false;
    }
    return true;
  };

  _handleCheckVersion = async () => {
    const os = Platform.OS;
    const majorVersion = iswehagov ? 1 : 7;
    const result = await MeetApi.checkVersion(os, majorVersion);

    if (!result.resultData.update || result.resultData.dev_mode) return [];
    const title = this.t('servernoti_title_update');
    const message = iswehagov
      ? this.t('servernoti_message_power_update_V')
      : this.t('servernoti_message_power_update');
    const marketUrl =
      os === 'ios'
        ? 'https://itunes.apple.com/app/id1455726925?mt=8'
        : 'https://play.google.com/store/apps/details?id=com.wehago.meet';

    await new Promise(() => {
      Alert.alert(title, message, [
        {
          onPress: async () => {
            await Linking.openURL(marketUrl);
            RNExitApp.exitApp();
          },
          text: this.t('alert_button_update')
        }
      ]);
    });
  };

  _handleCheckNotice = async noti => {
    const result = await MeetApi.checkNotice();
    if (!result) return [];
    // 확인코드 :101
    // 강제종료 코드 : 102
    result.resultData.forEach(e => {
      if (!e.dev_mode) {
        e.buttons = [
          {
            text:
              e.button_type === 102
                ? this.t('alert_button_exit')
                : this.t('alert_button_confirm'),
            onclick:
              e.button_type === 102
                ? () => RNExitApp.exitApp()
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
          destination: 'List',
          params: {
            accesstype: 'login'
          }
        });
      } else if (result === 'dany') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'SelectCompany',
          params: {}
        });
      } else {
        this.props.onLogout();
        this.props.onChangeRootState({
          loaded: true,
          destination: 'Login',
          params: {}
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
            title: this.t('alert_title_login_fail'),
            message: iswehagov
              ? this.t('alert_text_expired')
              : this.t('alert_text_duplicate_logout')
          });
        } else if (result.errors.status === '400') {
          this.props.setAlert({
            type: 1,
            title: this.t('alert_title_login_fail'),
            message: this.t('alert_text_login_info_error')
          });
        } else if (result.errors.status === '401') {
          this.props.setAlert({
            type: 1,
            title: this.t('alert_title_login_fail'),
            message: this.t('alert_text_no_right')
          });
        } else if (result.errors.message === 'timeout') {
          this.props.setAlert({
            type: 1,
            title: this.t('alert_title_login_fail'),
            message: this.t('alert_text_timeover')
          });
        } else {
          this.props.setAlert({
            type: 1,
            title: this.t('alert_title_login_fail'),
            message: this.t('alert_text_problem_ocurred')
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
          params: {
            accesstype: 'web'
          },
          url: undefined
        });
      } else if (info === 'same') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List',
          params: {
            accesstype: 'login'
          },
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
            params: {},
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
          params: {
            accesstype: 'login'
          },
          url: undefined
        });
      } else if (info === 'same') {
        this.props.onChangeRootState({
          loaded: true,
          destination: 'List',
          params: {
            accesstype: 'login'
          },
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
              params: {},
              url: undefined
            });
          }
        } else {
          if (flag) {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'List',
              params: {
                accesstype: 'wehago'
              },
              url: undefined
            });
          } else {
            this.props.onChangeRootState({
              loaded: true,
              destination: 'Login',
              params: {},
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
            ? this.t('alert_text_other_info_mobile')
            : this.t('alert_text_other_info_web');
        info = await new Promise(resolve => {
          this.props.setAlert({
            type: 2,
            title: this.t('alert_title_notion'),
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
          title: this.t('alert_title_login_fail'),
          message: iswehagov
            ? this.t('alert_text_expired')
            : this.t('alert_text_duplicate_logout')
        });
      } else if (result.errors.status === '400') {
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_login_fail'),
          message: this.t('alert_text_login_info_error')
        });
      } else if (result.errors.status === '401') {
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_login_fail'),
          message: this.t('alert_text_no_right')
        });
      } else if (result.errors.message === 'timeout') {
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_login_fail'),
          message: this.t('alert_text_timeover')
        });
      } else {
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_login_fail'),
          message: this.t('alert_text_problem_ocurred')
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
      return isPurchase && isDeploy ? true : false;
    } else if (statusCheck && statusCheck.code === 400) {
      // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
      proceed = await new Promise(resolve => {
        this.props.setAlert({
          type: 1,
          title: this.t('alert_title_notion'),
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

      description = this.t('alert_text_token_expiration');
      onClose = async () => {
        this._handleOnCloseAlert(
          () =>
            JSON.stringify(this.props.auth) !== '{}' && this.props.onLogout()
        );
        resolve(false);
      };
      actions = [
        {
          name: this.t('alert_button_yes'),
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
