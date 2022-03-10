import React, { Fragment } from 'react';
import {
  View,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';
import { CustomIcon } from '@components/index';
import ReservationInfoScreen from './subScreens/ReservationInfoScreen';
import FullroomScreen from './subScreens/FullroomScreen';
import WatingScreen from './subScreens/WatingScreen';
import WatingHorizonScreen from './subScreens/WatingHorizonScreen';
import DeletedScreen from './subScreens/DeletedScreen';
import icBack from '@assets/icons/ic_back.png';
import LinearGradient from 'react-native-linear-gradient';

import patternTop from '@assets/patterns/waiting_pattern_top.png';
import patternBot from '@assets/patterns/waiting_pattern_bot.png';

interface presenterProps {
  conferenceState: string;
  spin: any;
  start: string;
  end: string;
  name: string;
  accessUser: any[];
  isPublic: boolean;
  iscret: boolean;
  handleClickBack: () => void;
  isTablet: boolean;
  isHorizon: boolean;
  selectedRoomName: string;
}

export default function ConferenceStatePresenter(props: presenterProps) {
  const { conferenceState, spin, handleClickBack, selectedRoomName, isTablet, isHorizon } = props;

  return conferenceState === 'wating' ? (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      colors={['#dbecfe', '#fcfdff', '#fcfdff']}
      style={{ flex: 1 }}
    >
      {isTablet && (
        <Fragment>
          <Image
            source={patternTop}
            style={{
              position: 'absolute',
              width: 240,
              height: 240,
              top: 0,
              right: 0
            }}
          />
          <Image
            source={patternBot}
            style={{
              position: 'absolute',
              width: 260,
              height: 82,
              left: 0,
              bottom: isHorizon ? '15%' : '35%'
            }}
          />
        </Fragment>
      )}
      <SafeAreaView style={{ backgroundColor: 'transparent', flex: 1 }}>
        <StatusBar barStyle={'dark-content'} />
        <View style={[styles.topTitle, { backgroundColor: 'transparent' }]}>
          <TouchableOpacity onPress={handleClickBack}>
            <Image
              source={icBack}
              style={{ width: 24, height: 24 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: 'DOUZONEText50', fontSize: 18, color: '#333' }}
          >
            {selectedRoomName}
          </Text>
          {/* 회의제목 중앙정렬처리를 위해 빈공간 */}
          <View style={{ width: 24, height: 24 }} />
        </View>
        {isHorizon ? (
          <WatingHorizonScreen {...props} />
        ) : (
          <WatingScreen {...props} />
        )}
      </SafeAreaView>
    </LinearGradient>
  ) : (
    <SafeAreaView style={{ backgroundColor: '#f8f8fa', flex: 1 }}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.topTitle]}>
        <TouchableOpacity onPress={handleClickBack}>
          <Image
            source={icBack}
            style={{ width: 24, height: 24 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
      {conferenceState === 'deleted' ? (
        <DeletedScreen {...props} />
      ) : conferenceState === 'reservationInfo' ? (
        <ReservationInfoScreen {...props} />
      ) : conferenceState === 'fullroom' ? (
        <FullroomScreen {...props} />
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.View
            style={{
              // flex: 1,
              height: '100%',
              transform: [{ rotate: spin }],
              alignItems: 'center',
              justifyContent: 'center'
              // backgroundColor:'red'
            }}
          >
            <CustomIcon name={'loading'} width={40} height={40} />
          </Animated.View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#f8f8fa'
  }
});

// const ConferenceStatePresenter = props => {
//   let { conferenceState } = props;

//   Animated.loop(
//     Animated.timing(rotate, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//       easing: Easing.out(Easing.poly(1))
//     })
//   ).start();
//   if (conferenceState === 'deleted') {
//     return (
//       <View style={{ flex: 1 }}>
//         <DeletedScreen {...props}></DeletedScreen>
//       </View>
//     );
//   } else if (conferenceState === 'reservationInfo') {
//     return (
//       <View style={{ flex: 1 }}>
//         <ReservationInfoScreen {...props}></ReservationInfoScreen>
//       </View>
//     );
//   } else if (conferenceState === 'wating') {
//     return (
//       <View style={{ flex: 1 }}>
//         <WatingScreen {...props}></WatingScreen>
//       </View>
//     );
//   } else if (conferenceState === 'fullroom') {
//     return (
//       <View style={{ flex: 1 }}>
//         <FullroomScreen {...props}></FullroomScreen>
//       </View>
//     );
//   } else {
//     return (
//       <View style={{ flex: 1 }}>
//         <View>
//           <Animated.View
//             style={{
//               // flex: 1,
//               height: '100%',
//               transform: [{ rotate: spin }],
//               alignItems: 'center',
//               justifyContent: 'center'
//               // backgroundColor:'red'
//             }}
//           >
//             <CustomIcon name={'loading'} width={40} height={40} />
//           </Animated.View>
//         </View>
//       </View>
//     );
//   }
// };

// const styles = StyleSheet.create({});

// export default ConferenceStatePresenter;
