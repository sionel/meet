import { connect } from 'react-redux';
import BottomAreaContainer from './BottomAreaContainer';

const mapStateToProps = state => {
  const {
    local: { conferenceMode },
    screenShare: { isScreenShare }
  } = state;

  return { conferenceMode, isScreenShare };
};

export default connect(mapStateToProps, null)(BottomAreaContainer);
