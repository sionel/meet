import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { Text, TextInput } from '../../../components/StyledText';
import CustomCheckBoxContainer from '../../../components/CustomCheckBox';

const logo = require('../../../../assets2/logos/logo.png');

const user = require('../../../../assets2/icons/ic_person.png');
const lock = require('../../../../assets2/icons/ic_lock.png');

const patternU = require('../../../../assets/icons/bg_pattern_up.png');
const patternD = require('../../../../assets/icons/bg_pattern_down.png');

const LoginInputPresenter = (props: any) => {
  const {
    userId,
    idInput,
    usernameRef,
    password,
    pwInput,
    passwordRef,
    loginchk,
    inputFocusOut
  } = props;
  return (
    <View style={styles.baseView}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={inputFocusOut}
      >
        <View style={{ flex: 1 }} />
        <Image source={logo} style={styles.imageView} resizeMode={'center'} />
        <View style={styles.topContainer}>
          <View style={styles.inputSec}>
            <Image source={user} style={styles.icon} />
            <TextInput
              style={styles.inputLogin}
              placeholder="아이디"
              customRef={usernameRef}
              returnKeyType="next"
              value={userId}
              onChangeText={idInput}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>
          <View style={styles.inputSec}>
            <Image source={lock} style={styles.icon} />
            <TextInput
              style={styles.inputLogin}
              placeholder="비밀번호"
              secureTextEntry={true}
              customRef={passwordRef}
              value={password}
              returnKeyType="go"
              autoCapitalize="none"
              onChangeText={pwInput}
              onSubmitEditing={() => loginchk(userId, password)}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableHighlight
            style={styles.loginButtonView}
            onPress={() => loginchk(userId, password)}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableHighlight>
          <TouchableOpacity activeOpacity={1} style={styles.chkboxView}>
            <CustomCheckBoxContainer />
            <Text style={styles.chkboxText}>아이디 저장</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={styles.copyrightView}>
          <Text style={styles.copyrightText}>
            CopyRight{'\u00A9'} DOUZONE BIZONE. All rights reserved.
          </Text>
        </View>
      </TouchableOpacity>
      <Image
        source={patternD}
        style={{
          position: 'absolute',
          left: 0,
          bottom: '8%',
          resizeMode: 'center',
          width: 260,
          height: 82
        }}
      />
      <Image
        source={patternU}
        style={{
          position: 'absolute',
          width: 240,
          height: 240,
          right: 0,
          top: 0,
          resizeMode: 'center'
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  baseView: {
    flex: 1,
    backgroundColor: 'rgb(240,248,255)',
    position: 'relative'
  },
  container: {
    paddingLeft: '8%',
    paddingRight: '8%',
    zIndex: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  imageView: {
    flex: 1,
    alignItems: 'center'
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  //아이디, 비밀번호 입력
  inputSec: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  icon: {
    resizeMode: 'center',
    left: -20,
    bottom: Platform.OS === 'ios' ? 5 : 0,
    position: 'absolute'
  },
  inputLogin: {
    flex: 1,
    paddingLeft: '12%',
    paddingBottom: 5,
    fontSize: 16,
    borderBottomColor: 'rgb(230,230,230)',
    borderBottomWidth: 1
  },
  //로그인버튼
  loginButtonView: {
    width: '95%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#56ccf2'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16
  },
  //체크박스
  chkboxView: {
    flexDirection: 'row',
    width: '95%'
  },
  chkboxText: {
    // paddingTop: Platform.OS === 'ios' ? 8 : 5,
    // paddingLeft: Platform.OS === 'ios' ? 5 : 1,
    fontSize: 14,
    color: 'rgb(51,51,51)',
    paddingTop: 8,
    paddingLeft: 5
  },
  //저작권
  copyrightView: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    paddingBottom: '5%'
  },
  copyrightText: {
    color: 'rgb(147,147,147)',
    fontSize: 11
  }
});

export default LoginInputPresenter;
