import UserInfoScreenContainer from './UserInfoScreenContainer';
import { connect } from 'react-redux';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth
});

export default connect(mapStateToProps)(UserInfoScreenContainer);
