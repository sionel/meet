import React from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CustomIcon } from '../components';
import { RootState } from '../redux/configureStore';

export default function Indicator() {
  const indicator = useSelector((state: RootState) => state.indicator);

  const { visible, message } = indicator;

  return (
    <View
      style={{
        flex: 1,
        zIndex: 9,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CustomIcon name={'loading'} size={100} />
      <Text>{message}</Text>
    </View>
  );
}
