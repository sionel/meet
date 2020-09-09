import React, { Fragment } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  SectionList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text
} from 'react-native';
import { CustomIcon } from '../../components';
import ReservationInfoScreen from './subScreens/ReservationInfoScreen';
import SettingScreen from './subScreens/SettingScreen';
import FullroomScreen from './subScreens/FullroomScreen';
import WatingScreen from './subScreens/WatingScreen';
import DeletedScreen from './subScreens/DeletedScreen';

const ConferenceStatePresenter = props => {
  let { conferenceState } = props;
  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  // conferenceState = 'setting'
  Animated.loop(
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.poly(1))
    })
  ).start();
  if (conferenceState === 'deleted') {
    return (
      <View style={{ flex: 1 }}>
        <DeletedScreen {...props}></DeletedScreen>
      </View>
    );
  } else if (conferenceState === 'reservationInfo') {
    return (
      <View style={{ flex: 1 }}>
        <ReservationInfoScreen {...props}></ReservationInfoScreen>
      </View>
    );
  } else if (conferenceState === 'wating') {
    return (
      <View style={{ flex: 1 }}>
        <WatingScreen {...props}></WatingScreen>
      </View>
    );
  } else if (conferenceState === 'fullroom') {
    return (
      <View style={{ flex: 1 }}>
        <FullroomScreen {...props}></FullroomScreen>
      </View>
    );
  } else if(conferenceState === 'setting'){
    return (
      <View style={{ flex: 1 }}>
        <SettingScreen {...props}></SettingScreen>
      </View>
    );
  } else {
    return (
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
    );
  }

};

const styles = StyleSheet.create({});

export default ConferenceStatePresenter;
