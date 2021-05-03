import * as React from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Easing,
  Dimensions
} from 'react-native';

import { Text, TextInput } from '../../../components/StyledText';
import CustomIcon from '../../../components/CustomIcon';
import CustomAlert from '../../../components/CustomAlert';
import { getT } from '../../../utils/translateManager';

let LinearGradient = View;

// 동글동글한 하단 이미지
const { width, height } = Dimensions.get('screen');
const bottomImage = require('../../../../assets/img_login.png');
const bottomImageWidth = 750;
const bottomImageHeight = 450;
let scale = 1; // 이미지 크기 비율
if (bottomImageWidth > width) scale = width / bottomImageWidth;
if (bottomImageHeight > height) scale = height / bottomImageWidth;
else if (width < height) scale = width / bottomImageWidth;
else if (width > height) scale = height / bottomImageWidth;

export default function LoginInputPresenter(props) {
  const {
    iswehagov,
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
    logging,
    alertVisible
  } = props;
  const t = getT();
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior="height"
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
          <>
            <CustomIcon
              name={iswehagov ? 'WEHAGO_V_BI' : 'WEHAGO_BI'}
              width={224}
              height={42}
              style={{ marginTop: 0 }}
            />

            <View style={{ marginTop: captcha ? 35 : 116 }}>
              {captcha && (
                <View style={styles.captchaMessageView}>
                  <Text
                    style={[styles.captchaMessageText, { marginBottom: 4 }]}
                  >
                    {t('login.exceeded')}
                  </Text>
                  <Text
                    style={[styles.captchaMessageText, { color: '#ababab' }]}
                  >
                    {t('login.prevent')}
                  </Text>
                  <Text
                    style={[styles.captchaMessageText, { color: '#ababab' }]}
                  >
                    {t('login.fivetimes')}
                  </Text>
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
                  customRef={usernameRef}
                  value={userId}
                  textContentType={'username'}
                  placeholder={t('login.id')}
                  placeholderTextColor={'#ccc'}
                  selectionColor={'#505050'}
                  returnKeyType={'next'}
                  keyboardType="default"
                  autoCapitalize="none"
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
                      size={24}
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
                  customRef={passwordRef}
                  secureTextEntry={true}
                  value={userPw}
                  textContentType={'password'}
                  placeholder={t('login.pw')}
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
                      size={24}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {loginFailed && (
                <Text style={styles.loginFailedText}>{t('login.incorrect')}</Text>
              )}

              {captcha && (
                <View style={styles.captchaMessageView}>
                  <Text style={styles.captchaMessageText}>
                    {t('login.input')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      marginTop: 6
                    }}
                  >
                    <LinearGradient style={styles.captchaArea}>
                      <Text
                        style={[styles.captchaMessageText, styles.captchaText]}
                      >
                        {captcha}
                      </Text>
                    </LinearGradient>
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
                        <CustomIcon name={'btn_reload_none'} size={15} />
                        <Text style={{ color: '#ababab' }}>
                          {t('login.refresh')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TextInput
                    customRef={captchaRef}
                    value={captchaInput}
                    placeholder={t('login.preventAuto')}
                    placeholderTextColor={'#ccc'}
                    selectionColor={'#505050'}
                    returnKeyType={'next'}
                    keyboardType="default"
                    autoCapitalize="none"
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
              <LinearGradient
                style={[
                  styles.loginButtonGradient,
                  { marginBottom: captcha ? 70 : 150 }
                ]}
              >
                <TouchableHighlight
                  activeOpacity={0.6}
                  disabled={logging}
                  style={styles.loginButton}
                  underlayColor={'#197cdc66'}
                  onPress={() => {
                    _handleLogin(userId, userPw, captcha);
                  }}
                >
                  <>
                    {logging ? (
                      <Animated.View
                        style={{
                          transform: [{ rotate: spin }],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <CustomIcon name={'loadIcon'} size={20} />
                      </Animated.View>
                    ) : (
                      <Text style={styles.loginButtonText}>
                        {t('login.login')}
                      </Text>
                    )}
                  </>
                </TouchableHighlight>
              </LinearGradient>
            </View>
          </>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center'
        }}
      >
        <Image
          source={bottomImage}
          style={{
            width: bottomImageWidth * scale,
            height: bottomImageHeight * scale
          }}
        />
      </View>

      <CustomAlert
        visible={alertVisible.visible}
        width={320}
        title={alertVisible.title}
        description={alertVisible.description}
        onClose={alertVisible.onClose}
        actions={alertVisible.actions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff'
  },
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
  captchaMessageView: {
    width: 320,
    marginVertical: 20
  },
  captchaMessageText: {
    fontSize: 10,
    color: '#505050'
  },
  captchaArea: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc'
  },
  captchaText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
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
    fontSize: 15
  },
  loginFailedText: {
    color: 'red',
    fontSize: 10
  },
  buttonContainer: {
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
    marginVertical: 10
  },
  loginButton: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#1d94fc'
  },
  loginButtonText: {
    marginRight: 8,
    color: '#fff',
    fontSize: 15
  }
});
