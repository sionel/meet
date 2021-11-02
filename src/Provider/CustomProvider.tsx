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

export default function CustomProvider(props) {
  const { children } = props;
  const alert = useSelector(state => state.alert);
  const indicator = useSelector(state => state.indicator);
  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;
  const dispatch = useDispatch();

  const _setOrientation = (orientation: OrientationType) => {
    dispatch(orientationAction.setOrientation(orientation));
  };

  useEffect(() => {
    Orientation.addOrientationListener(_setOrientation);
    return () => {
      Orientation.removeOrientationListener(_setOrientation);
    };
  }, []);
  useDeviceOrientationChange(_setOrientation);
  return (
    <View style={{ flex: 1, zIndex: 9 }}>
      {alertVisible && <Alert />}
      {indicatorVisible && <Indicator />}
      {children}
    </View>
  );
}
