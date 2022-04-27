import React from 'react';
import { View, Text } from 'react-native';
import { SketchProps } from '@screens/ConferenceScreen_New/types';

const Sketch: React.FC<SketchProps> = ({}) => {
  return (
    <View style={{flex: 1}}>
      <Text>Sketch</Text>
    </View>
  );
};

export default Sketch;
