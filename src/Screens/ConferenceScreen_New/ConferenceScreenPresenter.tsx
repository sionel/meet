import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { ConferenceScreenPresenterProps } from './types';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';

const ConferenceScreenPresenter: React.FC<
  ConferenceScreenPresenterProps
> = props => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopPopup />
      <TopContent />
      <MainVideo />
      <SplitVideo />
      <BottomPopup />
      <BottomContent />
    </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
