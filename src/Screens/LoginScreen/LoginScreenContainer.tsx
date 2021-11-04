import React, { RefObject, useEffect, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { Linking, Platform } from 'react-native';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { getT } from '../../utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import deviceInfoModule from 'react-native-device-info';
import { RootState } from '../../redux/configureStore';

const LoginScreenContainer = ({ navigation }: any) => {
  const isIOS = Platform.OS === 'ios';

  const [code, setCode] = useState('');
  const [shadowCode, setShadowCode] = useState('');
  const [joincodeErr, setJoincodeErr] = useState(false);
  const [inputcodeErr, setInputcodeErr] = useState(false);
  const [logging, setLogging] = useState(false);
  const [focusingNum, setFocusingNum] = useState(-1);

  const codeLineRef: RefObject<any> = useRef();

  const { isHorizon } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon
  }));

  const dispatch = useDispatch();

  const _setLoaded = (loaded: boolean) =>
    dispatch(RootActions.setLoaded(loaded));
  const _setDestination = (destination: string) =>
    dispatch(RootActions.setDestination(destination));
  const _setParams = (params: {}) => dispatch(RootActions.setParams(params));
  const _setUrl = (url: string) => dispatch(RootActions.setUrl(url));

  const t = getT();
  const isTablet: boolean = deviceInfoModule.isTablet();

  const changeInputcode = async (value: string) => {
    const regex = /^[0-9|a-f|A-F|]*$/;

    logging && setCode('');
    setLogging(false);

    let joincode = '';

    if (value.match(regex)) {
      joincode = value.trim();
      setCode(joincode);
      setJoincodeErr(false);
      setFocusingNum(joincode.length);

      if (joincode.length === 6) {
        setJoincodeErr(false);
        _goJoincode(joincode);
        setShadowCode(joincode);
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
    setLogging(true);
  };

  const onFocusInput = () => {
    setInputcodeErr(false);
    setFocusingNum(code.length);
  };

  const onFocusingCode = () => {
    codeLineRef.current.focus();
  };

  const goLoginInput = () => {
    navigation.navigate('LoginInput');
  };

  const onFocusOutInput = () => {
    if (codeLineRef.current.isFocused()) codeLineRef.current.blur();
    else setFocusingNum(-1);
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
  return (
    <LoginScreenPresenter
      {...{
        code,
        focusingNum,
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
        goLoginInput,
        shadowCode
      }}
    />
  );
};

export default LoginScreenContainer;
