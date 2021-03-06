import React, { Component, useEffect, useRef, useState } from 'react';
import { Platform, Linking, BackHandler, Alert } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '../../services';
import { UserApi } from '../../services';
import RNExitApp from 'react-native-exit-app';

import { querystringParser } from '../../utils';
import jwt_decode from 'jwt-decode';

import { getT } from '../../utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as DocumentShareActions } from '../../redux/modules/documentShare';
import { actionCreators as WedriveAcions } from '../../redux/modules/wedrive';
import { actionCreators as AlertAcions } from '../../redux/modules/alert';
import { actionCreators as IndicatorAcions } from '../../redux/modules/indicator';
import { actionCreators as RecentsActions } from '../../redux/modules/recentsInvited';
import { actionCreators as ConferenceActions } from '../../redux/modules/conference';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { MeetNavigationProps } from '../../Navigations/RootNavigation';

// const iswehagov = WEHAGO_ENV === 'WEHAGOV';

// const JailMonkey =
//   Platform.OS === 'android' && iswehagov
//     ? require('jail-monkey').default
//     : null;

const SplashScreenContainer = ({
  navigation,
  route
}: MeetNavigationProps<'SplashView'>) => {
  const { params } = route;
  const [serverNoti, setServerNoti] = useState<any[]>([]);
  const [notiIndex, setNotiIndex] = useState(0);
  const [first, setFirst] = useState(true);
  const deeplink = params?.deeplink;
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const t = getT();

  //#region  selector
  const { auth, from, updateNoti, autoLogin, loginType, url } = useSelector(
    (state: RootState) => {
      return {
        url: state.app.url,
        auth: state.user.auth,
        from: state.user.from,
        updateNoti: state.user.updateNoti,
        autoLogin: state.user.autoLogin,
        loginType: state.user.loginType
      };
    }
  );
  //#endregion

  //#region  dispatch
  const dispatch = useDispatch();
  const onLogin = (auth: any, from: any, autoLogin: boolean) =>
    dispatch(UserActions.login(auth, from, autoLogin));
  const onLogout = () => {
    dispatch(UserActions.logout());
    dispatch(RecentsActions.resetRecents());
  };
  const setPermission = (permission: any) =>
    dispatch(UserActions.setPermission(permission));
  const setSharingMode = () => dispatch(DocumentShareActions.setSharingMode());
  const setInitInfo = () => dispatch(WedriveAcions.setInitInfo());
  const toggleUpdateNoti = () => dispatch(UserActions.toggleUpdateNoti());
  const setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));
  const eventLog = (event: any) => dispatch(UserActions.eventLog(event));
  const setVideoPolicy = (videoPolicy: string) =>
    dispatch(RootActions.setVideoPolicy(videoPolicy));

  //#endregion

  useEffect(() => {
    _handleInit();
  }, []);

  useEffect(() => {
    _handleGetDeeplink(url);
  }, [url]);

  const _handleInit = async () => {
    timeout.current = setTimeout(() => {
      _handleCheckAutoLogin();
    }, 4000);
    // ?????? ??????
    await _handleCheckVersion();

    // ?????? ??????
    await _handleCheckNotice();
  };

  const _handleCheckVersion = async () => {
    const os = Platform.OS;
    const majorVersion = 13;
    const result = await MeetApi.checkVersion(os, majorVersion);
    if (!result.resultData.update || result.resultData.dev_mode) return;
    const title = t('renewal.servernoti_title_update');
    const message = t('renewal.servernoti_message_power_update');
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
          text: t('renewal.alert_button_update')
        }
      ]);
    });
  };

  const _handleCheckNotice = async () => {
    try {
      // ???????????? :101
      // ???????????? ?????? : 102
      const { resultData } = await MeetApi.checkNotice();

      let noti: any[] = [...resultData];
      noti.forEach((e: any) => {
        if (!e.dev_mode) {
          e.buttons = [
            {
              text:
                e.button_type === 102
                  ? t('renewal.alert_button_exit')
                  : t('renewal.alert_button_confirm'),
              onclick:
                e.button_type === 102
                  ? () => RNExitApp.exitApp()
                  : () => _handleNextNotice()
            }
          ];
        }
      });
      setServerNoti(noti);
    } catch (error) {
      console.warn('6-3.checkNotice : ', error);
    }
  };

  const _handleNextNotice = async () => {
    if (serverNoti.length === notiIndex + 1) {
      _handleCheckAutoLogin();
    } else {
      setNotiIndex(notiIndex + 1);
    }
  };

  //???????????????
  const _handleCheckAutoLogin = async () => {
    if (autoLogin) {
      const result = await _loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        from,
        true
      );

      if (result.errors) {
        _handleloginCheckError(result.errors);
        from === 'this' && UserApi.logoutRequest(result);
        onLogout();
        navigation.reset({ routes: [{ name: 'LoginStack' }] });
      } else {
        const isDeploy: boolean = await serviceCheck(result);

        if (isDeploy) {
          setVideoPolicy(loginType);
          navigation.reset({ routes: [{ name: 'MainStack' }] });
        } else {
          navigation.reset({ routes: [{ name: 'SelectCompany' }] });
        }
      }
    } else {
      onLogout();
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    }
  };

  //DeepLink??? ??????
  const _handleGetDeeplink = async (url: string) => {
    /* ????????? ????????? ??????????????? ????????? ??? (?????????, meet ?????? ??????)
      login_info= mobile | web | email (???????????? ???????????? 8?????? ?????? 3?????? unknown??? ?????????)
      type= login | conference | screen

      mPORTAL_ID=sadb0101 // ?????????
      mHASH_KEY=4737240669613779471317246605417595221 // wehago_s
      mAuth_r_token=1jKg3vXzvd5yR6kxKUGgJUYDaMhKcF // r??????
      mAuth_a_token=Rxhh9pCzoLpB5I1M6m36aqoDe5Ivxu // a??????
      cno=9 // h_selected_company_no
      
      video_id=a25f15cb-01d9-44cf-bafa-4b7122022cb3 // video chat id
      room_name=123 // talk??? ??????
    */
    // const m = getConferenceManager();
    // console.log(m);
    if (!url) return;
    if (timeout.current) clearTimeout(timeout.current);
    let result: any = querystringParser(url);
    // ???????????? ???????????? ??????
    if (result.is_creater) {
      // ????????? ????????? ?????? ??????
      setAlert({
        type: 1,
        title: '??????',
        message: 'meet ????????? ?????? ?????? ???????????? ????????????'
      });
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else if (result.mHASH_KEY && result.mPORTAL_ID) {
      //??????????????? ?????????
      const { mHASH_KEY, mAuth_r_token, mAuth_a_token, cno, video_id } = result;
      onLogout();
      if (mHASH_KEY !== 'null' && cno !== 'null') {
        const info = await _loginCheckRequest(
          mAuth_a_token,
          mAuth_r_token,
          cno,
          mHASH_KEY,
          'deepLink',
          true
        );
        if (info.errors) {
          _handleloginCheckError(info.errors);
          navigation.reset({ routes: [{ name: 'LoginStack' }] });
        } else {
          const isDeploy: boolean = await serviceCheck(info);
          if (isDeploy) {
            let videoPolicy =
              result.name === 'staffmanagment' ? 'nahago' : 'wehago';
            setVideoPolicy(videoPolicy);

            navigation.reset({ routes: [{ name: 'MainStack' }] });
            if (video_id) {
              const { name } = await MeetApi.getMeetRoom(auth, video_id);
              navigation.navigate('ConferenceStateView', {
                id: result.video_id,
                accessType: 'auth',
                selectedRoomName: name
              });
            }
          } else {
            navigation.reset({ routes: [{ name: 'SelectCompany' }] });
          }
        }
      } else {
        let alertText =
          result.name === 'staffmanagment'
            ? '??????????????? ?????? ????????? ????????????'
            : '??????????????? ???????????????.';
        Alert.alert('??????', alertText, [
          {
            text: '??????',
            onPress: () => {
              navigation.reset({ routes: [{ name: 'LoginStack' }] });
            }
          }
        ]);
      }
    } else if (result.login_info === 'email') {
      //??????????????? ?????????
      let decoded = jwt_decode(result.token);
      /*
      email: "sadb0101@naver.com"
      exp: 1919234662
      iat: 1603874662
      room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
      sub: "video.wehago.com"
      */
      const { name } = await MeetApi.getMeetRoomNoCert(decoded.room);

      navigation.reset({
        routes: [
          {
            name: 'ConferenceStateView',
            params: {
              accessType: 'email',
              id: decoded.room,
              selectedRoomName: name,
              emailToken: result.token
            }
          }
        ]
      });
    } else if (result.video_id) {
      // TODO: ??????????????? ???????????? ??? ?????? ????????? ????????? ???????????? ??????????????? ??????
      // CASE: ?????? ???????????? URL??? ????????? ?????? ?????? ?????? ??????
      // WEHAGO?????? ?????? ????????? ????????? ?????? ??? ????????? ????????? ?????? ????????? ?????? ????????? ????????? ???????????? ?
      if (auth.user_no) {
        const { name } = await MeetApi.getMeetRoomNoCert(result.video_id);
        navigation.reset({
          routes: [
            {
              name: 'ConferenceStateView',
              params: {
                id: result.video_id,
                accessType: 'auth',
                selectedRoomName: name
              }
            }
          ]
        });
      } else {
        const { joincode, video_id } = result;
        const { name } = await MeetApi.getMeetRoomNoCert(video_id);
        navigation.reset({
          routes: [
            {
              name: 'ConferenceStateView',
              params: {
                accessType: 'joincode',
                id: video_id,
                joincode: joincode,
                selectedRoomName: name
              }
            }
          ]
        });

        // Alert.alert(t('????????? ??????'), t('??????????????? ?????????????????? ????????????.'), [
        //   {
        //     text: '??????',
        //     onPress: () => {
        //       navigation.reset({ routes: [{ name: 'LoginStack' }] });
        //     }
        //   }
        // ]);
      }
    } else {
      if (!result.video_id) {
        onLogout();
        Alert.alert(t('??????'), t('??????????????? ???????????????.'), [
          {
            text: '??????',
            onPress: () => {
              navigation.reset({ routes: [{ name: 'LoginStack' }] });
            }
          }
        ]);
      }
    }
  };

  const serviceCheck = async (auth: any) => {
    // ?????? ?????? ?????? ??? ??????
    // const statusCheck = await ServiceCheckApi.companyStatusCheck(
    //   auth,
    //   auth.last_company
    // );
    // ????????? ?????? ????????? ?????? ????????? ?????? ??????
    // if (statusCheck && statusCheck.code === 200) {
    // ????????? ???????????? ??????

    const isDeploy = await ServiceCheckApi.serviceCheck(auth);
    // const isDeploy = isDeployWehagomeet;
    // ????????? ???????????? ??????
    // const isDeployWebrtc = await ServiceCheckApi.serviceCheck(
    //   auth,
    //   'webrtc'  ???????????? ??????
    // );
    // 'wehagomeet' ???????????? ??????
    // || isDeployWebrtc;
    setPermission(isDeploy);
    return isDeploy;
    // } else {
    //   return false;
    // }
  };

  //????????? ??????
  const _loginCheckRequest = async (
    AUTH_A_TOKEN: string,
    AUTH_R_TOKEN: string,
    cno: string,
    HASH_KEY: string,
    from: string,
    flag = true // ???????????????
  ) => {
    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );
    if (checkResult.resultCode === 200) {
      console.log('checkResult.rankname : ', checkResult.rankname);
      const userData = {
        // login api data
        AUTH_A_TOKEN,
        AUTH_R_TOKEN,
        HASH_KEY,
        cno: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.last_access_company_no
          : cno,
        // check api data
        user_no: checkResult.resultData.user_no,
        portal_id: checkResult.resultData.portal_id, // ?????????
        user_name: checkResult.resultData.user_name,
        user_default_email: checkResult.resultData.user_default_email,
        user_email: checkResult.resultData.user_email,
        profile_url: checkResult.resultData.profile_url,
        user_contact: checkResult.resultData.user_contact,
        employee_list: checkResult.resultData.employee_list, // ????????????
        last_access_company_no: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.last_access_company_no
          : cno,
        last_company: checkResult.resultData.last_access_company_no
          ? checkResult.resultData.employee_list.filter(
              (e: any) =>
                e.company_no == checkResult.resultData.last_access_company_no
            )[0]
          : checkResult.resultData.employee_list[0], // last_access_company_no??? ???????????? ????????? ??? ??? ????????? null??? ????????? ???????????? ????????? ???????????? ??????
        member_type: checkResult.resultData.member_type, // 0: ????????????, 1: ????????????
        nickname: checkResult.nickname,
        rankname: checkResult.rankname,
        isFreelancer: checkResult.isFreelancer,
        full_path: checkResult.full_path,
        membership_code: checkResult.resultData.employee_list[0].membership_code
      };
      await onLogin(userData, from, flag);
      return userData;
    } else {
      const result = checkResult.errors ? checkResult : { errors: checkResult };
      eventLog(result);
      return result;
    }
  };

  const _handleloginCheckError = (errors: any) => {
    if (errors.code === 'E002') {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message: t('renewal.alert_text_duplicate_logout')
      });
    } else if (errors.status === '400') {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message: t('renewal.alert_text_login_info_error')
      });
    } else if (errors.status === '401') {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message: t('renewal.alert_text_no_right')
      });
    } else if (errors.message === 'timeout') {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message: t('renewal.alert_text_timeover')
      });
    } else {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message: t('renewal.alert_text_problem_ocurred')
      });
    }
  };

  return <SplashScreenPresenter servernoti={serverNoti[notiIndex]} />;
};

export default SplashScreenContainer;
