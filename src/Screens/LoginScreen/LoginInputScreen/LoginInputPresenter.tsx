import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, TextInput } from '../../../components/StyledText';
import {CustomCheckBoxContainer as CheckBox} from '../../../components/CustomCheckBox';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../../../components/CustomAlert';
import { reduceRight } from '../../../../webpack.config';

const loginLogo = require('../../../../assets/new/logos/logo.png');

const user = require('../../../../assets/new/icons/ic_person.png');
const lock = require('../../../../assets/new/icons/ic_lock.png');
const loading = require('../../../../assets/new/icons/loadingIcon.png');

const patternTop = require('../../../../assets/new/patterns/bg_pattern_up.png');
const patternBot = require('../../../../assets/new/patterns/bg_pattern_down.png');

const cancel = require('../../../../assets/new/icons/ic_cancel_fill.png');

const LoginInputPresenter = (props: any) => {
  const {
    userId,
    onChangeId,
    usernameRef,
    password,
    onChangePw,
    passwordRef,
    loginchk,
    inputFocusOut,
    loginFailed,
    logging,
    alertVisible,
    captcha,
    captchaInput,
    captchaRef,
    setCaptchaInput,
    errorMsg,
    handleChangeCaptcha,
    t,
    cycleAnimated,
    spin,
    isHorizon,
    isTablet,
    clearId,
    onCheck,
    check,
  } = props;

  cycleAnimated();

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: isHorizon && !isTablet ? (captcha ? 590 : 375) : 750
        }}
        keyboardShouldPersistTaps="never"
      >
        <LinearGradient
          end={{ x: 0, y: 0 }}
          start={{ x: 0, y: 1 }}
          colors={['#FCFDFF', '#F0F8FF']}
          style={[
            styles.container,
            isHorizon && styles.horizonContainer,
            !isHorizon && isTablet && styles.verticalPadContainer
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1, zIndex: 3}}
            activeOpacity={1}
            onPress={inputFocusOut}
          >
            {(!isHorizon || isTablet) && <View style={{ flex: 1.4 }} />}
            <Image
              source={loginLogo}
              style={styles.imageContainer}
              resizeMode={'center'}
            />
            {captcha && (
              <View style={[styles.captchaMessageContainer]}>
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
                  styles.inputContainer,
                  userId && { borderBottomColor: '#36d3fa' },
                  loginFailed && { borderBottomColor: 'red' }
                ]}
              >
                <Image source={user} style={styles.loginicon} />
                <TextInput
                  style={[
                    styles.inputLoginText,
                    isTablet && styles.padInputLoginText
                  ]}
                  placeholder={t('login_id')}
                  placeholderTextColor={'rgb(147,147,147)'}
                  customRef={usernameRef}
                  value={userId}
                  returnKeyType="next"
                  autoCapitalize="none"
                  onChangeText={onChangeId}
                  onSubmitEditing={() => passwordRef.current.focus()}
                />
                {userId !== '' && (
                  <TouchableOpacity
                    onPress={clearId}
                    style={{
                      right: -10,
                      bottom: -15,
                      position: 'absolute'
                    }}
                  >
                    <Image source={cancel} style={styles.cancelIcon} />
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={[
                  styles.inputContainer,
                  password && { borderBottomColor: '#36d3fa' },
                  loginFailed && { borderBottomColor: 'red' }
                ]}
              >
                <Image source={lock} style={styles.loginicon} />
                <TextInput
                  style={[
                    styles.inputLoginText,
                    isTablet && styles.padInputLoginText
                  ]}
                  placeholder={t('login_pw')}
                  placeholderTextColor={'rgb(147,147,147)'}
                  secureTextEntry={true}
                  customRef={passwordRef}
                  value={password}
                  returnKeyType="go"
                  autoCapitalize="none"
                  onChangeText={onChangePw}
                  onSubmitEditing={() => loginchk(userId, password, captcha)}
                />
              </View>
            </View>
            <View />

            {loginFailed && (
              <Text
                style={[
                  styles.loginFailedText,
                  isHorizon && !isTablet && { top: 0 }
                ]}
              >
                {t('login_incorrect')}
              </Text>
            )}

            {captcha && (
              <View style={[styles.captchaMessageContainer]}>
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
                  customRef={captchaRef}
                  value={captchaInput}
                  placeholder={t('login_preventAuto')}
                  placeholderTextColor={'rgb(147,147,147)'}
                  selectionColor={'#505050'}
                  returnKeyType={'next'}
                  keyboardType="default"
                  autoCapitalize="none"
                  onChangeText={(text: string) => setCaptchaInput(text)}
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
                style={styles.loginBtnGradation}
              >
                <TouchableHighlight
                  activeOpacity={0.8}
                  underlayColor={'transparent'}
                  style={styles.loginBtnTouch}
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
                    <Text style={styles.loginBtnText}>{t('login_login')}</Text>
                  )}
                </TouchableHighlight>
              </LinearGradient>

              <CheckBox text="아이디 저장" color="#e6e6e6" onCheck={onCheck} checked={check}/>
            </View>
            <View style={{ flex: 1.2 }}></View>
            <View style={styles.copyrightContainer}>
              <Text style={styles.copyrightText}>
                CopyRight{'\u00A9'} DOUZONE BIZONE. All rights reserved.
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.topImgView}>
            <Image
              source={patternTop}
              style={[
                styles.topImg,
                isTablet && { width: 350, height: 350 }
              ]}
            />
          </View>
          <View style={[styles.bottomImgView]}>
            <Image
              source={patternBot}
              style={[
                styles.bottomImg,
                isTablet && { width: 390, height: 123 }
              ]}
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
        </LinearGradient>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  //화면 방향에 따른 패딩
  container: {
    position: 'relative',
    flex: 1,
    paddingLeft: '8%',
    paddingRight: '8%',
    justifyContent: 'space-between'
  },
  horizonContainer: {
    paddingLeft: '28%',
    paddingRight: '28%'
  },
  verticalPadContainer: {
    paddingLeft: '25%',
    paddingRight: '25%'
  },
  //전체 레이아웃 컨테이너
  imageContainer: {
    flex: 0.5,
    alignSelf: 'center'
  },
  topContainer: {
    zIndex: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  bottomContainer: {
    flex: 1,
    marginTop: '8%',
    alignItems: 'center'
  },
  //캡챠 스타일
  captchaMessageContainer: {
    paddingVertical: 10,
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
  inputContainer: {
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
  cancelIcon: {
    resizeMode: 'center'
  },
  inputLoginText: {
    flex: 1,
    paddingLeft: '10%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 16,
    fontWeight: '200',
    color: 'black'
  },
  padInputLoginText: {
    paddingLeft: '9%'
  },
  loginFailedText: {
    color: 'red',
    fontSize: 11,
    top: '-2%',
    alignSelf: 'flex-start'
  },
  //로그인버튼
  loginBtnGradation: {
    width: '100%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 17
  },
  loginBtnTouch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16
  },
  //저작권
  copyrightContainer: {
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
  topImgView: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
  topImg: {
    resizeMode: 'contain',
    width: 240,
    height: 240
  },
  bottomImgView: {
    position: 'absolute',
    left: 0,
    bottom: '10%',
    zIndex: 2,
  },
  bottomImg: {
    resizeMode: 'contain',
    width: 260,
    height: 82
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
