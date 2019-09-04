/**
 * ConferenceScreenPresenter
 * 화상대화 화면 프레젠터
 */
import React from 'react';
import LoadingIndicator from './LoadingIndicator';
import Content from './Content';

/**
 * ConferenceScreenPresenter
 */
const ConferenceScreenPresenter = props =>
  props.mainUser && props.connection ? (
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
    <LoadingIndicator />
  );

export default ConferenceScreenPresenter;
