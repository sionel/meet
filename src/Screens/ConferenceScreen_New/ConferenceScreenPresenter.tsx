import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
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
  const { handleClose } = props;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle={'light-content'} />
      <TopPopup />
      <TopContent />
      <MainVideo />
      <SplitVideo />
      <BottomPopup />
      <BottomContent handleCloseConf={handleClose} />
    </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
