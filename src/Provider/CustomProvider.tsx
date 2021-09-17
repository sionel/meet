import React from 'react';
import { View, Text } from 'react-native';
import Alert from './Alert';
import Indicator from './Indicator';
import { useSelector } from 'react-redux';

export default function CustomProvider(props) {
  const { children } = props;
  const alert = useSelector(state => state.alert);
  const indicator = useSelector(state => state.indicator);
  debugger;
  const { visible: alertVisible } = alert;
  const { visible: indicatorVisible } = indicator;
  return (
    <View style={{ flex: 1 }}>
      {alertVisible && <Alert />}
      {indicatorVisible && <Indicator />}
      {children}
    </View>
  );
}
