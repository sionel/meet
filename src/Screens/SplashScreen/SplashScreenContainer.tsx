import React, { Component, useEffect, useRef, useState } from 'react';
import { Platform, Linking, BackHandler, Alert } from 'react-native';
import SplashScreenPresenter from './SplashScreenPresenter';
import { WEHAGO_ENV } from '../../../config';
import { MeetApi, ServiceCheckApi } from '@services/index';
import { UserApi } from '@services/index';
import RNExitApp from 'react-native-exit-app';

import { querystringParser } from '@utils/index';
import jwt_decode from 'jwt-decode';

import { getT } from '@utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';

import { actionCreators as UserActions } from '@redux/user';
import { actionCreators as DocumentShareActions } from '@redux/documentShare';
import { actionCreators as WedriveAcions } from '@redux/wedrive';
import { actionCreators as AlertAcions } from '@redux/alert';
import { actionCreators as IndicatorAcions } from '@redux/indicator';
import { actionCreators as RecentsActions } from '@redux/recentsInvited';
import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as RootActions } from '@redux/root';
import { MeetNavigationProps } from '@navigations/RootNavigation';
import { isSuccess } from '@services/types';
import { errorType } from '@services/api/types';

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
  const setSharingMode = (flag: boolean) =>
    dispatch(DocumentShareActions.setSharingMode(flag));
  const setInitInfo = () => dispatch(WedriveAcions.setInitInfo());
  const toggleUpdateNoti = () => dispatch(UserActions.toggleUpdateNoti());
  const setAlert = (params: any) => dispatch(AlertAcions.setAlert(params));
  const eventLog = (event: any) => dispatch(UserActions.eventLog(event));
  const setVideoPolicy = (videoPolicy: string) =>
    dispatch(RootActions.setVideoPolicy(videoPolicy));

  //#endregion

  useEffect(() => {
    // 강제종료 했을때를 위한 강제 초기화
    setInitInfo();
    setSharingMode(false);
    _handleInit();
  }, []);

  useEffect(() => {
    _handleGetDeeplink(url);
  }, [url]);

  const _handleInit = async () => {
    timeout.current = setTimeout(() => {
      _handleCheckAutoLogin();
    }, 4000);
    // 버전 확인
    await _handleCheckVersion();

    // 노티 확인
    await _handleCheckNotice();
  };

  const _handleCheckVersion = async () => {
    const os = Platform.OS;
    const majorVersion = 13;

    let result: any;
    const checkVersion = await MeetApi.checkVersion(os, majorVersion);
    if (isSuccess(checkVersion)) {
      result = checkVersion;
    }
    if (!result.resultData.update || result.resultData.dev_mode) return [];
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
      // 확인코드 :101
      // 강제종료 코드 : 102
      const result = await MeetApi.checkNotice();
      if (isSuccess(result)) {
        const { resultData } = result;
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
      }
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

  //자동로그인
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

      if (result) {
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

  //DeepLink로 접근
  const _handleGetDeeplink = async (url: string) => {
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
    // const m = getConferenceManager();
    // console.log(m);
    if (!url) return;
    if (timeout.current) clearTimeout(timeout.current);
    let result: any = querystringParser(url);
    // 화상회의 요청인지 판별
    if (result.is_creater) {
      // 오래된 딥링크 주소 차단
      setAlert({
        type: 1,
        title: '오류',
        message: 'meet 앱에서 다시 접근 해주시길 바랍니다'
      });
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else if (result.mHASH_KEY && result.mPORTAL_ID) {
      //토근정보가 있을때
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

        if (info) {
          const isDeploy: boolean = await serviceCheck(info);
          if (isDeploy) {
            setVideoPolicy(loginType);
            navigation.reset({ routes: [{ name: 'MainStack' }] });
            if (video_id) {
              const getMeetRoom = await MeetApi.getMeetRoom(auth, video_id);
              if (isSuccess(getMeetRoom)) {
                const { name } = getMeetRoom.resultData;
                navigation.navigate('ConferenceStateView', {
                  id: result.video_id,
                  accessType: 'auth',
                  selectedRoomName: name
                });
              } else {
                console.warn('getMeetRoom : ', getMeetRoom.errors);
              }
            }
          } else {
            navigation.reset({ routes: [{ name: 'SelectCompany' }] });
          }
        }
      } else {
        let alertText =
          result.name === 'staffmanagment'
            ? '나하고에서 먼저 로그인 해주세요'
            : '비정상적인 접근입니다.';
        Alert.alert('알림', alertText, [
          {
            text: '확인',
            onPress: () => {
              navigation.reset({ routes: [{ name: 'LoginStack' }] });
            }
          }
        ]);
      }
    } else if (result.login_info === 'email') {
      //토근정보가 없을때
      let decoded = jwt_decode(result.token);
      /*
      email: "sadb0101@naver.com"
      exp: 1919234662
      iat: 1603874662
      room: "b15091c1-2acd-47f6-aa7c-6a94df0e5a17"
      sub: "video.wehago.com"
      */
      const emailResult = await MeetApi.getMeetRoomNoCert(decoded.room);

      if (isSuccess(emailResult)) {
        const { name } = emailResult.resultData;

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
        // TODO: 컨퍼런스로 받았을때 이 분기 처리를 어떻게 해야할지 검토필요성 있음
        // CASE: 해당 화상회의 URL을 통해서 직접 접속 했을 경우
        // WEHAGO에서 계정 정보를 가지고 올때 이 분기랑 토큰이 있는 분기랑 둘다 접근함 문제가 없는건지 ?
        if (auth.user_no) {
          const linkResult = await MeetApi.getMeetRoomNoCert(result.video_id);

          if (isSuccess(linkResult)) {
            const { name } = linkResult.resultData;

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
            //error
          }
        } else {
          const { joincode, video_id } = result;
          const cert = await MeetApi.getMeetRoomNoCert(video_id);
          if (isSuccess(cert)) {
            navigation.reset({
              routes: [
                {
                  name: 'ConferenceStateView',
                  params: {
                    accessType: 'joincode',
                    id: video_id,
                    joincode: joincode,
                    selectedRoomName: cert.resultData.name
                  }
                }
              ]
            });
          }
        }
      } else {
        if (!result.video_id) {
          onLogout();
          Alert.alert(t('알림'), t('비정상적인 접근입니다.'), [
            {
              text: '확인',
              onPress: () => {
                navigation.reset({ routes: [{ name: 'LoginStack' }] });
              }
            }
          ]);
        }
      }
    }
  };
  const serviceCheck = async (auth: any) => {
    const isDeploy = await ServiceCheckApi.serviceCheck(auth);
    setPermission(isDeploy);
    return isDeploy;
  };

  //로그인 요청
  const _loginCheckRequest = async (
    AUTH_A_TOKEN: string,
    AUTH_R_TOKEN: string,
    cno: string,
    HASH_KEY: string,
    from: string,
    flag = true // 자동로그인
  ) => {
    const checkResult = await UserApi.check(
      AUTH_A_TOKEN,
      AUTH_R_TOKEN,
      cno,
      HASH_KEY
    );

    if (isSuccess(checkResult)) {
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
              (e: any) =>
                e.company_no == checkResult.resultData.last_access_company_no
            )[0]
          : checkResult.resultData.employee_list[0], // last_access_company_no가 비어있는 상태로 올 수 있어서 null이 뜬다면 리스트중 첫번째 인덱스로 처리
        member_type: checkResult.resultData.member_type, // 0: 일반회원, 1: 개인회원
        nickname: checkResult.resultData.nickname,
        rankname: checkResult.resultData.rankname,
        isFreelancer: checkResult.resultData.isFreelancer,
        full_path: checkResult.resultData.full_path,
        membership_code: checkResult.resultData.employee_list[0].membership_code
      };
      await onLogin(userData, from, flag);
      return userData;
    } else {
      const { errors } = checkResult;
      eventLog(errors);
      _handleloginCheckError(errors);
      from === 'this' && UserApi.logoutRequest(auth);
      onLogout();
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    }
  };

  const _handleloginCheckError = (errors: errorType) => {
    if (errors.code === 'E002') {
      setAlert({
        type: 1,
        title: t('renewal.alert_title_login_fail'),
        message:
          loginType === 'nahago'
            ? t('renewal.alert_text_duplicate_logout2')
            : t('renewal.alert_text_duplicate_logout')
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
    } else if (errors.message === '500') {
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
