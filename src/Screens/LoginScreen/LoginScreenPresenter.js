import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  Linking,
  Alert,
  Image,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Button
} from 'react-native';

import CustomIcon from '../../components/CustomIcon';
import { Text } from '../../components/StyledText';
import { useDispatch } from 'react-redux';

export default function LoginScreenPresenter(props) {
  const { onWehagoLogin, onInputCode, joincode, navigation, onTest } = props;

  this.state = {
    selection: { start: 0, end: 0 }
  };

  return (
    <ImageBackground
      source={require('../../../assets/bgIntroWehagoIphoneX_3x.png')}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center'
      }}
    >
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <View style={{ left: 0 }}>
            <CustomIcon name={'verification'} size={70} />
          </View>

          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '100' }}>
            {'참여코드 입력'}
          </Text>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
            {'공유받은 참여코드 입력 후 바로 참여해보세요.'}
          </Text>
          <TextInput
            style={{
              position: 'absolute',
              top: 200,
              height: 200,
              width: '100%',
              zIndex: 10,
              color: 'rgba(0,0,0,0)',
              fontSize: 1
            }}
            autoCapitalize="none"
            onChangeText={onInputCode}
            caretHidden={true}
            value={joincode}
            maxLength={6}
            editable={joincode.length === 6 ? false : true}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 32,
              zIndex: 1
            }}
          >
            <TextInput
              style={styles.inputNumber}
              value={joincode.slice(0, 1)}
              editable={false}
              caretHidden={true}
            />
            <TextInput
              style={styles.inputNumber}
              value={joincode.slice(1, 2)}
              editable={false}
              caretHidden={true}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              value={joincode.slice(2, 3)}
              editable={false}
              caretHidden={true}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              value={joincode.slice(3, 4)}
              editable={false}
              caretHidden={true}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              value={joincode.slice(4, 5)}
              editable={false}
              caretHidden={true}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              value={joincode.slice(5, 6)}
              editable={false}
              caretHidden={true}
            />
          </View>
          <View
            style={{
              right: 0,
              marginTop: 20,
              height: 32,
              flexDirection: 'row-reverse'
            }}
          ></View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={'#197cdc88'}
            onPress={() => {
              onWehagoLogin();
            }}
            style={styles.loginButton}
          >
            <>
              <CustomIcon
                name={'btnTnaviHomeNone'}
                size={24}
                style={{ marginRight: 5.5 }}
              />
              <Text style={styles.loginButtonText}>WEHAGO 앱으로 로그인</Text>
            </>
          </TouchableHighlight>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate({
                routeName: 'LoginInput',
                params: {
                  ...props.screenProps
                }
              })
            }
            // onPress={() =>
            //   props.navigation.navigate({
            //     routeName: 'LoginInput',
            //     params: {
            //       onSetAlert: props.screenProps.onSetAlert
            //     }
            //   })
            // }
          >
            <Text style={styles.loginNavigation}>직접 입력해서 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

// LoginScreen.defaultProps = {
//   wehagoType: 'WEHAGO',
//   serviceCode: '',
//   text1: '',
//   text2: '',
//   onManualLogin: () => {}
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  topContainer: {
    flex: 1,
    width: 335,
    paddingTop: 112,
    // paddingLeft: 40
    justifyContent: 'center'
  },
  middleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginButton: {
    flexDirection: 'row',
    // width: '100%',
    width: 290,
    height: 50,
    // paddingHorizontal: 59,
    borderRadius: 25,
    backgroundColor: '#197cdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 3, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 9
      },
      android: {
        elevation: 5
      }
    })
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14
  },
  loginNavigation: {
    marginTop: 40,
    color: '#fff',
    fontSize: 13,
    textDecorationLine: 'underline'
  },
  inputNumber: {
    // backgroundColor: 'rgba(245,248,252,0.3)',
    backgroundColor: 'rgb(79,160,222)',
    width: 50,
    height: 55,
    fontSize: 30,
    textAlign: 'center',
    borderRadius: 10,
    color: '#fff'
  }
});
