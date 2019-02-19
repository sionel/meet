import React from 'react';
import CotrolBox from './CotrolBox';
import SubVideoBox from './SubVideoBox';
import { ConferenceModes } from '../../../../utils/Constants';

/**
 * BottomAreaBoxPresenter
 */
const BottomAreaPresenter = props =>
	props.conferenceMode === ConferenceModes.CONTROL ? (
		<CotrolBox onClose={props.onClose} orientation={props.orientation} callType={props.callType} />
	) : (
		<SubVideoBox onClose={props.onClose} orientation={props.orientation} />
	);
export default BottomAreaPresenter;
