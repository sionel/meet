import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';
// import { ConferenceScreenPresenterProps } from './types';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from 'config';

interface ConferenceScreenPresenterProps {
  isConnected: boolean;
}
const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isConnected ? (
        <>
          <TopPopup />
          <TopContent />
          <MainVideo />
          <SplitVideo />
          <BottomPopup />
          <BottomContent />
        </>
      ) : WEHAGO_TYPE === 'WEHAGO' ? (
        <></>
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
