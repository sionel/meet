import React, { RefObject, useRef, useState } from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import { MeetApi } from '../../services';
import { getT } from '../../utils/translateManager';

const LoginScreenContainer = ({
  navigation,
  setAlert,
  setRootState,
}: any) => {
  const [code, setCode] = useState('');
  const t = getT();

  const codeLineRef: RefObject<any> = useRef();

  const codeInput = async (value: string) => {
    let joincode = value.trim();

    setCode(joincode);

    if (joincode.length === 6) {
      await _goJoincode(joincode);

      setCode('');
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

  return (
    <LoginScreenPresenter
      {...{ code, codeInput, codeFocus, codeLineRef, goLoginD, inputFocusOut }}
    />
  );
};

export default LoginScreenContainer;
