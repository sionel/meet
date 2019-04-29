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
  props.mainUser ? (
    <Content
      mainUser={props.mainUser}
      onClose={props.onClose}
      callType={props.callType}
      onClear={props.onClear}
      onSetDrawingData={props.onSetDrawingData}
      onChangeDrawingMode={props.onChangeDrawingMode}
    />
  ) : (
    <LoadingIndicator />
  );

export default ConferenceScreenPresenter;
