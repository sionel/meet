import { View, Text } from 'react-native';
import React from 'react';
import { SplitVideoContainerProps } from '../types';
import SplitVideoPresenter from './SplitVideoPresenter';

const SplitVideoContainer: React.FC<SplitVideoContainerProps> = props => {
  return (
    <SplitVideoPresenter />
  );
};
export default SplitVideoContainer;
