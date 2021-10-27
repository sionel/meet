/**
 * ConferenceScreenPresenter
 * 화상회의 화면 프레젠터
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Platform, View, TouchableOpacity } from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import Content from './Content';
import SimpleNoti from './SimpleNoti';
import { isWehagoV } from '../../utils';
import WatingScreen from './WatingScreen';
import ScreenShareIOS from './ScreenShare/ScreenShareIOS';
import ScreenShareANDROID from './ScreenShare/ScreenShareANDROID';
import { SafeAreaView } from 'react-navigation';
/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props => {
  const { pipMode } = props;

  const dispatch = useDispatch();
  const localPipMode = useSelector(state => state.local.pipMode);
  if (localPipMode !== pipMode) {
    dispatch({ type: 'local.CONFERENCE_PIP_MODE', pipMode });
  }
  // console.log('ConferenceScreenPresenter');
  // console.log(props.mainUser);
  // console.log(props.connection);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SimpleNoti />
        {Platform.OS === 'ios' ? <ScreenShareIOS /> : <ScreenShareANDROID />}
        {props.mainUser && props.connection ? (
          <Content
            mainUser={props.mainUser}
            callType={props.callType}
            selectedRoomName={props.selectedRoomName}
            onClose={props.onClose}
            onClear={props.onClear}
            onSetDrawingData={props.onSetDrawingData}
            onChangeDrawingMode={props.onChangeDrawingMode}
            onChangeSharingMode={props.onChangeSharingMode}
            onChangeDocumentPage={props.onChangeDocumentPage}
            onChangeMicMaster={props.onChangeMicMaster}
          />
        ) : isWehagoV ? (
          <WatingScreen
            orientation={props.orientation}
            onClose={props.onClose}
          />
        ) : (
          <LoadingIndicator />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ConferenceScreenPresenter;
