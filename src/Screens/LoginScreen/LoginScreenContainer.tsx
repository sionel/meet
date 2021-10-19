import React, { RefObject, useEffect, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { Linking, Platform } from 'react-native';
// import { actionCreators as UserActions } from '../../redux/modules/user';
// 01import { actionCreators as AlertActions } from '../../redux/modules/alert';
import {
  actionCreators as RootActions,
  Rootsstate
} from '../../redux/modules/root';
import { getT } from '../../utils/translateManager';
import { useDispatch } from 'react-redux';
import {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import deviceInfoModule from 'react-native-device-info';

const LoginScreenContainer = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [isHorizon, setIsHorizon] = useState(false);
  const [joincodeErr, setJoincodeErr] = useState(false);
  const [inputcodeErr, setInputcodeErr] = useState(false);
  const [logging, setLogging] = useState(false);

  const codeLineRef: RefObject<any> = useRef();

  // const { auth, from, permission } = useSelector((state: RootState) => {
  //   return {
  //     auth: state.user.auth,
  //     from: state.user.from,
  //     permission: state.user.permission
  //   };
  // });

  const dispatch = useDispatch();
  // const setAlert = (params: any) => dispatch(AlertActions.setAlert(params));

  const setRootState = (rstate: Rootsstate) =>
    dispatch(RootActions.setRootState(rstate));

  //
  const t = getT();
  const isTablet: boolean = deviceInfoModule.isTablet();

  const changeInputcode = async (value: string) => {
    const regex = /^[0-9|a-f|A-F|]*$/;

    let joincode = '';

    if (value.match(regex)) {
      joincode = value.trim();
      setCode(joincode);
      setJoincodeErr(false);

      if (joincode.length === 6) {
        setJoincodeErr(false);
        await _goJoincode(joincode);

        setCode('');
      }
    } else {
      setJoincodeErr(true);
    }
  };

  const _goJoincode = async (joincode: string) => {
    setLogging(true);
    const result = await MeetApi.searchJoincode(joincode);
    if (!result) {
      setInputcodeErr(true);
      // setAlert({
      //   type: 1,
      //   title: t('alert_title_notion'),
      //   message: t('alert_text_no_exist_joincode')
      // });
    } else if (result.resultData.code === 'E00001') {
      setInputcodeErr(true);
      // setAlert({
      //   type: 1,
      //   title: t('alert_title_notion'),
      //   message: t('alert_text_no_exist_joincode')
      // });
    } else {
      setRootState({
        loaded: true,
        destination: 'Setting',
        params: {
          accesstype: 'joincode',
          roomId: result.resultData.room,
          joincode
        }
      });
    }
    setLogging(false);
  };

  const onFocusInput = () => {
    setInputcodeErr(false);
  };

  const onFocusingCode = () => {
    codeLineRef.current.focus();
  };

  const goLoginInput = () => {
    navigation.navigate('LoginInput');
  };

  const onFocusOutInput = () => {
    if (codeLineRef.current.isFocused()) return codeLineRef.current.blur();
  };

  const LoginForWehago = () => {
    let serviceCode;

    serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';

    const iosUrl = `wehago://?${serviceCode}=login`;
    const androidUrl = `wehago://app?name=${serviceCode}&login=true`;
    const iosMarketURL =
      'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL =
      'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

    Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch(err => {
      goLoginInput();
      // Linking.openURL(
      //   Platform.OS === 'ios' ? iosMarketURL : androidMarketURL
      // ).catch(err => {
      //   setAlert({
      //     type: 1,
      //     title: t('alert_title_error'),
      //     message: t('alert_text_no_app_store')
      //   });
      // });
    });
  };

  const _handleHorizon = (orientation: OrientationType) => {
    const status: boolean =
      orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT';
    setIsHorizon(status);
  };

  useEffect(() => {});

  useDeviceOrientationChange((orientation: OrientationType) => {
    _handleHorizon(orientation);
  });

  return (
    <LoginScreenPresenter
      {...{
        code,
        onFocusingCode,
        changeInputcode,
        onFocusInput,
        onFocusOutInput,
        codeLineRef,
        LoginForWehago,
        joincodeErr,
        inputcodeErr,
        isHorizon,
        isTablet,
        t,
        logging,
      }}
    />
  );
};

export default LoginScreenContainer;
