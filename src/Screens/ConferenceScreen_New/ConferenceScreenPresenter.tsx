import {
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import MainVideo from './MainVideo';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from '../../../config';
import { ConferenceScreenPresenterProps } from './types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  handleClose,
  handleSpeaker
}) => {
  const insets = useSafeAreaInsets();

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
    <View style={{flex:1, backgroundColor: '#000'}}>
      <StatusBar backgroundColor={'blue'} barStyle={'light-content'} />
      {!isConnected ? (
        <Fragment>
          <TopPopup insets={insets} />
          <TopContent insets={insets} />
          <MainVideo insets={insets} />
          {/* <SplitVideo /> */}
          <BottomPopup
            roomId="213564782"
            handleSpeaker={handleSpeaker}
            insets={insets}
          />
          {/* <BottomContent handleCloseConf={handleClose} insets={insets} /> */}
        </Fragment>
      ) : WEHAGO_TYPE === 'WEHAGO' ? (
        <Fragment></Fragment>
      ) : (
        <Fragment></Fragment>
      )}
      </View>
    // </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
