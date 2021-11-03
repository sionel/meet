import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  TextInput,
  Platform
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

//mulLug
//다국어 적용 안되어있음

// const arrowRight = require('../../../assets/new/icons/ic_arrow_right.png');

const LoginScreenPresenter = (props: any) => {
  const {
    code,
    onFocusingCode,
    changeInputcode,
    onFocusInput,
    onFocusOutInput,
    codeLineRef,
    LoginForWehago,
    joincodeErr,
    inputcodeErr,
    isHorizon,
    isTablet,
    t,
    logging,goLoginInput
  } = props;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          minHeight: isHorizon && !isTablet ? 350 : 700
        }}
        keyboardShouldPersistTaps="never"
      >
        <View
          style={[
            styles.verContainer,
            isHorizon && styles.horizonContainer, //가로
            isTablet && isHorizon && styles.horPadContainer, //태블릿 && 가로
            isTablet && !isHorizon && styles.verPadContainer //테블릿 && 세로
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onFocusOutInput}
          >
            <View style={{ flex: 1 }} />

            <View style={styles.topContainer}>
              <Text style={styles.textHead}>{t('renewal.login_code')}</Text>
              <Text style={styles.textSub1}>
                {t('renewal.login_codemessage1')}
              </Text>
              <Text style={styles.textSub2}>
                {t('renewal.login_codemessage2')}
              </Text>
            </View>
            <View style={{ flex: 0.7 }} />
            <View style={styles.codeContainer}>
              <TextInput
                onChangeText={changeInputcode}
                onFocus={onFocusInput}
                value={code}
                style={styles.none}
                autoCapitalize="none"
                caretHidden={true}
                maxLength={6}
                editable={code.length === 6 ? false : true}
                ref={codeLineRef}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 1 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(0, 1)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 2 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(1, 2)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 3 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(2, 3)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 4 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(3, 4)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 5 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(4, 5)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 6 && styles.inputAccent,
                  logging && styles.inputLogging
                ]}
                value={code.slice(5, 6)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
            </View>

            <Text
              style={[
                styles.ErrorText,
                Platform.OS === 'ios' && { height: 15 },
                isHorizon && !isTablet && { top: '-4%' }
              ]}
            >
              {joincodeErr && t('renewal.text_incorrect_code_error')}
              {inputcodeErr && t('renewal.text_nomatch_conference_error')}
            </Text>

            <View
              style={[
                styles.bottomContainer,
                isTablet && { justifyContent: 'center' }
              ]}
            >
              <LinearGradient
                end={{ x: 0, y: 0.5 }}
                start={{ x: 1, y: 0.5 }}
                colors={['#3BBFF0', '#1C90FB']}
                style={styles.loginBtnGradation}
              >
                <TouchableHighlight
                  activeOpacity={0.7}
                  underlayColor={'transparent'}
                  style={styles.loginBtnTouch}
                  onPress={LoginForWehago}
                >
                  <Text style={styles.loginBtnText}>
                    {t('renewal.login_wehagologin')}
                  </Text>
                </TouchableHighlight>
              </LinearGradient>
            </View>
            <View style={{ flex: 1 }} />
            <View style={{ flex: 0.5 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  //화면 방향에 따른 패딩
  verContainer: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingLeft: '8%',
    paddingRight: '8%'
  },
  horizonContainer: {
    paddingLeft: '28%',
    paddingRight: '28%'
  },
  horPadContainer: {
    paddingLeft: '33%',
    paddingRight: '33%'
  },
  verPadContainer: {
    paddingLeft: '25%',
    paddingRight: '25%'
  },
  //전체 레이아웃 컨테이너
  topContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  codeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center'
  },
  //코드 입력 안내문
  textHead: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000'
  },
  // padTextHead: {
  //   fontSize: 28
  // },
  textSub1: {
    paddingTop: 15,
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: 'rgb(147,147,147)'
  },
  textSub2: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: 'rgb(147,147,147)'
  },
  // padTextSub: {
  //   fontSize: 22
  // },
  //코드입력
  inputNumber: {
    backgroundColor: '#fff',
    width: 44,
    height: 54,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: 8,
    borderColor: '#e6e6e6',
    color: '#000',
    zIndex: 999
  },
  inputAccent: {
    borderColor: '#333333',
    borderWidth: 1
  },
  inputLogging: {
    borderColor: 'rgb(221,221,221)',
    color: 'rgb(221,221,221)'
  },
  //로그인버튼
  loginBtnGradation: {
    width: '95%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
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
  // loginNaviView: {
  //   flexDirection: 'row'
  // },
  // loginNavigation: {
  //   color: '#333333',
  //   fontSize: 13,
  //   lineHeight: Platform.OS === 'ios' ? 18 : 16.5
  // },
  // arrowImage: {
  //   width: 18,
  //   height: 18
  // },
  none: {
    position: 'absolute',
    bottom: 95,
    width: '100%',
    zIndex: 10,
    color: 'rgba(0,0,0,0)',
    fontSize: 1
  },
  ErrorText: {
    color: 'red',
    top: '-9%',
    fontSize: 13
  }
});

export default LoginScreenPresenter;
