import React, { RefObject } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const icBack = require('@assets/icons/ic_back.png');

//mulLug
//다국어 적용 안되어있음
interface PresenterProps {
  code: string;
  shadowCode: string;
  focusingNum: number;
  onFocusingCode: () => void;
  onFocusInput: () => void;
  onFocusOutInput: () => void;
  handleClickBack: () => void;
  changeInputcode: (text: string) => Promise<void>;
  joincodeErr: boolean;
  inputcodeErr: boolean;
  isHorizon: boolean;
  isTablet: boolean;
  logging: boolean;
  codeLineRef: RefObject<any>;
  t: any;
}

const InvitedCodeScreenPresenter = (props: PresenterProps) => {
  const {
    code,
    focusingNum,
    onFocusingCode,
    changeInputcode,
    onFocusInput,
    onFocusOutInput,
    codeLineRef,
    joincodeErr,
    inputcodeErr,
    isHorizon,
    isTablet,
    t,
    logging,
    shadowCode,
    handleClickBack
  } = props;

  return (
    <SafeAreaView style={styles.LoginSafeAreaView}>
      <StatusBar barStyle={'dark-content'} />
      <KeyboardAwareScrollView
        contentContainerStyle={{ flex: 1 }}
        onKeyboardDidHide={onFocusOutInput}
        bounces={false}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraHeight={120}
      >
        {/* <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: isHorizon && !isTablet ? 350 : 700
          }}
          keyboardShouldPersistTaps="never"
          bounces={false}
        > */}
        <View style={styles.topTitle}>
          <TouchableOpacity onPress={handleClickBack}>
            <Image
              source={icBack}
              style={{ width: 24, height: 24 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
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
                  logging && styles.inputLogging,
                  focusingNum === 0 && styles.focusAccent
                ]}
                value={code ? code.slice(0, 1) : shadowCode.slice(0, 1)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 2 && styles.inputAccent,
                  logging && styles.inputLogging,
                  focusingNum === 1 && styles.focusAccent
                ]}
                value={code ? code.slice(1, 2) : shadowCode.slice(1, 2)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 3 && styles.inputAccent,
                  logging && styles.inputLogging,
                  focusingNum === 2 && styles.focusAccent
                ]}
                value={code ? code.slice(2, 3) : shadowCode.slice(2, 3)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 4 && styles.inputAccent,
                  logging && styles.inputLogging,
                  focusingNum === 3 && styles.focusAccent
                ]}
                value={code ? code.slice(3, 4) : shadowCode.slice(3, 4)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 5 && styles.inputAccent,
                  logging && styles.inputLogging,
                  focusingNum === 4 && styles.focusAccent
                ]}
                value={code ? code.slice(4, 5) : shadowCode.slice(4, 5)}
                maxLength={1}
                caretHidden={true}
                onFocus={onFocusingCode}
              />
              <TextInput
                style={[
                  styles.inputNumber,
                  code.length >= 6 && styles.inputAccent,
                  logging && styles.inputLogging,
                  focusingNum === 5 && styles.focusAccent
                ]}
                value={code ? code.slice(5, 6) : shadowCode.slice(5, 6)}
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
            <View style={{ flex: 1 }} />
            <View style={{ flex: 0.5 }} />
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  LoginSafeAreaView: {
    flex: 1,
    backgroundColor: '#fff'
  },
  //화면 방향에 따른 패딩
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff'
  },
  verContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    justifyContent: 'space-between',
    // backgroundColor:'red',
    paddingHorizontal: 10
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center'
  },
  //코드 입력 안내문
  textHead: {
    fontSize: 20,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: '#000'
  },
  // padTextHead: {
  //   fontSize: 28
  // },
  textSub1: {
    paddingTop: 15,
    fontSize: 16,
    fontFamily: 'DOUZONEText30',
    textAlign: 'center',
    color: 'rgb(147,147,147)'
  },
  textSub2: {
    fontSize: 16,
    fontFamily: 'DOUZONEText30',
    textAlign: 'center',
    color: 'rgb(147,147,147)'
  },
  // padTextSub: {
  //   fontSize: 22
  // },
  //코드입력
  inputNumber: {
    backgroundColor: '#fff',
    width: 34,
    height: 54,
    fontSize: 30,
    textAlign: 'center',
    // borderRadius: 8,
    borderColor: '#e6e6e6',
    color: '#000',
    zIndex: 999,
    padding: 0,
    borderBottomWidth: 4,
    fontFamily: 'DOUZONEText50'
  },
  focusAccent: {
    borderColor: '#0033ff',
    borderBottomWidth: 4
  },
  inputAccent: {
    borderColor: '#333333',
    borderBottomWidth: 4
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
    fontSize: 16,
    fontFamily: 'DOUZONEText30'
  },
  none: {
    position: 'absolute',
    bottom: -30,
    width: '100%',
    zIndex: 10,
    color: 'rgba(0,0,0,0)',
    fontSize: 1
  },
  ErrorText: {
    color: 'red',
    top: '-9%',
    fontSize: 13,
    fontFamily: 'DOUZONEText30',
    left: 10
  }
});

export default InvitedCodeScreenPresenter;
