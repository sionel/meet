import { StatusBar, View } from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import Main from './Main';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { ConferenceScreenPresenterProps } from '@screens/ConferenceScreen_New/types';
import LoadingIndicator from './LoadingIndicator';

const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  roomName,
  id,
  roomToken,
  isKick,
  isChatting,
  handleClose
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
      {isConnected ? (
        <Fragment>
          {/* {isKick && <Fragment isKick={isKick} {onClose={handleClose}}/>} */}
          <TopPopup />
          <TopContent roomName={roomName} id={id} handleClose={handleClose} />
          <Main roomName={roomName} onClose={handleClose} />
          {/* <SplitVideo /> */}
          <BottomPopup roomId={id} roomToken={roomToken} />
          {!isChatting && <BottomContent handleCloseConf={handleClose} />}
        </Fragment>
      ) : (
        <LoadingIndicator />
      )}
    </View>
  );
};

export default ConferenceScreenPresenter;
