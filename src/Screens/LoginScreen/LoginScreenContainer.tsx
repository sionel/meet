import React, { RefObject, useEffect, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '@services/index';
import { Alert, Linking, Platform } from 'react-native';
import { actionCreators as RootActions } from '@redux/root';
import { getT } from '@utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import deviceInfoModule from 'react-native-device-info';
import { RootState } from '../../redux/configureStore';
import { LoginNavigationProps } from '@navigations/LoginStack';
import { isSuccess } from '@services/types';

const LoginScreenContainer = ({
  navigation
}: LoginNavigationProps<'InviteCode'>) => {
  const [code, setCode] = useState('');
  const [shadowCode, setShadowCode] = useState('');
  const [joincodeErr, setJoincodeErr] = useState(false);
  const [inputcodeErr, setInputcodeErr] = useState(false);
  const [logging, setLogging] = useState(false);
  const [focusingNum, setFocusingNum] = useState(-1);

  const isIOS = Platform.OS === 'ios';

  const codeLineRef: RefObject<any> = useRef();

  const { isHorizon, loginType } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon,
    loginType: state.user.loginType
  }));

  const t = getT();
  const isTablet = deviceInfoModule.isTablet();

  //참여코드 입력시 정규식 체크하고 입력
  const changeInputcode = async (value: string) => {
    const regex = /^[0-9|a-f|A-F|]*$/;
    setInputcodeErr(false);
    logging && setCode('');
    setLogging(false);
    setShadowCode('');
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
      // logging && setInputcodeErr(true);
      // setLogging(true);
    }
  };

  const _goJoincode = async (joincode: string) => {
    // V 고려해야할부분
    setLogging(true);
    const searchJoincode = await MeetApi.searchJoincode(joincode);
    let result: any;

    if (isSuccess(searchJoincode)) {
      result = searchJoincode.resultData;
      if (result.code === 'E00001') {
        setFocusingNum(0);
        setInputcodeErr(true);
        return;
      }
      const codeResult = await MeetApi.getMeetRoomNoCert(result.room);
      if (isSuccess(codeResult)) {
        const { name } = codeResult.resultData;
        navigation.navigate('ConferenceStateView', {
          id: result.room,
          accessType: 'joincode',
          joincode: joincode,
          selectedRoomName: name
        });
      } else {
        //error
      }
    } else {
      setFocusingNum(0);
      setInputcodeErr(true);
    } else {
      const { name } = await MeetApi.getMeetRoomNoCert(resultData.room);
      navigation.navigate('ConferenceStateView', {
        accessType: 'joincode',
        id: resultData.room,
        joincode: joincode,
        selectedRoomName: name
      });
    }
  };

  //참여코드 포커스
  const onFocusInput = () => {
    setInputcodeErr(false);
    setFocusingNum(code.length);
  };

  //뒤에 숨겨져 있는 INPUT 박스로 포커스를 넘김
  const onFocusingCode = () => {
    codeLineRef.current.focus();
  };

  const onFocusOutInput = () => {
    // if (codeLineRef.current.isFocused()) codeLineRef.current.blur();
    setFocusingNum(-1);
  };

  const LoginForWehago = () => {
    let serviceCode;
    serviceCode = isIOS ? 'wehagomeet' : 'meet';

    const iosUrl = `wehago://?${serviceCode}=login`;
    const androidUrl = `wehago://app?name=${serviceCode}&login=true`;

    Linking.openURL(isIOS ? iosUrl : androidUrl).catch(err => {
      navigation.navigate('InputLogin');
    });
  };

  const handleLoginForNahago = () => {
    const requestUrl = 'staffmanagment://app?name=meet&login=true';
    Linking.openURL(requestUrl).catch(err => {
      Alert.alert('나하고 앱 호출을 실패하였습니다.');
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
        shadowCode,
        loginType,
        handleLoginForNahago
      }}
    />
  );
};

export default LoginScreenContainer;
