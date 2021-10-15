// import { connect } from 'react-redux';
import ContentContainer from './ContentContainer';
// import { actionCreators as localActions } from '../../../redux/modules/local';
// import { actionCreators as mainUserActions } from '../../../redux/modules/mainUser';
// import { actionCreators as DocumentShareActions } from '../../../redux/modules/documentShare';

// const mapStateToProps = (state, ownProps) => {
// 	const { local: { conferenceMode } } = state;
// 	// const { drawingMode } = state.mainUser;
// 	const { mainUser } = ownProps;

// 	return {
// 		conferenceMode,
// 		videoTrack: mainUser.videoTrack,
// 		isMuteVideo: mainUser.isMuteVideo,
// 		drawingMode: state.mainUser.drawingMode,
// 		documentListMode: state.mainUser.documentListMode,
// 		attributes: state.documentShare.attributes,
// 	};
// };

// const mapDispatchToProps = (dispatch, ownProps) => {
// 	return {
// 		setConferenceMode: mode => {
// 			return dispatch(localActions.setConferenceMode(mode));
// 		},
// 		setDrawingMode: value => {
// 			return dispatch(mainUserActions.setDrawingMode(value));
// 		},
// 		setDocumentListMode: value => {
//       return dispatch(mainUserActions.setDocumentListMode(value));
//     },
// 		// setSharingMode: value => {
// 		// 	return dispatch(mainUserActions.setSharingMode(value));
// 		// },
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ContentContainer);
export default ContentContainer;
