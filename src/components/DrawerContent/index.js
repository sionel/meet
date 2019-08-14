import DrawerContentContainer from './DrawerContentContainer';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '../../redux/modules/user';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth
});

const mapDispatchToProps = dispatch => {
  return {
    changeCompanyRequest: (auth, company) =>
      dispatch(UserActions.changeCompanyRequest(auth, company))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DrawerContentContainer);
