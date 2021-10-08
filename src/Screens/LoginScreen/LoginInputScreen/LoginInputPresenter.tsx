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
  Easing
} from 'react-native';
// import { Text, TextInput } from '../../../components/StyledText';
import CustomCheckBoxContainer from '../../../components/CustomCheckBox';
import LinearGradient from 'react-native-linear-gradient';
import { getT } from '../../../utils/translateManager';
import CustomAlert from '../../../components/CustomAlert';

const logo = require('../../../../assets/assets_2/logos/logo.png');

const user = require('../../../../assets/assets_2/icons/ic_person.png');
const lock = require('../../../../assets/assets_2/icons/ic_lock.png');
const loading = require('../../../../assets/assets_2/icons/loadingIcon.png');

const patternU = require('../../../../assets/assets_2/patterns/bg_pattern_up.png');
const patternD = require('../../../../assets/assets_2/patterns/bg_pattern_down.png');

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
    <LinearGradient
      end={{ x: 0, y: 0 }}
      start={{ x: 0, y: 1 }}
      colors={['#FCFDFF', '#F0F8FF']}
      style={styles.baseView}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={inputFocusOut}
      >
        <View style={{ flex: 0.8 }} />
        <Image source={logo} style={styles.imageView} resizeMode={'center'} />
        <View style={styles.topContainer}>
          <View style={styles.inputSec}>
            <Image source={user} style={styles.icon} />
            <TextInput
              style={styles.inputLogin}
              placeholder={t('login_id')}
              ref={usernameRef}
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
              placeholder={t('login_pw')}
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
          <LinearGradient
            end={{ x: 0, y: 0 }}
            start={{ x: 1, y: 0 }}
            colors={['#3BBFF0', '#1C90FB']}
            style={styles.loginButtonView}
          >
            <TouchableHighlight
              style={styles.loginButtonView}
              onPress={() => loginchk(userId, password)}
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
                <Text style={styles.loginButtonText}>{t('login_login')}</Text>
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
      <CustomAlert
        visible={alertVisible.visible}
        width={320}
        title={alertVisible.title}
        description={alertVisible.description}
        onClose={alertVisible.onClose}
        actions={alertVisible.actions}
      />
    </LinearGradient>
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
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
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
    paddingBottom: 5,
    fontSize: 16,
    color: 'rgb(147,147,147)',
    fontWeight: '200',
    borderBottomColor: 'rgb(230,230,230)',
    borderBottomWidth: 1
  },
  //로그인버튼
  loginButtonView: {
    width: '100%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  loginButtonTouch: {
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
  }
});

export default LoginInputPresenter;
