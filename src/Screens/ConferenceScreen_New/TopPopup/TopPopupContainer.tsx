import { View, Text } from 'react-native';
import React from 'react';
import TopPopupPresenter from './TopPopupPresenter';
import { TopPopupContainerProps } from '../types';

const TopPopupContainer: React.FC<TopPopupContainerProps> = props => {
  return <TopPopupPresenter />;
};
export default TopPopupContainer;
