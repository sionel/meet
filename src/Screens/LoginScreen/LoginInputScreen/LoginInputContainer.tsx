import React, {RefObject, useState} from 'react';
import {Alert} from 'react-native';
import LoginInputPresenter from './LoginInputPresenter';

const LoginInputContainer = ({navigation}: any) => {
  const [toggleChk, setToggleChk] = useState(false);

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const usernameRef: RefObject<any> = React.useRef(null);
  const passwordRef: RefObject<any> = React.useRef(null);

  const idInput = (text: string) => {
    setUserId(text.trim());
  };

  const pwInput = (text: string) => {
    setPassword(text.trim());
  };

  const loginchk = (userId: string, password: string) => {
    if (!userId) return usernameRef.current.focus();
    if (!password) return passwordRef.current.focus();

    Alert.alert('로그인성공', `userId : ${userId}\npassword : ${password}`, [
      {text: '이전페이지로', onPress: goLogin},
    ]);
  };

  const goLogin = () => {
    navigation.navigate('LOGIN');
  };

  const inputOut = () => {
    if (usernameRef.current.isFocused()) return usernameRef.current.blur();
    else if (passwordRef.current.isFocused()) return passwordRef.current.blur();
  };

  return (
    <LoginInputPresenter
      {...{
        toggleChk,
        setToggleChk,
        userId,
        idInput,
        usernameRef,
        password,
        pwInput,
        passwordRef,
        loginchk,
        inputOut
      }}
    />
  );
};

export default LoginInputContainer;
