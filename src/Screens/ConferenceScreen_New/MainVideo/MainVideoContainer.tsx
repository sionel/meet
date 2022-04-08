import { View, Text } from 'react-native';
import React from 'react';
import MainVideoPresenter from './MainVideoPresenter';
import { MainVideoContainerProps } from '../types';

const MainVideoContainer: React.FC<MainVideoContainerProps> = () => {
  return <MainVideoPresenter />;
};
export default MainVideoContainer;
