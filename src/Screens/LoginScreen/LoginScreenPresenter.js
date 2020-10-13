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
  ImageBackground
} from 'react-native';

import CustomIcon from '../../components/CustomIcon';
import { Text } from '../../components/StyledText';
import { getLoginType } from './ServiceCodeConverter';

export default function LoginScreen(props) {
  const { wehagoType, serviceCode, text1, text2, onManualLogin } = props;

  let _serviceCode = getLoginType(serviceCode, wehagoType);

  const _handleLoginForWehago = () => {
    const iosUrl = `wehago${wehagoType === 'WEHAGOV' ? 'v' : ''}://?${_serviceCode}=login`;
    const androidUrl = `wehago${wehagoType === 'WEHAGOV' ? 'v' : ''}://app?name=${_serviceCode}&login=true`;
    const iosMarketURL =
      wehagoType === 'WEHAGOV'
        ? 'https://www.wehagov.com/#/mobile'
        : 'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL =
      wehagoType === 'WEHAGOV'
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

  let appIcon = require('../../../assets/imgMeet.png');

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
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '100' }}>
            {text1}
          </Text>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
            {text2}
          </Text>
        </View>

        <View style={styles.middleContainer}>
          <Image source={appIcon} style={{ width: 180, height: 180 }} />
        </View>

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
            onPress={() => onManualLogin()}
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
    width: 290,
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
  }
});
