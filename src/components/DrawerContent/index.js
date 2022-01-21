// import DrawerContent from './DrawerContent';
import DrawerContent from './DrawerContent';
import { connect } from 'react-redux';
import { actionCreators as UserActions } from '@redux/user';
import { actionCreators as AlertActions } from '@redux/alert';

// map state to props
const mapStateToProps = state => ({
  auth: state.user.auth,
  deployedServices : state.deployedServices
});

const mapDispatchToProps = dispatch => {
  return {
    changeCompanyRequest: (auth, company) =>
      dispatch(UserActions.changeCompanyRequest(auth, company)),
    setAlert: params => dispatch(AlertActions.setAlert(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
