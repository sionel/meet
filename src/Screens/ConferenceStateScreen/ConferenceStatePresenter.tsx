import React, { Fragment } from 'react';
import {
  View,
  Animated,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { CustomIcon } from '../../components';
import ReservationInfoScreen from './subScreens/ReservationInfoScreen';
import FullroomScreen from './subScreens/FullroomScreen';
import WatingScreen from './subScreens/WatingScreen';
import DeletedScreen from './subScreens/DeletedScreen';

export default function ConferenceStatePresenter(props: any) {
  const { conferenceState, spin, handleClickBack } = props;
  const icBack = require('../../../assets/new/icons/ic_back.png');

  return (
    <SafeAreaView style={{ backgroundColor: '#f8f8fa' }}>
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
      {conferenceState === 'deleted' && (
        <DeletedScreen {...props}></DeletedScreen>
      )}
      {conferenceState === 'reservationInfo' && (
        <ReservationInfoScreen {...props}></ReservationInfoScreen>
      )}
      {conferenceState === 'wating' && <WatingScreen {...props}></WatingScreen>}
      {conferenceState === 'fullroom' && (
        <FullroomScreen {...props}></FullroomScreen>
      )}
      <View style={{ flex: 1 }}>
        <View>
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
      </View>
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
