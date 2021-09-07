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

  return (
    <View style={{ flex: 1 }}>
      <SimpleNoti />
      {Platform.OS === 'ios' ? (
        <ScreenShareIOS />
      ) : (
        <ScreenShareANDROID/>
      )}
      {/* <TouchableOpacity
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          top: 200,
          left: 100,
          backgroundColor: '#2825f2',
          zIndex: 99
        }}
        onPress={props.toggleScreenFlag}
      /> */}
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
        <WatingScreen orientation={props.orientation} onClose={props.onClose} />
      ) : (
        <LoadingIndicator />
      )}
    </View>
  );
};

export default ConferenceScreenPresenter;
