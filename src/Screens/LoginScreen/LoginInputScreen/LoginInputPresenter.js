import React, { useState, useRef } from 'react';
import {
  Platform,
  Linking,
  Alert,
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  ImageBackground,
  Animated,
  Easing,
  Text,
  TextInput
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// import { Text, TextInput } from '../../../components/StyledText';
import { CustomIcon } from '../../../components';

export default function LoginInputPresenter(props) {
  const {
    usernameRef,
    passwordRef,
    captchaRef,
    captcha,
    userId,
    setUserId,
    loginFailed,
    userPw,
    setUserPw,
    _handleLogin,
    _handleChangeCapcha,
    captchaInput,
    setCaptchaInput,
    errorMsg,
    logging
  } = props;

  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  Animated.loop(
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.poly(1))
    })
  ).start();

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../../../assets/images/bgIntroWehagoIphoneX_3x.png')}
        style={styles.imageBackground}
      > */}
      {/* {Platform.OS === 'ios' && <View style={styles.dragIndicator} />} */}

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="padding"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (usernameRef.current.isFocused())
              return usernameRef.current.blur();
            else if (passwordRef.current.isFocused())
              return passwordRef.current.blur();
            else if (captcha)
              if (captchaRef.current.isFocused())
                return captchaRef.current.blur();
          }}
          style={styles.mainContainer}
        >
          <View style={styles.topContainer}>
            <CustomIcon
              name="logo_login"
              width={224}
              height={42}
              style={{ marginTop: 150 }}
            />

            <View style={{ marginTop: captcha ? 35 : 116 }}>
              {captcha && (
                <View style={styles.captchaMessageView}>
                  <Text
                    style={[styles.captchaMessageText, { marginBottom: 4 }]}
                  >
                    아이디 로그인 오류 횟수 초과
                  </Text>
                  <Text
                    style={[styles.captchaMessageText, { color: '#ababab' }]}
                  >
                    개인정보 도용으로 인해 발생할 수 있는 피해를 방지하고자
                  </Text>
                  <Text
                    style={[styles.captchaMessageText, { color: '#ababab' }]}
                  >
                    로그인 오류 허용 횟수를 5회로 제한하고 있습니다.
                  </Text>
                  {/* <Text
                    style={[styles.captchaMessageText, { color: '#cacaca' }]}
                  >
                    잠시 후 다시 시도해주시기 바랍니다.
                  </Text> */}
                </View>
              )}

              <View
                style={Object.assign(
                  {},
                  styles.inputArea,
                  userId && { borderColor: '#36d3fa' },
                  loginFailed && { borderColor: 'red' }
                )}
              >
                <TextInput
                  ref={usernameRef}
                  value={userId}
                  placeholder={'아이디'}
                  placeholderTextColor={'#ccc'}
                  selectionColor={'#505050'}
                  returnKeyType={'next'}
                  keyboardType="default"
                  autoCapitalize="none"
                  // onFocus={() => inputFocus(true)}
                  // onBlur={() => inputFocus(false)}
                  onChangeText={text => setUserId(text)}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  style={Object.assign({}, styles.inputField, { flex: 1 })}
                />
                {(userId || loginFailed) && (
                  <TouchableOpacity onPress={() => setUserId('')}>
                    <CustomIcon
                      name={
                        loginFailed
                          ? 'btn_login_delete_none'
                          : 'btn_login_delete_press'
                      }
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={Object.assign(
                  {},
                  styles.inputArea,
                  userPw && { borderColor: '#36d3fa' },
                  loginFailed && { borderColor: 'red' }
                )}
              >
                <TextInput
                  ref={passwordRef}
                  secureTextEntry={true}
                  value={userPw}
                  placeholder={'비밀번호'}
                  placeholderTextColor={'#ccc'}
                  selectionColor={'#505050'}
                  returnKeyType={'go'}
                  autoCapitalize="none"
                  // onFocus={() => inputFocus(true)}
                  // onBlur={() => inputFocus(false)}
                  onChangeText={text => setUserPw(text)}
                  onSubmitEditing={() => _handleLogin(userId, userPw, captcha)}
                  style={Object.assign({}, styles.inputField, { flex: 1 })}
                />
                {(userPw || loginFailed) && (
                  <TouchableOpacity onPress={() => setUserPw('')}>
                    <CustomIcon
                      name={
                        loginFailed
                          ? 'btn_login_delete_none'
                          : 'btn_login_delete_press'
                      }
                      width={24}
                      height={24}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {loginFailed && (
                <Text style={styles.loginFailedText}>
                  아이디 또는 비밀번호가 올바르지 않습니다.
                </Text>
              )}

              {captcha && (
                <View style={styles.captchaMessageView}>
                  <Text style={styles.captchaMessageText}>
                    정보보호를 위해 자동입력 방지문자를 순서대로 입력해주시기
                    바랍니다.
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 6
                    }}
                  >
                    <View style={styles.captchaArea}>
                      <Text
                        style={[styles.captchaMessageText, styles.captchaText]}
                      >
                        {captcha}
                      </Text>
                    </View>
                    <View style={styles.refresh}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={_handleChangeCapcha}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <CustomIcon
                          name={'btn_reload_none'}
                          width={15}
                          height={15}
                        />
                        <Text style={{ color: '#ababab' }}>새로고침</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TextInput
                    ref={captchaRef}
                    value={captchaInput}
                    placeholder={'자동입력 방지문자'}
                    placeholderTextColor={'#ccc'}
                    selectionColor={'#505050'}
                    returnKeyType={'next'}
                    keyboardType="default"
                    autoCapitalize="none"
                    // onFocus={() => inputFocus(true)}
                    // onBlur={() => inputFocus(false)}
                    onChangeText={text => setCaptchaInput(text)}
                    onSubmitEditing={() =>
                      _handleLogin(userId, userPw, captcha)
                    }
                    style={Object.assign(
                      {},
                      styles.inputField,
                      {
                        width: '100%',
                        borderBottomWidth: 1,
                        borderBottomColor: '#d9d9d9'
                      },
                      loginFailed && { borderBottomColor: 'red' }
                    )}
                  />
                  {errorMsg && (
                    <Text style={[styles.captchaMessageText, styles.errorMsg]}>
                      {errorMsg}
                    </Text>
                  )}
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <View style={styles.loginButtonGradient}>
                <TouchableHighlight
                  activeOpacity={0.6}
                  disabled={logging}
                  style={styles.loginButton}
                  // underlayColor={'#09b2f8'}
                  underlayColor={'#197cdc66'}
                  onPress={() => {
                    _handleLogin(userId, userPw, captcha);
                  }}
                >
                  <>
                    <Text style={styles.loginButtonText}>로그인</Text>
                    {logging && (
                      <Animated.View
                        style={{
                          transform: [{ rotate: spin }],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CustomIcon name={'loadIcon'} width={20} height={20} />
                      </Animated.View>
                    )}
                  </>
                </TouchableHighlight>
              </View>
              {/* <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                colors={['#36d3fa', '#1d94fc']}
                style={styles.loginButtonGradient}
              >
                <TouchableHighlight
                  activeOpacity={0.6}
                  disabled={logging}
                  style={styles.loginButton}
                  // underlayColor={'#09b2f8'}
                  underlayColor={'#197cdc66'}
                  // onPress={() => {
                  //   _handleLogin(userId, userPw, captcha);
                  // }}
                >
                  <>
                    <Text style={styles.loginButtonText}>로그인</Text>
                    {logging && (
                      <Animated.View
                        style={{
                          transform: [{ rotate: spin }],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CustomIcon name={'loadIcon'} size={20} />
                      </Animated.View>
                    )}
                  </>
                </TouchableHighlight>
              </LinearGradient> */}
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {/* </ImageBackground> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ...Platform.select({
    //   ios: {
    //     position: 'absolute',
    //     bottom: 0,
    //     left: 0,
    //     right: 0,
    //     top: 80,
    //     backgroundColor: 'transparent',
    //     alignItems: 'center'
    //   },
    //   android: {
    //     flex: 1,
    //     height: '100%'
    //   }
    // })
    flex: 1,
    height: '100%',
    backgroundColor: '#fff'
  },
  // dragIndicator: {
  //   marginTop: 12,
  //   width: 26,
  //   height: 3,
  //   backgroundColor: '#ddd',
  //   borderRadius: 2
  // },
  // imageBackground: {
  //   flex: 1,
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: 'transparent',
  //   alignItems: 'center',
  //   // borderTopLeftRadius: 15,
  //   // borderTopRightRadius: 15,
  //   // overflow: 'hidden'
  // },
  keyboardAvoidingView: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%'
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  captchaMessageView: {
    width: 320,
    marginVertical: 20
  },
  captchaMessageText: {
    fontSize: 10,
    fontFamily: 'DOUZONEText30',
    color: '#505050'
  },
  captchaArea: {
    flex: 1,
    padding: 10,
    backgroundColor: '#00000066'
  },
  captchaText: {
    color: '#000',
    // fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center'
  },
  refresh: {
    marginLeft: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center'
  },
  errorMsg: {
    color: 'red'
  },
  inputArea: {
    width: 320,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#d9d9d9',
    marginBottom: 10
  },
  inputField: {
    paddingVertical: 8,
    width: 285,
    color: '#333',
    fontSize: 15,
    fontFamily: 'DOUZONEText30'
  },
  loginFailedText: {
    color: 'red',
    fontSize: 10,
    fontFamily: 'DOUZONEText30'
  },
  buttonContainer: {
    // position: 'absolute',
    // bottom: 90,
    // left: '50%',
    // marginLeft: -150,
    width: 320,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  loginButtonGradient: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#1C90FC'
  },
  loginButton: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
    // ...Platform.select({
    //   ios: {
    //     shadowColor: 'black',
    //     shadowOffset: { width: 3, height: 6 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 9
    //   },
    //   android: {
    //     elevation: 5
    //   }
    // })
  },
  loginButtonText: {
    marginRight: 8,
    color: '#fff',
    fontSize: 15,
    fontStyle: 'italic'
  }
});
