import { View, Text } from 'react-native';
import React from 'react';
import BottomContentPresenter from './BottomContentPresenter';
import { BottomContentContainerProps } from '../types';

const BottomContentContainer: React.FC<BottomContentContainerProps> = props => {
  return (
    <BottomContentPresenter />
  );
};
export default BottomContentContainer;
