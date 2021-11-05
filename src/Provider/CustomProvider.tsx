import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import Alert from './Alert';
import Indicator from './Indicator';
import { useSelector, useDispatch } from 'react-redux';
import Orientation, {
  OrientationType,
  useDeviceOrientationChange
} from 'react-native-orientation-locker';
import { actionCreators as orientationAction } from '../redux/modules/orientation';
import { RootState } from '../redux/configureStore';

export default function CustomProvider(props: any) {
  const { children } = props;
  const alert = useSelector((state: RootState) => state.alert);
  const indicator = useSelector((state: RootState) => state.indicator);
  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;
  const dispatch = useDispatch();

  const _setOrientation = (orientation: OrientationType) => {
    if (orientation === 'LANDSCAPE-LEFT') {
      Orientation.lockToLandscapeLeft();
    } else if (orientation === 'LANDSCAPE-RIGHT') {
      Orientation.lockToLandscapeRight();
    } else if (
      orientation === 'PORTRAIT' ||
      orientation === 'PORTRAIT-UPSIDEDOWN'
    ) {
      Orientation.lockToPortrait();
    }

    dispatch(orientationAction.setOrientation(orientation));
  };

  // useEffect(() => {
  //   console.log(1);

  //   Orientation.addOrientationListener(_setOrientation);
  //   return () => {
  //     Orientation.removeOrientationListener(_setOrientation);
  //   };
  // }, []);
  useDeviceOrientationChange(_setOrientation);
  return (
    <View style={{ flex: 1, zIndex: 9 }}>
      {alertVisible && <Alert />}
      {indicatorVisible && <Indicator />}
      {children}
    </View>
  );
}
