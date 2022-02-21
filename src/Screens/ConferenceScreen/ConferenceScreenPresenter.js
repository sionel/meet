/**
 * ConferenceScreenPresenter
 * 화상회의 화면 프레젠터
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Platform,
  View,
  StatusBar,
  SafeAreaView
} from 'react-native';
import LoadingIndicator from './LoadingIndicator';
import Content from './Content';
import SimpleNoti from './SimpleNoti';
import { isWehagoV } from '@utils/index';
import WatingScreen from './WatingScreen';
import ScreenShareIOS from './ScreenShare/ScreenShareIOS';
import ScreenShareANDROID from './ScreenShare/ScreenShareANDROID';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { SafeAreaView } from 'react-navigation';
/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props => {
  const { pipMode } = props;
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const localPipMode = useSelector(state => state.local.pipMode);
  if (localPipMode !== pipMode) {
    dispatch({ type: 'local.CONFERENCE_PIP_MODE', pipMode });
  }

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 0,
        elevation: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        // paddingBottom: Math.max(insets.bottom, 16),
        // paddingTop: Math.max(insets.top, 16)
      }}
    >
      <StatusBar barStyle={'light-content'} />
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
          createdTime={props.createdTime}
        />
      ) : isWehagoV ? (
        <WatingScreen orientation={props.orientation} onClose={props.onClose} />
      ) : (
        <LoadingIndicator />
      )}
    </View >
  );
};

export default ConferenceScreenPresenter;
