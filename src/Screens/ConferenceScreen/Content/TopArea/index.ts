// import { connect } from 'react-redux';
import TopAreaContainer from './TopAreaContainer';
// import { actionCreators as localActionCreators } from '../../@redux/local';
// import { actionCreators as mainUserActionCreators } from '../../@redux/mainUser';
// import { actionCreators as ScreenShareCreators } from '../../@redux/ScreenShare';

// const mapStateToProps = state => {
//   const {
//     local,
//     mainUser,
//     user,
//     deployed,
//     screenShare
//   } = state;

//   return {
//     conferenceMode: local.conferenceMode,
//     // isMuteVideo: local.user.isMuteVideo,
//     // documentListMode: mainUser.documentListMode,
//     memberType: user.auth.member_type, // wehago one 사용자
//     deployedServices: deployed.deployedServices,
//     isScreenShare: screenShare.isScreenShare
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     toggleCameraFacingMode: () =>
//       dispatch(localActionCreators.toggleCameraFacingMode()),
//     toggleDocumentListMode: documentListMode =>
//       dispatch(mainUserActionCreators.setDocumentListMode(documentListMode)),
//     setScreenFlag: flag => dispatch(ScreenShareCreators.setScreenFlag(flag)),
//     toggleScreenFlag: () => dispatch(ScreenShareCreators.toggleScreenFlag())
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TopAreaContainer);
export default TopAreaContainer;
