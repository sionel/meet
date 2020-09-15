/**
 * ConferenceScreenPresenter
 * 화상대화 화면 프레젠터
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LoadingIndicator from './LoadingIndicator';
import SettingScreen from './SettingScreen';

import Content from './Content';

/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props => {
  const { pipMode } = props;

  const dispatch = useDispatch();
  const localPipMode = useSelector(state => state.local.pipMode);
  if (localPipMode !== pipMode) {
    dispatch({ type: 'CONFERENCE_PIP_MODE', pipMode });
  }

  return props.mainUser && props.connection ? (
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
    />
  ) : (
    // <LoadingIndicator/>
    <SettingScreen
      onBack={props.onBack}
      onSetConnection={props.onSetConnection}
    />
  );
};

export default ConferenceScreenPresenter;
