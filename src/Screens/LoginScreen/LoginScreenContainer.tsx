import React, { RefObject, useEffect, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { Linking, Platform } from 'react-native';
// import { actionCreators as UserActions } from '../../redux/modules/user';
// 01import { actionCreators as AlertActions } from '../../redux/modules/alert';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { getT } from '../../utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import Orientation, {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import deviceInfoModule from 'react-native-device-info';
import { RootState } from '../../redux/configureStore';

const LoginScreenContainer = ({ navigation }: any) => {
  const isIOS = Platform.OS === 'ios';

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

  const _setLoaded = (loaded: boolean) => dispatch(RootActions.setLoaded(loaded));
  const _setDestination = (destination: string) => dispatch(RootActions.setDestination(destination));
  const _setParams = (params: {}) => dispatch(RootActions.setParams(params));
  const _setUrl = (url: string) => dispatch(RootActions.setUrl(url));

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
    // V 고려해야할부분 
    setLogging(true);
    const result = await MeetApi.searchJoincode(joincode);
    if (!result) setInputcodeErr(true);
    else if (result.resultData.code === 'E00001') setInputcodeErr(true);
    else {
      _setLoaded(true);
      _setParams({
        accesstype: 'joincode',
        roomId: result.resultData.room,
        joincode
      });
      _setDestination('Setting');
      
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
    serviceCode = isIOS ? 'wehagomeet' : 'meet';

    const iosUrl = `wehago://?${serviceCode}=login`;
    const androidUrl = `wehago://app?name=${serviceCode}&login=true`;

    Linking.openURL(isIOS ? iosUrl : androidUrl).catch(err => {
      goLoginInput();
    });
  };

  const _handleHorizon = (orientation: OrientationType) => {
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      Orientation.unlockAllOrientations();
      setIsHorizon(true);
    } else if (
      orientation === 'PORTRAIT-UPSIDEDOWN' ||
      orientation === 'PORTRAIT'
    ) {
      Orientation.lockToPortrait();
      setIsHorizon(false);
    }
  };

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
        goLoginInput
      }}
    />
  );
};

export default LoginScreenContainer;
