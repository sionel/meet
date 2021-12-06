import React, { Fragment } from 'react';
import DeviceInfo from 'react-native-device-info';
import ControlButton from './ControlButton';

const isTablet = DeviceInfo.isTablet();

/**
 * ContentPresenter
 */
const ControlBoxPresenter = props => (
  <Fragment>
    {/* <ControlButton
				name={"speaker"}
				on={!props.isMuteSpeaker}
				onPress={props.toggleMuteSpeaker}
			/> */}
    {!isTablet && (
      <ControlButton
        name={'speaker'}
        on={props.speaker == 2 ? false : true}
        onPress={props.onChangeSpeaker}
      />
    )}
    {Number(props.callType) !== 2 && !props.isScreenShare && (
      <ControlButton
        name={'camera'}
        on={!props.isMuteVideo}
        onPress={props.toggleMuteVideo}
      />
    )}
    {props.isScreenShare && (
      <ControlButton name={'camera'} on={false} onPress={() => {}} />
    )}
    <ControlButton
      name={'mic'}
      on={!props.isMuteMic}
      onPress={props.toggleMuteMic}
    />
    <ControlButton name={'endcall'} on={true} onPress={props.onClose} />
  </Fragment>
);

export default ControlBoxPresenter;
