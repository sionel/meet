import React from 'react';
import { Platform, Image, StyleSheet, View, StatusBar } from 'react-native';
import { Text } from './StyledText';
import { WEHAGO_TYPE } from '../../config';
import { getT } from '../utils/translateManager';
import Lottie from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const patternTop = require('../../assets/new/patterns/splash_pattern_top.png');
const patternBot = require('../../assets/new/patterns/splash_pattern_bottom.png');

export default function Splash() {
  const t = getT();
  return (
    <LinearGradient
      end={{ x: 0, y: 0 }}
      start={{ x: 0, y: 1 }}
      colors={['#FCFDFF', '#dbecfe']}
      style={[styles.container, styles.horizonContainer]}
    >
      <StatusBar hidden={true} />

      <Lottie
        source={require('../../assets/new/lottie/splash/splash.json')}
        imageAssetsFolder={'images'}
        autoPlay
        loop
      />
      <View style={styles.topImgView}>
        <Image source={patternTop} style={styles.topImg} />
      </View>
      <View style={styles.bottomImgView}>
        <Image source={patternBot} style={styles.bottomImg} />
      </View>
    </LinearGradient>
    // <ImageBackground
    //   source={require('../../assets/bgIntroWehagoIphoneX_3x.png')}
    //   style={{
    //     flex: 1,
    //     width: '100%',
    //     height: '100%',
    //     backgroundColor: '#379bd8',
    //     alignItems: 'center'
    //   }}
    // >
    //   <View style={styles.container}>
    //     <View style={styles.topContainer}>
    //       <Text
    //         style={{
    //           color: '#fff',
    //           fontSize: 24
    //         }}
    //       >
    //         {t('splash_first')}
    //         <Text
    //           style={{
    //             fontSize: 24,
    //             fontWeight: 'bold'
    //           }}
    //         >
    //           {WEHAGO_TYPE} Meet
    //         </Text>
    //       </Text>
    //     </View>

    //     <View style={styles.middleContainer}>
    //       <Image
    //         source={require('../../assets/imgMeet.png')}
    //         style={{ width: 180, height: 180 }}
    //       />
    //     </View>

    //     <View style={styles.bottomContainer}>
    //       <View
    //         style={{
    //           flexDirection: 'row',
    //           alignItems: 'center',
    //           justifyContent: 'center'
    //         }}
    //       ></View>
    //     </View>
    //   </View>
    // </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },

  horizonContainer: {
    paddingLeft: '28%',
    paddingRight: '28%'
  },

  topImgView: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  topImg: {
    resizeMode: 'contain',
    width: 240,
    height: 240
  },
  bottomImgView: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    zIndex: 2
  },
  bottomImg: {
    resizeMode: 'contain',
    width: 375,
    height: 300
  }
  // topContainer: {
  //   flex: 1,
  //   width: 290,
  //   paddingTop: 112
  //   // paddingLeft: 40
  // },
  // middleContainer: {
  //   flex: 1,
  //   justifyContent: 'flex-start',
  //   alignItems: 'center'
  // },
  // bottomContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // loginButton: {
  //   flexDirection: 'row',
  //   // width: '100%',
  //   width: 290,
  //   height: 50,
  //   // paddingHorizontal: 59,
  //   borderRadius: 25,
  //   backgroundColor: '#197cdc',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginVertical: 10,
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: 'black',
  //       shadowOffset: { width: 3, height: 6 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 9
  //     },
  //     android: {
  //       elevation: 5
  //     }
  //   })
  // },
  // loginButtonText: {
  //   color: '#fff',
  //   fontSize: 14,
  //   fontFamily: 'DOUZONEText30'
  // },
  // loginNavigation: {
  //   marginTop: 40,
  //   color: '#fff',
  //   fontSize: 13,
  //   fontFamily: 'DOUZONEText30',
  //   textDecorationLine: 'underline'
  // }
});
