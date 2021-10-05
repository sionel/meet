import React from 'react';
// import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';

const LoginScreenPresenter = (props: any) => {
  const {code, codeInput, codeLineRef, codeFocus, goLoginD} = props;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f2f2f2'}}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.textHead}>참여코드를 입력해주세요.</Text>
          <Text style={styles.textSub1}>공유받은 참여코드 입력 후</Text>
          <Text style={styles.textSub2}>바로 회의에 참여해보세요.</Text>

          <View style={styles.codeView}>
            <TextInput
              style={{display: 'none'}}
              onChangeText={codeInput}
              value={code}
              autoCapitalize="none"
              maxLength={6}
              editable={code.length === 6 ? false : true}
              ref={codeLineRef}
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
        </View>

        <View style={styles.bottomContainer}>
          {/* <LinearGradient
            end={{x: 0, y: 0.5}}
            start={{x: 1, y: 0.5}}
            colors={['#56ccf2', '#2f80ed']}
            style={styles.loginButtonView}> */}
            <TouchableHighlight style={styles.loginButtonTouch}>
              <Text style={styles.loginButtonText}>WEHAGO 계정으로 로그인</Text>
            </TouchableHighlight>
          {/* </LinearGradient> */}
          <TouchableOpacity activeOpacity={1} onPress={goLoginD}>
            <Text style={styles.loginNavigation}>
              {'직접 입력하여 로그인 >'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // keyboardAvoidingView: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  //   width: '100%',
  // },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  topContainer: {
    flex: 1,
    width: '100%',
    paddingTop: '40%',
    paddingLeft: '6%',
    paddingRight: '6%',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  textHead: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    color: '#000',
    backgroundColor: '#f2f2f2',
  },
  textSub1: {
    paddingTop: 15,
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    color: '#919191',
    backgroundColor: '#f2f2f2',
  },
  textSub2: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    color: '#919191',
    backgroundColor: '#f2f2f2',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 100,
    zIndex: 2,
  },
  inputNumber: {
    backgroundColor: '#fff',
    width: 50,
    height: 55,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: 10,
    color: '#000',
    zIndex: 999,
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    paddingLeft: '6%',
    paddingRight: '6%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingBottom: 100,
  },
  loginButtonView: {
    flexDirection: 'row',
    width: '95%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  loginButtonTouch: {
    flex: 1, 
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  loginNavigation: {
    marginTop: 10,
    color: '#919191',
    fontSize: 13,
  },
});

export default LoginScreenPresenter;
