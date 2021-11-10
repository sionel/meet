import React, { Fragment } from 'react';
import {
  Image,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  SafeAreaView,
  Text,
  TextInput,
  Platform
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomCheckBox from '../../../components/renewal/CustomCheckBox';
import LinearGradient from 'react-native-linear-gradient';
import CustomAlert from '../../../components/CustomAlert';
import { reduceRight } from '../../../../webpack.config';

const loginLogo = require('../../../../assets/new/logos/logo.png');

const user = require('../../../../assets/new/icons/ic_person.png');
const lock = require('../../../../assets/new/icons/ic_lock_black.png');
const loading = require('../../../../assets/new/icons/loadingIcon.png');

const patternTop = require('../../../../assets/new/patterns/login_pattern_top.png');
const patternBot = require('../../../../assets/new/patterns/login_pattern_bottom.png');

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
    spin,
    isHorizon,
    isTablet,
    clearId,
    onCheck,
    check
  } = props;

  return (
    <Fragment>
      <LinearGradient
        end={{ x: 0, y: 0 }}
        start={{ x: 0, y: 1 }}
        colors={['#FCFDFF', '#F0F8FF']}
        style={{ position:'absolute' , width:'100%' ,height:'100%'}}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
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
                style={{ flex: 1, zIndex: 3 }}
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
                    <Text
                      style={[styles.captchaMessageText, { marginBottom: 4 }]}
                    >
                      {t('renewal.login_exceeded')}
                    </Text>
                    <Text
                      style={[styles.captchaMessageText, { color: '#ababab' }]}
                    >
                      {t('renewal.login_prevent')}
                    </Text>
                    <Text
                      style={[styles.captchaMessageText, { color: '#ababab' }]}
                    >
                      {t('renewal.login_fivetimes')}
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
                      style={styles.inputLoginText}
                      placeholder={t('renewal.login_id')}
                      placeholderTextColor={'rgb(147,147,147)'}
                      ref={usernameRef}
                      value={userId}
                      returnKeyType="next"
                      autoCapitalize="none"
                      onChangeText={onChangeId}
                      onSubmitEditing={() => passwordRef.current.focus()}
                    />
                    {userId !== '' && (
                      <TouchableOpacity
                        onPress={clearId}
                        style={styles.idClearView}
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
                      style={styles.inputLoginText}
                      placeholder={t('renewal.login_pw')}
                      placeholderTextColor={'rgb(147,147,147)'}
                      secureTextEntry={true}
                      ref={passwordRef}
                      value={password}
                      returnKeyType="go"
                      autoCapitalize="none"
                      onChangeText={onChangePw}
                      onSubmitEditing={() =>
                        loginchk(userId, password, captcha)
                      }
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
                    {t('renewal.login_incorrect')}
                  </Text>
                )}

                {captcha && (
                  <View style={[styles.captchaMessageContainer]}>
                    <Text style={styles.captchaMessageText}>
                      {t('renewal.login_input')}
                    </Text>
                    <View style={styles.captchaAreaView}>
                      <View style={styles.captchaArea}>
                        <Text
                          style={[
                            styles.captchaMessageText,
                            styles.captchaText
                          ]}
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
                            {t('renewal.login_refresh')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TextInput
                      ref={captchaRef}
                      value={captchaInput}
                      placeholder={t('renewal.login_preventAuto')}
                      placeholderTextColor={'rgb(147,147,147)'}
                      selectionColor={'#505050'}
                      returnKeyType={'next'}
                      keyboardType="default"
                      autoCapitalize="none"
                      onChangeText={(text: string) => setCaptchaInput(text)}
                      onSubmitEditing={() =>
                        loginchk(userId, password, captcha)
                      }
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
                      <Text
                        style={[styles.captchaMessageText, styles.errorMsg]}
                      >
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
                      underlayColor={'rgba(0,0,0,0.2)'}
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
                        <Text style={styles.loginBtnText}>
                          {t('renewal.login_login')}
                        </Text>
                      )}
                    </TouchableHighlight>
                  </LinearGradient>

                  <CustomCheckBox
                    text={t('renewal.login_auto')}
                    color="#e6e6e6"
                    onCheck={onCheck}
                    checked={check}
                  />
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
                  style={isTablet ? styles.topPadImg : styles.topImg}
                />
              </View>
              <View style={[styles.bottomImgView]}>
                <Image
                  source={patternBot}
                  style={isTablet ? styles.botPadImg : styles.bottomImg}
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
      </SafeAreaView>
    </Fragment>
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
    resizeMode: 'contain',
    width: 24,
    height: 24
  },
  cancelIcon: {
    resizeMode: 'center'
  },
  inputLoginText: {
    flex: 1,
    paddingHorizontal: '4%',
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 16,
    fontWeight: '200',
    color: 'black'
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
    zIndex: 1
  },
  topImg: {
    resizeMode: 'contain',
    width: 240,
    height: 240
  },
  topPadImg: {
    resizeMode: 'contain',
    width: 350,
    height: 350
  },
  bottomImgView: {
    position: 'absolute',
    left: 0,
    bottom: '10%',
    zIndex: 2
  },
  bottomImg: {
    resizeMode: 'contain',
    width: 260,
    height: 82
  },
  botPadImg: { width: 390, height: 123 },
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
  },
  idClearView: {
    right: -10,
    bottom: -15,
    position: 'absolute'
  }
});

export default LoginInputPresenter;
