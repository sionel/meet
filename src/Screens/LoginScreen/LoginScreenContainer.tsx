import React, {RefObject, useRef, useState} from 'react';
import LoginScreenPresenter from './LoginScreenPresenter';
import {Alert} from 'react-native';

const LoginScreenContainer = ({navigation}: any) => {
  const [code, setCode] = useState('');
  const codeLineRef:RefObject<any> = useRef();

  const codeInput = (value: string) => {
    let joincode = value.trim();

    setCode(value);

    if (joincode.length === 6) {
      setCode('');

      Alert.alert('참여코드 조회', joincode, [
        {text: '다음페이지로', onPress: goLoginD},
      ]);
    }
  };

  const codeFocus = () => {
    codeLineRef.current.focus();
  };

  const goLoginD = () => {
    navigation.navigate('LOGIND');
  };

  return (
    <LoginScreenPresenter {...{code, codeInput, codeFocus, codeLineRef, goLoginD}} />
  );
};

export default LoginScreenContainer;
