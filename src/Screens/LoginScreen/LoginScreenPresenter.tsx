import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  // Text,
  // TextInput,
  Platform
} from 'react-native';
import { Text, TextInput } from '../../components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

//mulLug
//다국어 적용 안되어있음

const arrowRight = require('../../../assets/new/icons/ic_arrow_right.png');

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
    logging
  } = props;

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1, minHeight: 700 }}
        keyboardShouldPersistTaps="never"
      >
        <View
          style={[
            styles.verContainer,
            isHorizon && styles.horizonContainer, //세로
            isTablet && isHorizon && styles.horPadContainer, //태블릿 && 세로
            isTablet && !isHorizon && styles.verPadContainer //테블릿 && 가로
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onFocusOutInput}
          >
            {(!isHorizon || isTablet) && <View style={{ flex: 1 }} />}

            <View style={styles.topContainer}>
              <Text style={styles.textHead}>참여코드를 입력해주세요</Text>
              <Text style={styles.textSub1}>공유받은 참여코드 입력 후</Text>
              <Text style={styles.textSub2}>바로 회의에 참여해보세요.</Text>
            </View>
            <View style={{ flex: 0.7 }} />
            <View style={[styles.codeContainer]}>
              <TextInput
                onChangeText={changeInputcode}
                onFocus={onFocusInput}
                value={code}
                style={[styles.none]}
                autoCapitalize="none"
                caretHidden={true}
                maxLength={6}
                editable={code.length === 6 ? false : true}
                customRef={codeLineRef}
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
                Platform.OS === 'ios' && { height: 15 }
              ]}
            >
              {joincodeErr &&
                '대소문자(A~F), 숫자(0~9) 이외의 값은 입력할수 없습니다.'}
              {inputcodeErr &&
                '일치하는 회의가 없습니다. 확인 후 다시 입력해주세요.'}
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
                    WEHAGO 계정으로 로그인
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
  topContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  codeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
    // paddingBottom: 40
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center'
  },
  textHead: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000'
  },
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
