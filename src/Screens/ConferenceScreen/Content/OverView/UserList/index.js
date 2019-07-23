import UserListContainer from './UserListContainer';
import { connect } from 'react-redux';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  user: state.local.user,
  users: state.participants.list,
  attributes: state.documentShare.attributes,
  presenter: state.documentShare.presenter,
});

export default connect(
  mapStateToProps,
  null
)(UserListContainer);
