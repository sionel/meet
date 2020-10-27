import * as React from 'react';
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
import { getLoginType } from './ServiceCodeConverter';

import { WEHAGO_TYPE, WEHAGO_ENV } from '../../../config';

const iswehagov = WEHAGO_ENV === 'WEHAGOV';

export default function LoginScreen(props) {
  let ref1, ref2, ref3, ref4, ref5, ref6;
  
  const _inputCode = code => {};
  let _serviceCode;

  if (iswehagov) {
    _serviceCode = Platform.OS === 'ios' ? 'wehagovmeet' : 'meetv';
  } else {
    _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';
  }

  const _handleLoginForWehago = () => {
    const iosUrl = `wehago${iswehagov ? 'v' : ''}://?${_serviceCode}=login`;
    const androidUrl = `wehago${
      iswehagov ? 'v' : ''
    }://app?name=${_serviceCode}&login=true`;
    const iosMarketURL = iswehagov
      ? 'https://www.wehagov.com/#/mobile'
      : 'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL = iswehagov
      ? 'https://www.wehagov.com/#/mobile'
      : 'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

    Linking.openURL(Platform.OS === 'ios' ? iosUrl : androidUrl).catch(err => {
      Linking.openURL(
        Platform.OS === 'ios' ? iosMarketURL : androidMarketURL
      ).catch(err => {
        Alert.alert(
          '스토어에서 해당 앱을 찾을 수 없습니다.',
          '',
          [{ text: 'OK' }],
          {
            cancelable: true
          }
        );
      });
    });
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 32
            }}
          >
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref1}
              onChangeText={_inputCode}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref2}
              onChangeText={_inputCode}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref3}
              onChangeText={_inputCode}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref4}
              onChangeText={_inputCode}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref5}
              onChangeText={_inputCode}
            />
            <TextInput
              style={styles.inputNumber}
              maxLength={1}
              ref={ref6}
              onChangeText={_inputCode}
            />
          </View>
          <View
            style={{
              right: 0,
              marginTop: 20,
              height: 32,
              flexDirection: 'row-reverse'
            }}
          >
            {/* <View
              style={{ width: 58, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, fontSize:14  }}
            > */}
            {/* <Button title="확인" onPress={() => {}} /> */}
            {/* </View> */}
          </View>
        </View>

        {/* <View style={styles.middleContainer}>
          <Image source={appIcon} style={{ width: 180, height: 180 }} />
        </View> */}

        <View style={styles.bottomContainer}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor={'#197cdc88'}
            onPress={() => {
              _handleLoginForWehago();
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
              props.navigation.navigate({
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

LoginScreen.defaultProps = {
  wehagoType: 'WEHAGO',
  serviceCode: '',
  text1: '',
  text2: '',
  onManualLogin: () => {}
};

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
    paddingTop: 112
    // paddingLeft: 40
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
    backgroundColor: 'rgba(245,248,252,0.3)',
    width: 50,
    height: 55,
    fontSize: 40,
    textAlign: 'center',
    borderRadius: 10,
    color: '#fff'
  }
});
