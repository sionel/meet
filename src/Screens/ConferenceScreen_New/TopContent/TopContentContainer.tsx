import { View, Text } from 'react-native';
import React from 'react';
import { TopContentContainerProps } from '../types';
import TopContentPresenter from './TopContentPresenter';

const TopContentContainer: React.FC<TopContentContainerProps> = () => {
  return <TopContentPresenter />;
};

export default TopContentContainer;
