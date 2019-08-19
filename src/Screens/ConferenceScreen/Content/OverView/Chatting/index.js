import ChattingContainer from './ChattingContainer';
import { connect } from 'react-redux';
// import { actionCreators as localActions } from '../../../../redux/modules/local';

// map state to props
const mapStateToProps = state => ({
  messages: state.local.message
});

// map dispatch to props
// const mapDispatchToProps = dispatch => {
//   return {
//     setDocumentListMode: value => {
//       return dispatch(localActions.);
//     },
//   };
// };

export default connect(
  mapStateToProps,
  null
)(ChattingContainer);
