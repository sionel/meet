import React from 'react';
import CotrolBox from './CotrolBox';
import SubVideoBox from './SubVideoBox';
import { ConferenceModes } from '../../../../utils/Constants';

/**
 * BottomAreaBoxPresenter
 */
const BottomAreaPresenter = props =>
  props.conferenceMode !== ConferenceModes.CONTROL || props.isScreenShare ? (
    <CotrolBox
      onClose={props.onClose}
      onChangeSpeaker={props.onChangeSpeaker}
      orientation={props.orientation}
      callType={props.callType}
      speaker={props.speaker}
      onChangeMicMaster={props.onChangeMicMaster}
      handleToggleMic={props.handleToggleMic}
    />
  ) : (
    <SubVideoBox
      onClose={props.onClose}
      orientation={props.orientation}
      callType={props.callType}
    />
  );
export default BottomAreaPresenter;
