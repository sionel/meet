import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import Icon from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

const logo = require('../../img/logo.png');

const LoginInputPresenter = (props: any) => {
  const {
    toggleChk,
    setToggleChk,
    userId,
    idInput,
    usernameRef,
    password,
    pwInput,
    passwordRef,
    loginchk,
    inputOut,
  } = props;
  return (
    <View style={{flex: 1, backgroundColor: '#e7f9fe'}}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={inputOut}>
          <View style={{flex:1}}></View>
        <Image source={logo} style={styles.imageView} resizeMode={'center'}/>
        <View style={styles.topContainer}>
          <View style={styles.inputSec}>
            {/* <Icon
              name="person-outline"
              size={24}
              color="black"
              style={styles.icon}
            /> */}
            <TextInput
              style={styles.inputLogin}
              placeholder="아이디"
              ref={usernameRef}
              returnKeyType="next"
              // autoCapitalize="characters"
              value={userId}
              onChangeText={idInput}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
          </View>
          <View style={styles.inputSec}>
            {/* <Icon
              name="lock-closed-outline"
              size={24}
              color="black"
              style={styles.icon}
            /> */}
            <TextInput
              style={styles.inputLogin}
              placeholder="비밀번호"
              secureTextEntry={true}
              ref={passwordRef}
              value={password}
              returnKeyType="go"
              autoCapitalize="none"
              onChangeText={pwInput}
              onSubmitEditing={() => loginchk(userId, password)}
            />
          </View>
        </View>
        <View style={styles.bottomContainer}>
          {/* <LinearGradient
            end={{x:0, y:0.5}}
            start={{x:1, y:0.5}}
            colors={['#56ccf2', '#2f80ed']}
            style={styles.loginButtonView}> */}
            <TouchableHighlight
              style={styles.loginButtonTouch}
              activeOpacity={1}
              onPress={() => loginchk(userId, password)}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableHighlight>
          {/* </LinearGradient> */}
          <TouchableOpacity activeOpacity={1} style={styles.chkboxView}>
            {/* {Platform.OS === 'ios' ? (
              <CheckBox
                boxType="square"
                value={toggleChk}
                onValueChange={setToggleChk}
              />
            ) : (
              <CheckBox value={toggleChk} onValueChange={setToggleChk} />
            )} */}

            <Text style={styles.chkboxText}>아이디 저장</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1}}></View>
        <View style={styles.copyrightView}>
          <Text style={styles.copyrightText}>
            CopyRight{'\u00A9'} DOUZONE BIZONE. All rights reserved.
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageView: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    paddingLeft: '6%',
    paddingRight: '6%',
    // backgroundColor:'#f12'
  },
  topContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#e7f9fe',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#8a9',
  },
  //아이디, 비밀번호 입력
  inputSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    left: 30,
    bottom: Platform.OS === 'ios' ? 5 : 0,
  },
  inputLogin: {
    paddingLeft: '15%',
    paddingBottom: 5,
    fontSize: 16,
    width: '100%',
    borderBottomColor: 'rgba(204,204,204,0.5)',
    borderBottomWidth: 1,
  },
  //로그인버튼
  loginButtonView: {
    flexDirection: 'row',
    width: '95%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonTouch: {
    flex: 1, 
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  //체크박스
  chkboxView: {
    flexDirection: 'row',
    width: '95%',
    // backgroundColor:'#63c'
  },
  chkboxText: {
    // paddingTop: Platform.OS === 'ios' ? 8 : 5,
    // paddingLeft: Platform.OS === 'ios' ? 5 : 1,
    fontSize: 14,
    color: 'rgb(51,51,51)',
    paddingTop: 8,
    paddingLeft: 5,
  },
  //저작권
  copyrightView: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: '5%',
  },
  copyrightText: {
    color: 'rgb(147,147,147)',
    fontSize: 11,
  },
});

export default LoginInputPresenter;
