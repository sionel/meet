import { Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import React, { Fragment } from 'react';
import TopPopup from './TopPopup';
import TopContent from './TopContent';
import Main from './Main';
import SplitVideo from './SplitVideo';
import BottomPopup from './BottomPopup';
import BottomContent from './BottomContent';
import { WEHAGO_TYPE } from '../../../config';
import { ConferenceScreenPresenterProps } from '@screens/ConferenceScreen_New/types';
import ScreenShareIOS from './ScreenShare/ScreenShareIOS';

const ConferenceScreenPresenter: React.FC<ConferenceScreenPresenterProps> = ({
  isConnected,
  roomName,
  id,
  isChatting,
  handleClose
}) => {
  // console.log('isConnected : ', isConnected);
  // console.log('participant : ', participants[0]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar backgroundColor="#000" barStyle={'light-content'} />
      {Platform.OS === 'ios' && <ScreenShareIOS />}
      {isConnected ? (
        <Fragment>
          <TopPopup />
          <TopContent roomName={roomName} id={id} handleClose={handleClose} />
          <Main />
          {/* <SplitVideo /> */}
          <BottomPopup roomId={id} />
          {!isChatting && <BottomContent handleCloseConf={handleClose} />}
        </Fragment>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TouchableOpacity onPress={() => {}}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{`Loading...`}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ConferenceScreenPresenter;
