/**
 * MainContainer
 * 최상위화면 컨테이너
 */
import React, { Component } from 'react';
import { View, Alert, Linking, Platform, ToastAndroid } from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import MainPresenter from './MainPresenter';
import LoginNavigation from '../Navigations/LoginNavigation';
// import LoginRoute from '../Routes/LoginRoute';
import CompanySelect from '../components/CompanySelect';
import AppIntroSlide from '../components/AppIntroSlide';
import { CustomAlert } from '../components';

// service
import { querystringParser } from '../utils';
import ServiceCheckApi from '../services/api/ServiceCheckApi';

import { WEHAGO_ENV } from './../../config';

// 로그인 했을때 정보를 저장
// 딥링크 타고 들어오면 정보를 저장?
// 로그인, 딥링크, 위하고 로그인 3개를 비교해봐야함

class MainContainer extends Component {
  constructor(props) {
    super();
    this.state = {
      isLogin: false,
      hasService: false,
      url: null,
      alert: {
        visible: false,
        type: 0,
        description: '',
        actions: [],
        onClose: () => {}
      },
    };
  }

  // conferenceCall = null;

  componentDidMount() {
    // setTimeout(() => {
    //   Platform.OS !== 'ios' && SplashScreen.hide();
    // }, 1000);
    // this.props.setInitInfo();
    // this.props.setSharingMode();
    // if (this.props.url.url) {
    //   this._handleGetWehagoToken(this.props.url);
    // }
    // if (Platform.OS === 'ios') {
    //   Linking.addEventListener('url', this._handleGetWehagoToken);
    // }
  }

  // shouldComponentUpdate(nextProps, nextStates) {
  //   // deep link 에 의한 url 변동 사항 캐치
  //   if (nextProps.url !== this.props.url) {
  //     this._handleGetWehagoToken(nextProps.url);
  //     return true;
  //   }

  //   // 로그인 여부 변경 사항 캐치
  //   if (
  //     nextStates.isLogin !== this.state.isLogin ||
  //     nextStates.alert !== this.state.alert
  //   ) {
  //     return true;
  //   }

  //   if (nextProps.session !== this.props.session && !nextProps.session) {
  //     this.props.isWehagoLogin
  //       ? this._handleOnAlert(3)
  //       : this._handleOnAlert(2);
  //   }

  //   if (!nextProps.isLogin) {
  //     this.setState({ isLogin: false });
  //   }

  //   // 회사 변경시 재로그인
  //   if (
  //     nextProps.auth.last_access_company_no !==
  //     this.props.auth.last_access_company_no
  //   ) {
  //     this.setState({ isLogin: false });
  //   }

  //   return false;
  // }

  // componentWillUnmount() {
  //   Linking.removeEventListener('url', this._handleGetWehagoToken);
  // }

  render() {
    return (
      <View style={{ flex: 1, width: '100%', hight: '100%' }}>
        <MainPresenter
          destination={this.props.destination}
          onChangeRootState={this.props.onChangeRootState}
          onChangeMainState={this._handleChangeMainState}
        />
        {/* {this.state.isLogin ? (
          this.state.hasService ? (
            <AppIntroSlide>
              <MainPresenter
                url={this.props.url}
                alert={this.state.alert}
                conferenceCall={this.conferenceCall}
                onAlert={this._handleOnAlert}
              />
            </AppIntroSlide>
          ) : (
            <CompanySelect />
          )
        ) : (
          <LoginNavigation
            screenProps={{
              handleOnLogin: this._handleOnLogin,
              handleSaveUserinfo: this._handleSaveUserinfo,
              url: this.props.url,
              rootTag: this.props.rootTag,
              alert: this.state.alert,
              onAlert: this._handleOnAlert
            }}
          />
        )}

        <CustomAlert
          visible={this.state.alert.visible}
          title={'알림'}
          width={320}
          description={this.state.alert.description}
          actions={this.state.alert.actions}
          onClose={this.state.alert.onClose}
        /> */}
      </View>
    );
  }

  // _handleOnAlert = type => {
  //   return new Promise((resolve, reject) => {
  //     let description = '';
  //     let actions = [];
  //     let onClose = this._handleOnCloseAlert;

  //     switch (type) {
  //       case 1:
  //         description =
  //           '고객님의 다른 기기에서 WEHAGO를 사용하고 있습니다. 기존 접속을 종료하시고 새로 접속하시겠습니까?';
  //         onClose = () => {
  //           this._handleOnCloseAlert();
  //           resolve(false);
  //         };
  //         actions = [
  //           {
  //             name: '취소',
  //             action: () => {
  //               console.warn('취소');
  //               this._handleOnCloseAlert();
  //               resolve(false);
  //             }
  //           },
  //           {
  //             name: '확인',
  //             action: () => {
  //               this._handleOnCloseAlert();
  //               resolve(true);
  //             }
  //           }
  //         ];
  //         break;
  //       case 2:
  //         description =
  //           WEHAGO_ENV === 'WEHAGOV'
  //             ? '세션이 만료되었습니다. 다시 로그인 해주세요.'
  //             : '고객님의 다른 기기에서 WEHAGO 접속정보가 확인되어 로그아웃 됩니다.';
  //         onClose = async () => {
  //           this._handleOnCloseAlert(
  //             () =>
  //               JSON.stringify(this.props.auth) !== '{}' &&
  //               this.props.onLogout()
  //           );
  //           resolve(false);
  //         };
  //         actions = [
  //           {
  //             name: '확인',
  //             action: () => {
  //               this._handleOnCloseAlert(
  //                 () =>
  //                   JSON.stringify(this.props.auth) !== '{}' &&
  //                   this.props.onLogout()
  //               );
  //               resolve(false);
  //             }
  //           }
  //         ];
  //         break;
  //       case 3:
  //         description = 'WEHAGO 에서 로그아웃 하였습니다.';
  //         onClose = async () => {
  //           this._handleOnCloseAlert(
  //             () =>
  //               JSON.stringify(this.props.auth) !== '{}' &&
  //               this.props.onLogout()
  //           );
  //           resolve(false);
  //         };
  //         actions = [
  //           {
  //             name: '확인',
  //             action: () => {
  //               this._handleOnCloseAlert(
  //                 () =>
  //                   JSON.stringify(this.props.auth) !== '{}' &&
  //                   this.props.onLogout()
  //               );
  //               resolve(false);
  //             }
  //           }
  //         ];
  //         break;
  //       default:
  //         this.setState({
  //           alert: {
  //             visible: false,
  //             type,
  //             description,
  //             onClose
  //           }
  //         });
  //         resolve(false);
  //         return;
  //     }

  //     this.setState({
  //       alert: { visible: true, type, description, actions, onClose }
  //     });
  //   });
  // };
  // _handleOnCloseAlert = callback => {
  //   this.setState(
  //     {
  //       alert: { visible: false, type: 0, description: '' }
  //     },
  //     () => {
  //       callback && callback();
  //     }
  //   );
  // };

  /**
   * 로그인 권한은 LoginScreen 이 가지고 있음
   * LoginScreen 에서 _handleOnLogin을 통해서 로그인 상태를 관리함
   */
  // _handleOnLogin = async () => {
  //   // const resultService = await ServiceCheckApi.serviceCheck(
  //   //   this.props.auth,
  //   //   this.props.auth.last_company,
  //   //   'D'
  //   // );

  //   // this.setState({ isLogin: true, hasService: resultService });

  //   // return;

  //   // TODO - 개발 중
  //   // 회사 상태 조회 후 진행
  //   const statusCheck = await ServiceCheckApi.companyStatusCheck(
  //     this.props.auth,
  //     this.props.auth.last_company
  //   );
  //   // 이상이 없는 회사일 경우 로그인 정상 진행
  //   if (statusCheck && statusCheck.code === 200) {
  //     // 서비스 구매여부 조회
  //     const isPurchase = await ServiceCheckApi.serviceCheck(
  //       this.props.auth,
  //       this.props.auth.last_company,
  //       'P' // 구매여부 확인
  //     );
  //     // 서비스 배포여부 조회
  //     const isDeploy = await ServiceCheckApi.serviceCheck(
  //       this.props.auth,
  //       this.props.auth.last_company,
  //       'D' // 배포여부 확인
  //     );
  //     this.props.setPermission(isDeploy);
  //     this.setState({ isLogin: true, hasService: isPurchase });
  //   } else if (statusCheck && statusCheck.code === 400) {
  //     // 회사에 이상이 있을 경우, 회사 선택 화면으로 이동
  //     Alert.alert('알림', statusCheck.message);
  //     this.setState({ isLogin: true, hasService: false });
  //   } else {
  //     // 중간에 알 수 없는 오류 발생 시
  //     this.setState({ isLogin: true, hasService: false });
  //   }
  // };

  /**
   * DeepLink 로 접근한 경우
   */
  // _handleGetWehagoToken = event => {
  //   /* 모바일 웹에서 화상회의로 들어올 때 (메신저, meet 둘다 공통)
  //     ?portal_id=sadb0101 // 아이디
  //     &mHASH_KEY=4737240669613779471317246605417595221 // wehago_s
  //     &mAuth_r_token=1jKg3vXzvd5yR6kxKUGgJUYDaMhKcF // r토큰
  //     &mAuth_a_token=Rxhh9pCzoLpB5I1M6m36aqoDe5Ivxu // a토큰
  //     &cno=9 // h_selected_company_no
  //     &video_id=a25f15cb-01d9-44cf-bafa-4b7122022cb3 // video chat id
  //     &room_name=123 // talk방 이름
  //     &flag=T // string 형식의 대문자 'T' 고정값 기존 코드를 건들지 않고 새로 대화방으로 바로 갈 수 있도록 짜야할 필요성이 있었음
  //   */

  //   if (!event.url) return;

  //   const result = querystringParser(event.url);
  //   // 화상회의 요청인지 판별
  //   if (result.is_creater || result.type) {
  //     // timestamp : 로그인 시간 체크
  //     this.conferenceCall = { ...result, timestamp: Date.now() };
  //     return;
  //   }

  //   if (!result.mAuth_a_token) {
  //     Platform.OS === 'ios'
  //       ? Alert.alert('Login', '현재 위하고에 로그인되어 있지 않습니다.')
  //       : ToastAndroid.show(
  //           '현재 위하고에 로그인되어 있지 않습니다.',
  //           ToastAndroid.SHORT
  //         );
  //   }

  //   // 로그인 진행
  //   this._handleSaveUserinfo(
  //     result.mAuth_a_token,
  //     result.mAuth_r_token,
  //     result.mHASH_KEY,
  //     result.cno,
  //     true // 위하고앱으로 로그인인지 구분
  //   );
  // };

  /**
   *  _handleSaveUserinfo
   * 유저정보 저장
   */
  // _handleSaveUserinfo = async (
  //   AUTH_A_TOKEN,
  //   AUTH_R_TOKEN,
  //   HASH_KEY,
  //   cno,
  //   isWehagoLogin
  // ) => {
  //   if (!AUTH_A_TOKEN) return;

  //   const { loginCheckRequest } = this.props;
  //   const result = await loginCheckRequest(
  //     AUTH_A_TOKEN,
  //     AUTH_R_TOKEN,
  //     cno,
  //     HASH_KEY,
  //     isWehagoLogin
  //   );

  //   if (result.errors) {
  //     if (result.errors.code === 'E002') {
  //       if (isWehagoLogin) this._handleOnAlert(3);
  //       else this._handleOnAlert(2);
  //     } else if (result.errors.status === '400') {
  //       Alert.alert('Login', '로그인 정보가 잘못되었습니다.');
  //     } else if (result.errors.status === '401') {
  //       Alert.alert('Login', '권한이 없습니다.');
  //     } else if (result.errors.message === 'timeout') {
  //       Alert.alert('Login', `요청 시간을 초과했습니다. 다시 시도해주세요.`);
  //     } else {
  //       Alert.alert('Login', `사소한 문제가 발생했습니다. 다시 시도해주세요.`);
  //     }
  //     return;
  //   } else if (
  //     result.resultData.user_name ||
  //     result.resultData.auth.user_name
  //   ) {
  //     this._handleOnLogin();
  //   }
  // };

  // /**
  //  * _handleCheckPermissions
  //  */
  // _handleCheckPermissions = async () => {
  //   // 권한 목록 설정
  //   const permissions =
  //     Platform.OS === 'ios'
  //       ? [{ key: 'microphone', name: '마이크' }, { key: 'camera', name: '카메라' }]
  //       : [{ key: 'microphone', name: '마이크' }, { key: 'camera', name: '카메라' }];
  //   // 현재 권한 체크
  //   const response = await Permissions.checkMultiple(permissions.map(p => p.key));
  //   // 권한 설정 요청
  //   this._handleSetPermissions(response, permissions);
  // };

  // /**
  //  * _handleSetPermissions
  //  */
  // _handleSetPermissions = async (response, permissions, length = 0) => {
  //   // 재귀
  //   let len = length;
  //   if (length >= permissions.length) return;

  //   if (response[permissions[len].key] === 'authorized') {
  //     // 권한 승인 상태이면 다음 권한 설정
  //     return this._handleSetPermissions(response, permissions, ++len);
  //   } else {
  //     // 권한이 없으므로 권한 요청
  //     const result = await Permissions.request(permissions[len].key, {
  //       type: 'whenInUse'
  //     });
  //     // 권한 미승인 시 앱 종료 또는 환경설정으로 이동
  //     if (result !== 'authorized') {
  //       Alert.alert(
  //         permissions[len].name + ' 권한 요청',
  //         '화상회의 기능을 사용하시려면 해당 권한을 부여하세요.',
  //         [
  //           {
  //             text: 'OK',
  //             // 권한 다시 알리지 않음 설정 시 환경설정으로 이동
  //             onPress: () => {
  //               Platform.OS === 'ios'
  //                 ? this._handleCheckPermissions()
  //                 : BackHandler.exitApp();
  //               Platform.OS === 'ios'
  //                 ? Permissions.openSettings()
  //                 : AndroidSettings.open();
  //             }
  //           }
  //         ]
  //       );

  //       return;
  //     }
  //     // 권한 승인 시 다음 권한 설정
  //     return this._handleSetPermissions(response, permissions, ++len);
  //   }
  // };
  _handleChangeMainState = state => {
    this.setState({
      ...this.state,
      ...state
    });
  };
}
export default MainContainer;
