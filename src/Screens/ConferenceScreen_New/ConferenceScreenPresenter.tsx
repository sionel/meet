import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import React from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from 'config';
import { ConferenceScreenPresenterProps } from './types';
// interface ConferenceScreenPresenterProps {
//   isConnected: boolean;
// }
const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  handleClose
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
          <BottomContent handleCloseConf={handleClose} />
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
