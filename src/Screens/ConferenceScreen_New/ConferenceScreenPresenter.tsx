import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from '../../../config';
import { ConferenceScreenPresenterProps } from './types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// interface ConferenceScreenPresenterProps {
//   isConnected: boolean;
// }
const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  handleClose,
  handleSpeaker
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ccc' }}>
        {isConnected ? (
          <Fragment>
            <TopPopup />
            <TopContent />
            <MainVideo />
            <SplitVideo />
            {/* <BottomPopup roomId={'213564782'} handleSpeaker={handleSpeaker} /> */}
            <BottomContent handleCloseConf={handleClose} />
          </Fragment>
        ) : WEHAGO_TYPE === 'WEHAGO' ? (
          <Fragment></Fragment>
        ) : (
          <Fragment></Fragment>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ConferenceScreenPresenter;
