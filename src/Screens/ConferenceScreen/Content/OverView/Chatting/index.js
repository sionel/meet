import ChattingContainer from './ChattingContainer';
import { connect } from 'react-redux';
import { actionCreators as localActions } from '../../../../../redux/modules/local';

// map state to props
const mapStateToProps = state => ({
  messages: state.local.message,
  user: state.local.user,
  list: state.participants.list
});

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    receiceConferenceMessage: value => {
      return dispatch(localActions.receiceConferenceMessage(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChattingContainer);
