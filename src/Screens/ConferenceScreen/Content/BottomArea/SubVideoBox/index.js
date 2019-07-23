import { connect } from 'react-redux';
import SubVideoBoxContainer from './SubVideoBoxContainer';

const mapStateToProps = state => {
  const {
    local: { user },
    mainUser: { mainUserId },
    participants: { list }
  } = state;

  // console.log('PARTICIPANT : ', participants);

  return {
    mainUserId,
    user,
    participants: list
  };
};

export default connect(
  mapStateToProps,
  null
)(SubVideoBoxContainer);
