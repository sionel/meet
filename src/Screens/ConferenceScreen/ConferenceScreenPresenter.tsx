import { StatusBar, View } from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import Main from './Main';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { ConferenceScreenPresenterProps } from '@screens/ConferenceScreen/types';
import LoadingIndicator from './LoadingIndicator';
// import KickScreen from './KickScreen';

const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  roomName,
  id,
  roomToken,
  // isKick,
  isChatting,
  handleClose
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
      {isConnected ? (
        <Fragment>
          {/* {isKick && <KickScreen isKick={isKick} onClose={handleClose}/>} */}
          {/* TODO: 공통 ALERT 창 만들어서 추후에 강퇴처리 */}
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
