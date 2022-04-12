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
  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View>
      {Platform.OS === 'ios' ? (
        <StatusBar barStyle={'light-content'} />
      ) : (
        <StatusBar backgroundColor="transparent" translucent={true} />
      )}
      <TopPopup />
      <TopContent />
      <MainVideo />
      <SplitVideo />
      <BottomPopup />
      <BottomContent />
    </View>
    // </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
