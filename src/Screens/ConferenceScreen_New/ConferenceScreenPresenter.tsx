import { StatusBar, View } from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import Main from './Main';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from '../../../config';
import { ConferenceScreenPresenterProps } from '@screens/ConferenceScreen_New/types';

const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  participants,
  handleClose,
  handleSpeaker
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
      {!isConnected ? (
        <Fragment>
          {/* <TopPopup />*/}
          <TopContent />
          <Main mainUser={participants[2]} />
          {/* <SplitVideo /> */}
          {/* <BottomPopup roomId="213564782" handleSpeaker={handleSpeaker} /> */}
          <BottomContent handleCloseConf={handleClose}  />
        </Fragment>
      ) : WEHAGO_TYPE === 'WEHAGO' ? (
        <Fragment></Fragment>
      ) : (
        <Fragment></Fragment>
      )}
    </View>
  );
};

export default ConferenceScreenPresenter;
