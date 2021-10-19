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
  ScrollView,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { Text, TextInput } from '../../../components/StyledText';
import CustomCheckBoxContainer from '../../../components/CustomCheckBox';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../../../components/CustomAlert';

const logo = require('../../../../assets/new/logos/logo.png');

const user = require('../../../../assets/new/icons/ic_person.png');
const lock = require('../../../../assets/new/icons/ic_lock.png');
const loading = require('../../../../assets/new/icons/loadingIcon.png');

const patternU = require('../../../../assets/new/patterns/bg_pattern_up.png');
const patternD = require('../../../../assets/new/patterns/bg_pattern_down.png');

const cancel = require('../../../../assets/new/icons/ic_cancel_fill.png');

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
    isHorizon,
    isTablet,
    clearId
  } = props;

  cycleAnimated();

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1, minHeight: 750 }}
        keyboardShouldPersistTaps="never"
      >
        <LinearGradient
          end={{ x: 0, y: 0 }}
          start={{ x: 0, y: 1 }}
          colors={['#FCFDFF', '#F0F8FF']}
          style={[
            styles.container, 
            isHorizon && styles.horizonContainer,
            !isHorizon && isTablet && styles.verPadContainer,
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={inputFocusOut}
          >
            {(!isHorizon || isTablet) && (<View style={{ flex: 1.4 }} />)}
            <Image
              source={logo}
              style={styles.imageView}
              resizeMode={'center'}
            />
            {captcha && (
              <View
                style={[
                  styles.captchaMessageView,
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
                <Image source={user} style={styles.loginicon} />
                <TextInput
                  style={[styles.inputLogin, isTablet && styles.padInputLogin]}
                  placeholder={t('login_id')}
                  placeholderTextColor={'rgb(147,147,147)'}
                  ref={usernameRef}
                  returnKeyType="next"
                  value={userId}
                  onChangeText={idInput}
                  autoCapitalize="none"
                  onSubmitEditing={() => passwordRef.current.focus()}
                />
                {(userId || loginFailed) && (
                  <TouchableOpacity
                    onPress={clearId}
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Image source={cancel} style={styles.cancelicon} />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  styles.inputSec,
                  password && { borderBottomColor: '#36d3fa' },
                  loginFailed && { borderBottomColor: 'red' }
                ]}
              >
                <Image source={lock} style={styles.loginicon} />
                <TextInput
                  style={[styles.inputLogin, isTablet && styles.padInputLogin]}
                  placeholder={t('login_pw')}
                  placeholderTextColor={'rgb(147,147,147)'}
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
            <View />

            {loginFailed && (
              <Text style={[styles.loginFailedText]}>
                {t('login_incorrect')}
              </Text>
            )}

            {captcha && (
              <View
                style={[
                  styles.captchaMessageView,
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
                  placeholderTextColor={'rgb(147,147,147)'}
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
  container: {
    flex: 1,
    paddingLeft: '8%',
    paddingRight: '8%',
    justifyContent: 'space-between'
  },
  horizonContainer: {
    paddingLeft: '28%',
    paddingRight: '28%'
  },
  verPadContainer: {
    paddingLeft: '25%',
    paddingRight: '25%'
  },
  imageView: {
    flex: 0.5,
    alignSelf: 'center'
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomContainer: {
    flex: 1,
    marginTop: '8%',
    alignItems: 'center'
  },
  captchaMessageView: {
    alignSelf: 'flex-start'
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
  loginicon: {
    resizeMode: 'center',
    left: -20,
    bottom: -15,
    position: 'absolute'
  },
  cancelicon: {
    resizeMode: 'center',
    right: -20,
    bottom: -25,
    position: 'absolute'
  },
  inputLogin: {
    flex: 1,
    paddingLeft: '10%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 16,
    fontWeight: '200',
    color: 'black'
  },
  padInputLogin: {
    paddingLeft: '9%'
  },
  loginFailedText: {
    color: 'red',
    fontSize: 11,
    top: '-2%',
    alignSelf: 'flex-start'
  },
  //로그인버튼
  loginButtonView: {
    width: '100%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 10,
    marginBottom: 17
  },
  loginButtonTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16
  },
  //저작권
  copyrightView: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
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
    height: 82,
    zIndex: 999
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
    color: '#333',
    fontSize: 15
  },
  errorMsg: {
    color: 'red'
  }
});

export default LoginInputPresenter;
