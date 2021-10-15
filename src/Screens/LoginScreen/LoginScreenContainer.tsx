import React, { RefObject, useEffect, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { Linking, Platform } from 'react-native';
import { actionCreators as UserActions } from '../../redux/modules/user';
import { actionCreators as AlertActions } from '../../redux/modules/alert';
import {
  actionCreators as RootActions,
  Rootsstate
} from '../../redux/modules/root';
import { getT } from '../../utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';
import Orientation, { OrientationType } from 'react-native-orientation-locker';
// import { useTranslation } from 'react-i18next';

const LoginScreenContainer = ({ navigation }: any) => {
  const [code, setCode] = useState('');
  const [orientation, setOrientation] = useState('');
  const [joincodeErr, setJoincodeErr] = useState(false);

  const codeLineRef: RefObject<any> = useRef();

  const { auth, from, permission } = useSelector((state: RootState) => {
    return {
      auth: state.user.auth,
      from: state.user.from,
      permission: state.user.permission
    };
  });

  const dispatch = useDispatch();
  const setAlert = (params: any) => dispatch(AlertActions.setAlert(params));

  const setRootState = (rstate: Rootsstate) =>
    dispatch(RootActions.setRootState(rstate));

  const t = getT();
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

  const goLoginInput = () => {
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

  const _handleOrientation = (orientation:OrientationType) => {
    const status:boolean =
    orientation === 'LANDSCAPE' ||
    orientation === 'LANDSCAPE-LEFT' ||
    orientation === 'LANDSCAPE-RIGHT';
    setOrientation(status ? 'horizontal' : 'vertical');
  };

  useEffect(() => {
    Orientation.getOrientation(orientation => {
      const status:boolean = 
      orientation === 'LANDSCAPE' ||
      orientation === 'LANDSCAPE-LEFT' ||
      orientation === 'LANDSCAPE-RIGHT';
      setOrientation(status ? 'horizontal' : 'vertical');
    })
    Orientation.addOrientationListener(_handleOrientation)
  })

  return (
    <LoginScreenPresenter
      {...{
        code,
        codeInput,
        codeFocus,
        codeLineRef,
        goLoginInput,
        inputFocusOut,
        LoginForWehago,
        joincodeErr,
        t
      }}
    />
  );
};

export default LoginScreenContainer;
