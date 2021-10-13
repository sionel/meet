import React, { RefObject, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { getT } from '../../utils/translateManager';
import { Linking, Platform } from 'react-native';

const LoginScreenContainer = ({ navigation, setAlert, setRootState }: any) => {
  const [code, setCode] = useState('');
  const [joincodeErr, setJoincodeErr] = useState(false);
  const t = getT();

  const codeLineRef: RefObject<any> = useRef();

  const codeInput = async (value: string) => {
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
    const result = await MeetApi.searchJoincode(joincode);
    if (!result) {
      setAlert({
        type: 1,
        title: t('alert_title_notion'),
        message: t('alert_text_no_exist_joincode')
      });
    } else if (result.resultData.code === 'E00001') {
      setAlert({
        type: 1,
        title: t('alert_title_notion'),
        message: t('alert_text_no_exist_joincode')
      });
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
  };

  const codeFocus = () => {
    codeLineRef.current.focus();
  };

  const goLoginD = () => {
    navigation.navigate('LoginInput');
  };

  const inputFocusOut = () => {
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
      Linking.openURL(
        Platform.OS === 'ios' ? iosMarketURL : androidMarketURL
      ).catch(err => {
        setAlert({
          type: 1,
          title: t('alert_title_error'),
          message: t('alert_text_no_app_store')
        });
      });
    });
  };

  return (
    <LoginScreenPresenter
      {...{
        code,
        codeInput,
        codeFocus,
        codeLineRef,
        goLoginD,
        inputFocusOut,
        LoginForWehago,
        joincodeErr
      }}
    />
  );
};

export default LoginScreenContainer;
