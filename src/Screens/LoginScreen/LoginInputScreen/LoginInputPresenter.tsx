import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Animated,
  ScrollView
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { Text, TextInput } from '../../../components/StyledText';
import CustomCheckBoxContainer from '../../../components/CustomCheckBox';
import LinearGradient from 'react-native-linear-gradient';
import { getT } from '../../../utils/translateManager';
import CustomAlert from '../../../components/CustomAlert';

const logo = require('../../../../assets/new/logos/logo.png');

const user = require('../../../../assets/new/icons/ic_person.png');
const lock = require('../../../../assets/new/icons/ic_lock.png');
const loading = require('../../../../assets/new/icons/loadingIcon.png');

const patternU = require('../../../../assets/new/patterns/bg_pattern_up.png');
const patternD = require('../../../../assets/new/patterns/bg_pattern_down.png');

const LoginInputPresenter = (props: any) => {
  const {
    userId,
    idInput,
    usernameRef,
    password,
    pwInput,
    passwordRef,
    loginchk,
    inputFocusOut,
    loginFailed,
    captchaRef,
    captcha,
    captchaInput,
    logging,
    alertVisible,
    handleChangeCaptcha,
    setCaptchaInput,
    errorMsg,
    t,
    cycleAnimated,
    spin,
    orientation,
    isTablet
  } = props;

  cycleAnimated();

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1, minHeight: 600 }}
      >
        <LinearGradient
          end={{ x: 0, y: 0 }}
          start={{ x: 0, y: 1 }}
          colors={['#FCFDFF', '#F0F8FF']}
          style={[styles.baseView]}
        >
          <TouchableOpacity
            style={[styles.container, orientation && styles.horizonContainer]}
            activeOpacity={1}
            onPress={inputFocusOut}
          >
            {!orientation && <View style={{ flex: 0.8 }} />}
            <Image
              source={logo}
              style={styles.imageView}
              resizeMode={'center'}
            />
            {captcha && (
              <View
                style={[
                  styles.captchaMessageView,
                  orientation && styles.horcaptchaMsgView
                ]}
              >
                <Text style={[styles.captchaMessageText, { marginBottom: 4 }]}>
                  {t('login_exceeded')}
                </Text>
                <Text style={[styles.captchaMessageText, { color: '#ababab' }]}>
                  {t('login_prevent')}
                </Text>
                <Text style={[styles.captchaMessageText, { color: '#ababab' }]}>
                  {t('login_fivetimes')}
                </Text>
              </View>
            )}
            <View style={styles.topContainer}>
              <View
                style={[
                  styles.inputSec,
                  userId && { borderBottomColor: '#36d3fa' },
                  loginFailed && { borderBottomColor: 'red' }
                ]}
              >
                <Image source={user} style={styles.icon} />
                <TextInput
                  style={[styles.inputLogin, isTablet && styles.padInputLogin]}
                  placeholder={t('login_id')}
                  ref={usernameRef}
                  returnKeyType="next"
                  value={userId}
                  onChangeText={idInput}
                  autoCapitalize="none"
                  onSubmitEditing={() => passwordRef.current.focus()}
                />
              </View>
              <View
                style={[
                  styles.inputSec,
                  password && { borderBottomColor: '#36d3fa' },
                  loginFailed && { borderBottomColor: 'red' }
                ]}
              >
                <Image source={lock} style={styles.icon} />
                <TextInput
                  style={[styles.inputLogin, isTablet && styles.padInputLogin]}
                  placeholder={t('login_pw')}
                  secureTextEntry={true}
                  ref={passwordRef}
                  value={password}
                  returnKeyType="go"
                  autoCapitalize="none"
                  onChangeText={pwInput}
                  onSubmitEditing={() => loginchk(userId, password, captcha)}
                />
              </View>
            </View>

            {loginFailed && (
              <Text style={[styles.loginFailedText]}>
                {t('login_incorrect')}
              </Text>
            )}

            {captcha && (
              <View
                style={[
                  styles.captchaMessageView,
                  orientation && styles.horcaptchaMsgView
                ]}
              >
                <Text style={styles.captchaMessageText}>
                  {t('login_input')}
                </Text>
                <View style={styles.captchaAreaView}>
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
                      onPress={handleChangeCaptcha}
                      style={styles.captchaRefresh}
                    >
                      <Text style={{ color: '#ababab' }}>
                        {t('login_refresh')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  ref={captchaRef}
                  value={captchaInput}
                  placeholder={t('login_preventAuto')}
                  placeholderTextColor={'#ccc'}
                  selectionColor={'#505050'}
                  returnKeyType={'next'}
                  keyboardType="default"
                  autoCapitalize="none"
                  onChangeText={text => setCaptchaInput(text)}
                  onSubmitEditing={() => loginchk(userId, password, captcha)}
                  style={[
                    styles.inputField,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: '#d9d9d9'
                    },
                    loginFailed && { borderBottomColor: 'red' }
                  ]}
                />
                {errorMsg && (
                  <Text style={[styles.captchaMessageText, styles.errorMsg]}>
                    {errorMsg}
                  </Text>
                )}
              </View>
            )}
            <View style={styles.bottomContainer}>
              <LinearGradient
                end={{ x: 0, y: 0 }}
                start={{ x: 1, y: 0 }}
                colors={['#3BBFF0', '#1C90FB']}
                style={styles.loginButtonView}
              >
                <TouchableHighlight
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  style={styles.loginButtonTouch}
                  onPress={() => loginchk(userId, password, captcha)}
                >
                  {logging ? (
                    <Animated.View
                      style={{
                        ...styles.loadingAnimation,
                        transform: [{ rotate: spin }]
                      }}
                    >
                      <Image source={loading} style={styles.loadingIcon} />
                    </Animated.View>
                  ) : (
                    <Text style={styles.loginButtonText}>
                      {t('login_login')}
                    </Text>
                  )}
                </TouchableHighlight>
              </LinearGradient>

              <CustomCheckBoxContainer text="아이디 저장" color="#e6e6e6" />
            </View>
            <View style={{ flex: 1.2 }}></View>
            <View style={styles.copyrightView}>
              <Text style={styles.copyrightText}>
                CopyRight{'\u00A9'} DOUZONE BIZONE. All rights reserved.
              </Text>
            </View>
          </TouchableOpacity>
          <Image source={patternD} style={styles.bottomImg} />
          <Image source={patternU} style={styles.topImg} />
          <CustomAlert
            visible={alertVisible.visible}
            width={320}
            title={alertVisible.title}
            description={alertVisible.description}
            onClose={alertVisible.onClose}
            actions={alertVisible.actions}
          />
        </LinearGradient>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  baseView: {
    flex: 1,
    backgroundColor: 'rgb(240,248,255)',
    position: 'relative',
    height: 600
  },
  container: {
    paddingLeft: '8%',
    paddingRight: '8%',
    zIndex: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
    // backgroundColor:'red',
  },
  horizonContainer: {
    paddingLeft: '33%',
    paddingRight: '33%'
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
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  captchaMessageView: {
    // width: 320,
    marginVertical: 20,
    alignSelf: 'flex-start'
  },
  horcaptchaMsgView: {
    alignSelf: 'center'
  },
  captchaMessageText: {
    fontSize: 10,
    color: '#505050'
  },
  captchaAreaView: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 6
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
  captchaRefresh: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  //아이디, 비밀번호 입력
  inputSec: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderBottomColor: 'rgb(230,230,230)',
    borderBottomWidth: 1
  },
  icon: {
    resizeMode: 'center',
    left: -20,
    paddingBottom: 10,
    bottom: -20,
    position: 'absolute'
  },
  inputLogin: {
    flex: 1,
    paddingLeft: '12%',
    paddingVertical: 3,
    fontSize: 16,
    fontWeight: '200',
    color: 'black'
  },
  padInputLogin: {
    paddingLeft: '10%',
  },
  loginFailedText: {
    color: 'red',
    fontSize: 11,
    top: '-3%',
    alignSelf: 'flex-start'
  },
  //로그인버튼
  loginButtonView: {
    width: '100%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    // alignItems: 'center',
    marginVertical: 10,
    marginBottom: 17
  },
  loginButtonTouch: {
    width: '100%',
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16
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
  },
  loadingAnimation: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomImg: {
    position: 'absolute',
    left: 0,
    bottom: '9%',
    resizeMode: 'center',
    width: 260,
    height: 82
  },
  topImg: {
    position: 'absolute',
    width: 240,
    height: 240,
    right: 0,
    top: 0,
    resizeMode: 'center'
  },
  refresh: {
    marginLeft: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center'
  },
  inputField: {
    paddingVertical: 8,
    // width: '100%',
    color: '#333',
    fontSize: 15
  },
  errorMsg: {
    color: 'red'
  }
});

export default LoginInputPresenter;
