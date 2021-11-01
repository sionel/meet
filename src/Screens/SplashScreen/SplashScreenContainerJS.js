import React, { Component } from 'react';
import { Platform, Linking, BackHandler, Alert } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '../../services';
import { UserApi } from '../../services';
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
  // setLoginState = () => {
  //   const { setRootState } = this.props;
  //   setRootState({
  //     loaded: true,
  //     destination: 'Login',
  //     params: {}
  //   });
  // };

  componentDidMount = async () => {
    const { url } = this.props;
    await 0;
    // 강제종료 했을때를 위한 강제 초기화
    this.props.setInitInfo();
    this.props.setSharingMode();
    const m = getConferenceManager();
    if (m) {
      this.props.setIndicator();
      await m.dispose();
    }

    if (url) {
      console.log(11);
      this._handleGetDeeplink(url);
    } else {
      console.log(222);
      this._handleInit();
    }
  };

  componentDidUpdate(prevProps) {
    const { url } = this.props;
    if (url && !prevProps.url !== url) {
      this._handleGetDeeplink(url);
    }
  }

  render() {
    const { alert, servernoti, index } = this.state;
    return (
      <SplashScreenPresenter alert={alert} servernoti={servernoti[index]} />
    );
  }

  _handleInit = async () => {
    // RootState 액션
    const { setRootState } = this.props;
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
        setRootState({
          loaded: true,
          destination: 'List',
          params: {
            accesstype: 'login'
          }
        });
      } else if (result === 'dany') {
        setRootState({
          loaded: true,
          destination: 'SelectCompany',
          params: {}
        });
      } else {
        if (result === 'autoLoginFalse') {
          const { auth } = this.props;
          if (auth !== {}) await UserApi.logoutRequest(auth);
        }
        this.props.onLogout();
        setRootState({
          loaded: true,
          destination: 'Login',
          params: {}
        });
      }
    }
  };
  // _handleCheckSecurity = async () => {
  //   // const isJailBroken = JailMonkey?.isJailBroken();
  //   const isJailBroken = false;
  //   // const isDebuggedMode = await JailMonkey?.isDebuggedMode();
  //   const isDebuggedMode = false;

  //   if (
  //     Platform.OS === 'android' &&
  //     iswehagov &&
  //     (isJailBroken || isDebuggedMode)
  //   ) {
  //     this.props.setAlert({
  //       type: 1,
  //       title: this.t('renewal.alert_title_notion'),
  //       message: this.t('renewal.alert_text_looting_V'),
  //       onConfirm: () => BackHandler.exitApp()
  //     });
  //     return false;
  //   }
  //   return true;
  // };

  _handleCheckVersion = async () => {
    const os = Platform.OS;
    const majorVersion = 13;
    const result = await MeetApi.checkVersion(os, majorVersion);
    if (!result.resultData.update || result.resultData.dev_mode) return [];
    const title = this.t('renewal.servernoti_title_update');
    const message = this.t('renewal.servernoti_message_power_update');
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
          text: this.t('renewal.alert_button_update')
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
                ? this.t('renewal.alert_button_exit')
                : this.t('renewal.alert_button_confirm'),
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
    const { setRootState } = this.props;
    const { servernoti, index } = this.state;
    if (servernoti.length === index + 1) {
      const result = await this._handleCheckAutoLogin();
      if (result === 'success') {
        setRootState({
          loaded: true,
          destination: 'List',
          params: {
            accesstype: 'login'
          }
        });
      } else if (result === 'dany') {
        setRootState({
          loaded: true,
          destination: 'SelectCompany',
          params: {}
        });
      } else {
        this.props.onLogout();
        setRootState({
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
    const { auth, from, autoLogin } = this.props;
    if (autoLogin) {
      if (auth.AUTH_A_TOKEN) {
        const result = await this._loginCheckRequest(
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
              title: this.t('renewal.alert_title_login_fail'),
              message: this.t('renewal.alert_text_duplicate_logout')
            });
          } else if (result.errors.status === '400') {
            this.props.setAlert({
              type: 1,
              title: this.t('renewal.alert_title_login_fail'),
              message: this.t('renewal.alert_text_login_info_error')
            });
          } else if (result.errors.status === '401') {
            this.props.setAlert({
              type: 1,
              title: this.t('renewal.alert_title_login_fail'),
              message: this.t('renewal.alert_text_no_right')
            });
          } else if (result.errors.message === 'timeout') {
            this.props.setAlert({
              type: 1,
              title: this.t('renewal.alert_title_login_fail'),
              message: this.t('renewal.alert_text_timeover')
            });
          } else {
            this.props.setAlert({
              type: 1,
              title: this.t('renewal.alert_title_login_fail'),
              message: this.t('renewal.alert_text_problem_ocurred')
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
    } else {
      return 'autoLoginFalse';
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

  _loginCheckRequest = async (
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    cno,
    HASH_KEY,
    from,
    flag = false // 자동로그인
  ) => {
    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );

    if (checkResult.resultCode === 200) {
      let { autoLogin } = this.props;
      const userData = {
        // login api data
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        HASH_KEY,
        cno,
        // check api data
        user_no: checkResult.resultData.user_no,
        portal_id: checkResult.resultData.portal_id, // 아이디
        user_name: checkResult.resultData.user_name,
        user_default_email: checkResult.resultData.user_default_email,
        user_email: checkResult.resultData.user_email,
        profile_url: checkResult.resultData.profile_url,
        user_contact: checkResult.resultData.user_contact,
        employee_list: checkResult.resultData.employee_list, // 회사정보
        last_access_company_no: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.last_access_company_no
          : cno,
        last_company: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.employee_list.filter(
              e => e.company_no == checkResult.resultData.last_access_company_no
            )[0]
          : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
        member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
        nickname: checkResult.nickname,
        membership_code: checkResult.resultData.employee_list[0].membership_code
      };

      this.props.login(userData, from, flag);
      return userData;
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      this.props.eventLog(result);
      return result;
    }
  };

  /**
   * DeepLink 로 접근한 경우
   */
  _handleGetDeeplink = async url => {
    const { setRootState } = this.props;
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
    // 화상회의 요청인지 판별
    if (result.is_creater) {
      // 오래된 딥링크 주소 차단
      this.props.setAlert({
        type: 1,
        title: '오류',
        message: 'meet 앱에서 다시 접근 해주시길 바랍니다'
      });
      return;
    } else if (result.mPORTAL_ID && result.cno) {
      //토근정보가 있을때
      const { mHASH_KEY, mAuth_r_token, mAuth_a_token, cno } =
        result;
      this.props.onLogout();
      this._loginCheckRequest(
        mAuth_a_token,
        mAuth_r_token,
        cno,
        mHASH_KEY,
        'login',
        true
      );
    } else if(result.login_info === 'email'){
      //토근정보가 없을때
      let decoded = jwt_decode(result.token);
      /*
      email: "sadb0101@naver.com"
      exp: 1919234662
      iat: 1603874662
      room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
      sub: "video.wehago.com"
      */
      setRootState({
        loaded: true,
        destination: 'Setting',
        params: {
          roomId: decoded.room,
          accesstype: 'email',
          token: result.token
        },
        url: undefined
      });
    }

    // else if (result.login_info === 'web') {
    //   // 일회성 로그인 처리
    //   let info = await this._compareMeetToOtherLoginInfo(result, 'web');
    //   if (info === 'not') {
    //     setRootState({
    //       loaded: true,
    //       destination: 'Login',
    //       params: {
    //         accesstype: 'web'
    //       },
    //       url: undefined
    //     });
    //   } else if (info === 'same') {
    //     setRootState({
    //       loaded: true,
    //       destination: 'List',
    //       params: {
    //         accesstype: 'login'
    //       },
    //       url: undefined
    //     });
    //   } else if (info === 'change') {
    //     flag = await this._handleSaveUserinfo(
    //       result.mAuth_a_token,
    //       result.mAuth_r_token,
    //       result.mHASH_KEY,
    //       result.cno,
    //       proceed === 'same' ? 'this' : 'web'
    //     );
    //     if (flag) {
    //       setRootState({
    //         loaded: true,
    //         destination: 'Setting',
    //         params: {
    //           accesstype: 'web',
    //           roomId: result.video_id
    //         },
    //         url: undefined
    //       });
    //     } else {
    //       setRootState({
    //         loaded: true,
    //         destination: 'Login',
    //         params: {},
    //         url: undefined
    //       });
    //     }
    //   }
    // } else if (result.login_info === 'email') {
    //   // 이메일 접근
    //   let decoded = jwt_decode(result.token);
    //   /*
    //   email: "sadb0101@naver.com"
    //   exp: 1919234662
    //   iat: 1603874662
    //   room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
    //   sub: "video.wehago.com"
    //   */
    //   setRootState({
    //     loaded: true,
    //     destination: 'Setting',
    //     params: {
    //       roomId: decoded.room,
    //       accesstype: 'email',
    //       token: result.token
    //     },
    //     url: undefined
    //   });
    // } else {
    //   // 로그인 정보 보관

    //   let info = await this._compareMeetToOtherLoginInfo(result, 'mobile');
    //   if (info === 'not') {
    //     setRootState({
    //       loaded: true,
    //       destination: 'Login',
    //       params: {
    //         accesstype: 'login'
    //       },
    //       url: undefined
    //     });
    //   } else if (info === 'same') {

    //     setRootState({
    //       loaded: true,
    //       destination: 'List',
    //       params: {
    //         accesstype: 'login'
    //       },
    //       url: undefined
    //     });
    //   } else if (info === 'change') {
    //     flag = await this._handleSaveUserinfo(
    //       result.mAuth_a_token,
    //       result.mAuth_r_token,
    //       result.mHASH_KEY,
    //       result.cno
    //     );

    //     if (result.type === 'conference' || result.type === 'screen') {
    //       if (flag) {
    //         setRootState({
    //           loaded: true,
    //           destination: 'Setting',
    //           params: {
    //             accesstype: 'mobile',
    //             roomId: result.video_id
    //           },
    //           url: undefined
    //         });
    //       } else {
    //         setRootState({
    //           loaded: true,
    //           destination: 'Login',
    //           params: {},
    //           url: undefined
    //         });
    //       }
    //     } else {

    //       if (flag) {
    //         setRootState({
    //           loaded: true,
    //           destination: 'List',
    //           params: {
    //             accesstype: 'wehago'
    //           },
    //           url: undefined
    //         });
    //       } else {
    //         setRootState({
    //           loaded: true,
    //           destination: 'Login',
    //           params: {},
    //           url: undefined
    //         });
    //       }
    //     }
    //   }
    // 로그인 진행
    // }
  };
  // _compareMeetToOtherLoginInfo = async (result, from) => {
  //   // 기존 meet 로그인 정보와 넘어온 로그인 정보를 비교
  //   // 기존 로그인 정보와 같은경우
  //   //  - 바로 화상대화로
  //   // 기존 로그인 정보와 다를 경우
  //   //  - 로그인 정보를 바꿀건지 물어 봄
  //   //    - 바꾸면 화상대화로
  //   //    - 바꾸지 않으면 리스트로 (기획 확인)

  //   let info = 'change';
  //   const auth = this.props.auth;
  //   if (Object.keys(auth).length > 0) {
  //     if (
  //       auth.last_access_company_no !== Number(result.cno) ||
  //       auth.portal_id !== result.mPORTAL_ID
  //     ) {
  //       let msg =
  //         from === 'mobile'
  //           ? this.t('renewal.alert_text_other_info_mobile')
  //           : this.t('renewal.alert_text_other_info_web');
  //       info = await new Promise(resolve => {
  //         this.props.setAlert({
  //           type: 2,
  //           title: this.t('renewal.alert_title_notion'),
  //           message: msg,
  //           onConfirm: () => {
  //             resolve('change');
  //           },
  //           onCencel: () => {
  //             resolve('not');
  //           }
  //         });
  //       });
  //     } else {
  //       info = 'same';
  //     }
  //   }
  //   return info;
  // };

  _handleSaveUserinfo = async (
    AUTH_A_TOKEN,
    AUTH_R_TOKEN,
    HASH_KEY,
    cno,
    from
  ) => {
    if (!AUTH_A_TOKEN) return false;
    let result;
    result = await this._loginCheckRequest(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY,
      from,
      'W'
    );
    if (result.errors) {
      // TODO:
      if (result.errors.code === 'E002') {
        this.props.setAlert({
          type: 1,
          title: this.t('renewal.alert_title_login_fail'),
          message: this.t('renewal.alert_text_duplicate_logout')
        });
      } else if (result.errors.status === '400') {
        this.props.setAlert({
          type: 1,
          title: this.t('renewal.alert_title_login_fail'),
          message: this.t('renewal.alert_text_login_info_error')
        });
      } else if (result.errors.status === '401') {
        this.props.setAlert({
          type: 1,
          title: this.t('renewal.alert_title_login_fail'),
          message: this.t('renewal.alert_text_no_right')
        });
      } else if (result.errors.message === 'timeout') {
        this.props.setAlert({
          type: 1,
          title: this.t('renewal.alert_title_login_fail'),
          message: this.t('renewal.alert_text_timeover')
        });
      } else {
        this.props.setAlert({
          type: 1,
          title: this.t('renewal.alert_title_login_fail'),
          message: this.t('renewal.alert_text_problem_ocurred')
        });
      }
      return 'fail';
    } else if (
      result.resultData.user_name ||
      result.resultData.auth.user_name
    ) {
      this._handleOnLogin(result);
    } else {
      // return false;
    }
  };

  _handleOnLogin = async auth => {
    const { setRootState } = this.props;
    // 회사 상태 조회 후 진행
    const statusCheck = await ServiceCheckApi.companyStatusCheck(
      auth,
      auth.last_company
    );
    // 이상이 없는 회사일 경우 로그인 정상 진행
    if (statusCheck && statusCheck.code === 200) {
      // 서비스 구매여부 조회
      const isDeployWebrtc = await ServiceCheckApi.serviceCheck(
        auth,
        'webrtc' // 구매여부 확인
      );
      // 서비스 배포여부 조회
      const isDeployWehagomeet = await ServiceCheckApi.serviceCheck(
        auth,
        'wehagomeet' // 배포여부 확인
      );

      const isDeploy = isDeployWehagomeet || isDeployWebrtc;

      this.props.setPermission(isDeploy);
      setRootState({
        destination: isDeploy ? 'List' : 'SelectCompany',
        params: {
          accesstype: 'login'
        }
      });
    } else if (statusCheck && statusCheck.code === 400) {
      const onClose = () => {
        _resetAlert();
        setRootState({
          destination: 'SelectCompany',
          params: {
            accesstype: 'login'
          }
        });
      };
      setAlertVisible({
        visible: true,
        title: t('renewal.alert_title_notion'),
        description: statusCheck.message,
        onClose,
        actions: [
          {
            name: t('renewal.alert_button_confirm'),
            action: onClose
          }
        ]
      });
    } else {
      setRootState({
        destination: 'SelectCompany'
      });
    }
  };

  // _handleOnAlert = type => {
  //   // TODO:
  //   return new Promise((resolve, reject) => {
  //     let description = '';
  //     let actions = [];
  //     let onClose = this._handleOnCloseAlert;

  //     description = this.t('renewal.alert_text_token_expiration');
  //     onClose = async () => {
  //       this._handleOnCloseAlert(
  //         () =>
  //           JSON.stringify(this.props.auth) !== '{}' && this.props.onLogout()
  //       );
  //       resolve(false);
  //     };
  //     actions = [
  //       {
  //         name: this.t('renewal.alert_button_yes'),
  //         action: () => {
  //           this._handleOnCloseAlert(
  //             () =>
  //               JSON.stringify(this.props.auth) !== '{}' &&
  //               this.props.onLogout()
  //           );
  //           resolve(false);
  //         }
  //       }
  //     ];
  //     this.setState({
  //       alert: { visible: true, type, description, actions, onClose }
  //     });
  //   });
  // };

  _handleRedirect = (url, param) => {
    const { navigation } = this.props;
    navigation.navigate(url, param);
  };
}

export default SplashScreenContainer;
