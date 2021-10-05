import React from 'react';
// import type {Node} from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Image
} from 'react-native';
import { Text, TextInput } from '../../components/StyledText';
import LinearGradient from 'react-native-linear-gradient';

const arrowRight = require('../../../../assets_2/icons/ic_arrow_right.png');

const LoginScreenPresenter = (props: any) => {
  const { code, codeInput, codeLineRef, codeFocus, goLoginD } = props;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <View style={styles.topContainer}>
        <Text style={styles.textHead}>참여코드를 입력해주세요.</Text>
        <Text style={styles.textSub1}>공유받은 참여코드 입력 후</Text>
        <Text style={styles.textSub2}>바로 회의에 참여해보세요.</Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={styles.codeView}>
        <TextInput
          style={{ display: 'none' }}
          onChangeText={codeInput}
          value={code}
          autoCapitalize="none"
          maxLength={6}
          editable={code.length === 6 ? false : true}
          customRef={codeLineRef}
        />
        <TextInput
          style={styles.inputNumber}
          value={code.slice(0, 1)}
          maxLength={1}
          caretHidden={true}
          onFocus={codeFocus}
        />
        <TextInput
          style={styles.inputNumber}
          maxLength={1}
          value={code.slice(1, 2)}
          caretHidden={true}
          onFocus={codeFocus}
        />
        <TextInput
          style={styles.inputNumber}
          value={code.slice(2, 3)}
          maxLength={1}
          caretHidden={true}
          onFocus={codeFocus}
        />
        <TextInput
          style={styles.inputNumber}
          value={code.slice(3, 4)}
          maxLength={1}
          caretHidden={true}
          onFocus={codeFocus}
        />
        <TextInput
          style={styles.inputNumber}
          value={code.slice(4, 5)}
          maxLength={1}
          caretHidden={true}
          onFocus={codeFocus}
        />
        <TextInput
          style={styles.inputNumber}
          value={code.slice(5, 6)}
          maxLength={1}
          caretHidden={true}
          onFocus={codeFocus}
        />
      </View>
      <View style={styles.bottomContainer}>
        <LinearGradient
          end={{ x: 0, y: 0.5 }}
          start={{ x: 1, y: 0.5 }}
          colors={['#56ccf2', '#2f80ed']}
          style={styles.loginButtonView}
        >
          <TouchableHighlight style={styles.loginButtonView}>
            <Text style={styles.loginButtonText}>WEHAGO 계정으로 로그인</Text>
          </TouchableHighlight>
        </LinearGradient>
        <TouchableOpacity activeOpacity={1} onPress={goLoginD}>
          <Text style={styles.loginNavigation}>직접 입력하여 로그인</Text>
          <Image source={arrowRight} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ flex: 1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingLeft: '8%',
    paddingRight: '8%'
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  codeView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textHead: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000'
    // fontFamily:'DOUZONEText50'
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
  loginButtonView: {
    width: '95%',
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  loginButtonTouch: {
    flex: 1,
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16
  },
  loginNavigation: {
    color: '#333333',
    fontSize: 13
  }
});

export default LoginScreenPresenter;
