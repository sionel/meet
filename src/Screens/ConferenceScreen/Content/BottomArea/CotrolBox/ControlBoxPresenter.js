import React, { Fragment } from 'react';
import ControlButton from './ControlButton';

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
		<ControlButton name={'speaker'} on={props.speaker == 2 ? false : true} onPress={props.onChangeSpeaker} />
		{props.callType != 2 && (
			<ControlButton name={'camera'} on={!props.isMuteVideo} onPress={props.toggleMuteVideo} />
		)}
		<ControlButton name={'mic'} on={!props.isMuteMic} onPress={props.toggleMuteMic} />
		<ControlButton name={'endcall'} on={true} onPress={props.onClose} />
	</Fragment>
);

export default ControlBoxPresenter;
