import { View, Text } from 'react-native';
import React from 'react';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  return <ConferenceScreenPresenter />;
};
export default ConferenceScreenContainer;
