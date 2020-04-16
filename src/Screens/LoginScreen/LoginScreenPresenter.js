import React, { useState, useEffect } from 'react';
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
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

import { CustomIcon, CustomLottie } from '../../components';
import LaunchScreen from '../LaunchScreen';
import { StyledText } from 'rn-component';
import { WEHAGO_TYPE } from '../../../config';
const { Text } = StyledText;
const bg = require('../../../assets/bgIntroWehagoIphoneX_3x.png');
// import { Text } from '../../components/StyledText';
// import { NavigationEvents } from 'react-navigation';

export default function LoginScreenPresenter(props) {
  const [waiting, setWaiting] = useState(true);

  const _handleLoginForWehago = () => {
    const iosUrl = 'wehago://?wehagomeet=login';
    const androidUrl = 'wehago://app?name=meet';
    const iosMarketURL =
      'http://itunes.apple.com/kr/app/wehago/id1363039300?mt=8';
    const androidMarketURL =
      'https://play.google.com/store/apps/details?id=com.duzon.android.lulubizpotal';

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

  const _handleCheckUser = async () => {
    const { auth, loginCheckRequest } = props;
    if (auth.AUTH_A_TOKEN) {
      const result = await loginCheckRequest(
        auth.AUTH_A_TOKEN,
        auth.AUTH_R_TOKEN,
        auth.last_access_company_no,
        auth.HASH_KEY,
        props.isWehagoLogin
      );

      setTimeout(() => {
        if (result.errors) {
          switch (result.errors.code) {
            case 'E002':
              setWaiting(false);
              // return Alert.alert(
              //   '로그아웃',
              //   '고객님의 다른 기기에서 저 접속정보가 확인되어 로그아웃 됩니다.'
              // );
              return;
            default:
              return setWaiting(false);
          }
        } else {
          return props.screenProps.handleOnLogin();
        }
      }, 1000);
    } else {
      return setTimeout(() => {
        setWaiting(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const isTablet = DeviceInfo.isTablet();
    isTablet
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToPortrait();

    _handleCheckUser();
  }, []);

  if (waiting) {
    return (
      <View style={{ flex: 1, backgroundColor: '#379bd8' }}>
        {/* <CustomLottie
          source={'waiting'}
          containerStyle={{ backgroundColor: 'transparent' }}
          width={225}
          height={225}
        > */}
        {/* <LoginFailAlert
            modal={modal}
            modalText={modalText}
            onCancelTryLogin={this._handleCancelTryLogin}
          /> */}
        {/* </CustomLottie> */}
        <LaunchScreen bg={bg} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={bg}
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#379bd8',
        alignItems: 'center'
      }}
    >
      {/* <NavigationEvents
        onWillFocus={payload => {
          setFocus(true);
        }}
        onWillBlur={() => setFocus(false)}
      /> */}

      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text
            style={{
              color: '#fff',
              fontSize: 24,
              fontWeight: 'normal'
              // fontFamily: 'DOUZONEText30'
            }}
          >
            {`시간과 장소의 제약 없는\n효율적인 화상회의\n`}
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold'
                // fontFamily: 'DOUZONEText50'
              }}
            >
              {WEHAGO_TYPE} Meet
            </Text>
          </Text>
        </View>

        <View style={styles.middleContainer}>
          <Image
            source={require('../../../assets/imgMeet.png')}
            style={{ width: 180, height: 180 }}
          />
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
                width={24}
                height={24}
                style={{ marginRight: 5.5 }}
              />
              <Text style={styles.loginButtonText}>
                {WEHAGO_TYPE} 앱으로 로그인
              </Text>
            </>
          </TouchableHighlight>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props.navigation.navigate({
                routeName: 'LoginInput',
                params: {
                  ...props.screenProps
                }
              });
            }}
          >
            <Text style={styles.loginNavigation}>직접 입력해서 로그인</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* {!focus && (
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#00000060' }]}
        />
      )} */}
    </ImageBackground>
  );
}

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
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  loginNavigation: {
    marginTop: 40,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'DOUZONEText30',
    textDecorationLine: 'underline'
  }
});
