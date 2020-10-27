
import React from 'react'
import {
  Platform,
  Image,
  StyleSheet,
  View,
  ImageBackground
} from 'react-native';
import { Text } from './StyledText';
import { WEHAGO_TYPE } from '../../config';

export default function Splash() {
    return (
        <ImageBackground
        source={require('../../assets/bgIntroWehagoIphoneX_3x.png')}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: '#379bd8',
          alignItems: 'center'
        }}
      >
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text
              style={{
                color: '#fff',
                fontSize: 24
              }}
            >
              {`시간과 장소의 제약 없는\n효율적인 화상회의\n`}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold'
                }}
              >
                {WEHAGO_TYPE} Meet
              </Text>
            </Text>
          </View>

          <View style={styles.middleContainer}>
            <Image
              source={require('../../assets/imgMeet.png')}
              style={{ width: 180, height: 180 }}
            />
          </View>

          <View style={styles.bottomContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Image
                source={require('../../assets/logoAppqward2019.png')}
                style={{ width: 36.5, height: 50, marginRight: 13 }}
              />
              <View style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#fff'
                  }}
                >
                  스마트앱어워드 2019
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#fff'
                  }}
                >
                  기능서비스부분 통합대상
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
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
  