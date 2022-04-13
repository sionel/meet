import { View, Text } from 'react-native';
import React from 'react';
import { ChattingProps } from '../types';

const Chatting: React.FC<ChattingProps> = ({ onPressSend, myMessage }) => {
  return (
    <View>
      <Text>Chatting</Text>
    </View>
  );
};
export default Chatting;
