import { connect } from 'react-redux';
import ContentContainer from './ContentContainer';
import { actionCreators as localActions } from '../../../redux/modules/local';
import { actionCreators as mainUserActions } from '../../../redux/modules/mainUser';

const mapStateToProps = (state, ownProps) => {
	const { local: { conferenceMode } } = state;
	// const { drawingMode } = state.mainUser;
	const { mainUser } = ownProps;

	return {
		conferenceMode,
		videoTrack: mainUser.videoTrack,
		isMuteVideo: mainUser.isMuteVideo,
		drawingMode: state.mainUser.drawingMode
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setConferenceMode: mode => {
			return dispatch(localActions.setConferenceMode(mode));
		},
		setDrawingMode: value => {
			return dispatch(mainUserActions.setDrawingMode(value));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
